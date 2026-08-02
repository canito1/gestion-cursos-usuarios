import { Schema, model, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  teacher: string;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: String, required: true }
}, { timestamps: true });

export const Course = model<ICourse>('Course', CourseSchema);
