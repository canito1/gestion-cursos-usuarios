import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model';
import { Course } from './models/course.model';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'gestion-cursos-secret';
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/gestion-cursos';

interface AuthPayload {
  id: string;
  username: string;
  role: 'admin' | 'profesor' | 'estudiante';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

app.use(cors());
app.use(express.json());

// Log requests that result in client/server errors (status >= 400) for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      try {
        console.error(`[HTTP ${res.statusCode}] ${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`);
      } catch (e) {
        console.error(`[HTTP ${res.statusCode}] ${req.method} ${req.originalUrl} - (could not stringify body)`);
      }
    }
  });
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error', err));

function generateToken(payload: { id: string; username: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

function authorizeRoles(roles: AuthPayload['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
}

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = generateToken({ id: user._id.toString(), username: user.username, role: user.role });

  res.json({ token, user: { id: user._id, name: user.name, role: user.role, username: user.username } });
});

app.get('/api/profile', authenticateToken, async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).exec();
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ id: user._id, username: user.username, name: user.name, role: user.role });
});

app.get('/api/users', authenticateToken, authorizeRoles(['admin']), async (req: Request, res: Response) => {
  const all = await User.find().select('-password').exec();
  const mapped = all.map(u => ({ id: u._id, username: u.username, name: u.name, role: u.role }));
  res.json(mapped);
});

// Allow public registration: anyone can create an 'estudiante' account.
app.post('/api/users', async (req: Request, res: Response) => {
  const { username, password, name, role } = req.body;

  const desiredRole = role ?? 'estudiante';

  if (!username || !password || !name) return res.status(400).json({ message: 'Datos incompletos para crear usuario' });

  const exists = await User.findOne({ username }).exec();
  if (exists) return res.status(409).json({ message: 'Nombre de usuario ya existe' });

  // By default non-authenticated requests create 'estudiante'. If a valid token
  // is provided and belongs to an admin, allow creating with the requested role.
  let finalRole = 'estudiante';
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
      if (payload.role === 'admin' && ['admin', 'profesor', 'estudiante'].includes(desiredRole)) {
        finalRole = desiredRole;
      }
    } catch {
      // invalid token -> ignore and fall back to 'estudiante'
    }
  }

  const newUser = new User({ username, password, name, role: finalRole });
  await newUser.save();
  res.status(201).json({ id: newUser._id, username: newUser.username, name: newUser.name, role: newUser.role });
});

app.put('/api/users/:id', authenticateToken, authorizeRoles(['admin']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, password } = req.body;
  const updated = await User.findByIdAndUpdate(id, { ...(name && { name }), ...(role && { role }), ...(password && { password }) }, { new: true }).select('-password').exec();
  if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(updated);
});

app.delete('/api/users/:id', authenticateToken, authorizeRoles(['admin']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id).exec();
  if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.status(204).send();
});

// Public list of courses (no auth required) — used by dashboard summary
app.get('/api/courses', async (req: Request, res: Response) => {
  const all = await Course.find().exec();
  res.json(all);
});

app.post('/api/courses', authenticateToken, authorizeRoles(['admin', 'profesor']), async (req: Request, res: Response) => {
  const { title, description, teacher } = req.body;
  if (!title || !description || !teacher) return res.status(400).json({ message: 'Datos incompletos para crear curso' });
  const newCourse = new Course({ title, description, teacher });
  await newCourse.save();
  res.status(201).json(newCourse);
});

app.put('/api/courses/:id', authenticateToken, authorizeRoles(['admin', 'profesor']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, teacher } = req.body;
  const updated = await Course.findByIdAndUpdate(id, { ...(title && { title }), ...(description && { description }), ...(teacher && { teacher }) }, { new: true }).exec();
  if (!updated) return res.status(404).json({ message: 'Curso no encontrado' });
  res.json(updated);
});

app.delete('/api/courses/:id', authenticateToken, authorizeRoles(['admin']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Course.findByIdAndDelete(id).exec();
  if (!deleted) return res.status(404).json({ message: 'Curso no encontrado' });
  res.status(204).send();
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`API backend escuchando en http://localhost:${PORT}`);
});
