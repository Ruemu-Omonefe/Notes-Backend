// routes/user.routes.ts
import express from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
