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

    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User login controller
export const login = async (req: Request, res: Response, next: NextFunction) => {

  passport.authenticate('local', { session: false }, (err: any, user: any, info: { message: any; }) => {
      if (err || !user) return res.status(400).json({ message: info?.message || 'Login failed' });
  
      const token = generateToken(user);
      res.json({ user, token });
    })(req, res, next);

  // try {
  //   const { email, password } = req.body;
    
  //   // Check if user exists
  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     return res.status(400).json({ message: 'Invalid credentials' });
  //   }

  //   // Check password
  //   const isMatch = await user.comparePassword(password);
  //   if (!isMatch) {
  //     return res.status(400).json({ message: 'Invalid credentials' });
  //   }

  //   // Generate token
  //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
  //     expiresIn: process.env.JWT_EXPIRE
  //   });

  //   res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
  // } catch (error) {
  //   res.status(500).json({ message: 'Server error' });
  // }
};

export const oauthSuccess = async (req: Request, res: Response) => {
  if (!req.user) return res.redirect('/login');
  const user = req.user as any;
  res.json({ token: generateToken(user._id) });
};


export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};