import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import {generateToken} from '../utils/jwt.util';
import passport from 'passport';

// User registration controller
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = new User({ username, email, password, provider: 'local'});
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({ token: token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User login controller
export const login = async (req: Request, res: Response, next: NextFunction) => {

  passport.authenticate('local', { session: false }, (err: any, user: any, info: { message: any; }) => {
      if (err || !user) return res.status(400).json({ message: info?.message || 'Login failed' });
  
      const token = generateToken(user);
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email
      };
      res.json({ user: userData, token });
    })(req, res, next);
};

export const oauthSuccess = async (req: Request, res: Response) => {
  if (!req.user) return res.redirect('/login');
  const user = req.user as any;
  const token = generateToken(user._id);
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
};




export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }else{
      res.status(200).json({ id: user._id, username: user.username, email: user.email });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};