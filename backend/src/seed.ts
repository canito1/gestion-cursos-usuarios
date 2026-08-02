import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model';
import { Course } from './models/course.model';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/gestion-cursos';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  const usersCount = await User.countDocuments().exec();
  if (usersCount === 0) {
    console.log('Seeding users...');
    await User.create([
      { username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
      { username: 'profesor', password: 'profesor123', name: 'Profesor López', role: 'profesor' },
      { username: 'estudiante', password: 'estudiante123', name: 'Estudiante Pérez', role: 'estudiante' }
    ]);
  }

  const coursesCount = await Course.countDocuments().exec();
  if (coursesCount === 0) {
    console.log('Seeding courses...');
    await Course.create([
      { title: 'Matemáticas 101', description: 'Álgebra y cálculo básico', teacher: 'Profesor López' },
      { title: 'Programación Web', description: 'Introducción a Angular y Node.js', teacher: 'Profesor López' }
    ]);
  }

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error', err);
  process.exit(1);
});
