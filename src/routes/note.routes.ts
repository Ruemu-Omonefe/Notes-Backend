import { Router } from 'express';
import { createNote } from '../controllers/note.controller';

const router = Router();

router.post('/', createNote);
// router.post('/');
// router.post('/login',);
// router.get('/me');

export default router;