import { Document } from 'mongoose';

export interface IUser extends Document {
  username?: string;
  email?: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  provider: 'local' | 'google' | 'facebook' | 'github';
  providerId?: string;
}