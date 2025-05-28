import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
// import { protect } from '../middlewares/auth.middleware';

const router = Router();

// router.post('/register',);
// router.post('/login',);
// router.get('/me');

export default router;