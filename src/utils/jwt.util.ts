// For handling JWT token generation
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
};
