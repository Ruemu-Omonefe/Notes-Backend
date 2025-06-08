import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};`         `

export function getUserById(req: Request, res: Response) {
    const id = req.params.id
    User.findById(id, '-password').then((user) => {
        res.status(200).send(JSON.stringify(user))
    }).catch((err) => {
        res.status(404).send(err.message)
    })
}
