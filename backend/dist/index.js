"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const PORT = 4000;
const JWT_SECRET = 'gestion-cursos-secret';
const users = [
    { id: '1', username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
    { id: '2', username: 'profesor', password: 'profesor123', name: 'Profesor López', role: 'profesor' },
    { id: '3', username: 'estudiante', password: 'estudiante123', name: 'Estudiante Pérez', role: 'estudiante' }
];
const courses = [
    { id: '1', title: 'Matemáticas 101', description: 'Álgebra y cálculo básico', teacher: 'Profesor López' },
    { id: '2', title: 'Programación Web', description: 'Introducción a Angular y Node.js', teacher: 'Profesor López' }
];
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}
function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
}
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, username: user.username } });
});
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user?.id);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ id: user.id, username: user.username, name: user.name, role: user.role });
});
app.get('/api/users', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    res.json(users.map(({ password, ...rest }) => rest));
});
app.post('/api/users', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    const { username, password, name, role } = req.body;
    if (!username || !password || !name || !role) {
        return res.status(400).json({ message: 'Datos incompletos para crear usuario' });
    }
    const exists = users.some(u => u.username === username);
    if (exists) {
        return res.status(409).json({ message: 'Nombre de usuario ya existe' });
    }
    const newUser = {
        id: String(Date.now()),
        username,
        password,
        name,
        role
    };
    users.push(newUser);
    res.status(201).json({ id: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role });
});
app.put('/api/users/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    const { id } = req.params;
    const existingUser = users.find(u => u.id === id);
    if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const { name, role, password } = req.body;
    existingUser.name = name ?? existingUser.name;
    existingUser.role = role ?? existingUser.role;
    if (password) {
        existingUser.password = password;
    }
    res.json({ id: existingUser.id, username: existingUser.username, name: existingUser.name, role: existingUser.role });
});
app.delete('/api/users/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    users.splice(index, 1);
    res.status(204).send();
});
app.get('/api/courses', authenticateToken, (req, res) => {
    res.json(courses);
});
app.post('/api/courses', authenticateToken, authorizeRoles(['admin', 'profesor']), (req, res) => {
    const { title, description, teacher } = req.body;
    if (!title || !description || !teacher) {
        return res.status(400).json({ message: 'Datos incompletos para crear curso' });
    }
    const newCourse = { id: String(Date.now()), title, description, teacher };
    courses.push(newCourse);
    res.status(201).json(newCourse);
});
app.put('/api/courses/:id', authenticateToken, authorizeRoles(['admin', 'profesor']), (req, res) => {
    const { id } = req.params;
    const existingCourse = courses.find(c => c.id === id);
    if (!existingCourse) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const { title, description, teacher } = req.body;
    existingCourse.title = title ?? existingCourse.title;
    existingCourse.description = description ?? existingCourse.description;
    existingCourse.teacher = teacher ?? existingCourse.teacher;
    res.json(existingCourse);
});
app.delete('/api/courses/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    const { id } = req.params;
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }
    courses.splice(index, 1);
    res.status(204).send();
});
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});
app.listen(PORT, () => {
    console.log(`API backend escuchando en http://localhost:${PORT}`);
});
