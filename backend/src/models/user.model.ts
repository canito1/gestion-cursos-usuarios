import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'profesor' | 'estudiante';
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'profesor', 'estudiante'] }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);
