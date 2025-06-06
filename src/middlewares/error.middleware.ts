import { Request, Response, NextFunction } from 'express';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  console.error('err',err);
  console.error('err message',err.message);
  res.status(500).json({ message: 'Something went wrong!' });
};