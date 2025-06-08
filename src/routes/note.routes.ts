import { Router } from 'express';
import { createNote, updateNote } from '../controllers/note.controller';
import multer from 'multer';

const router = Router();

// Use multer for parsing multipart/form-data
const upload = multer({ dest: 'uploads/' }); 

router.post('/', upload.any(), createNote);
router.put('/:id', upload.any(), updateNote);
// router.post('/');
// router.post('/login',);
// router.get('/me');

export default router;