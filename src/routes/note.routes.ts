import { Router } from 'express';
import { createNote, deleteNote, getUserNotes, getNoteById, updateNote, shareNote, getSharedNote} from '../controllers/note.controller';
import multer from 'multer';

const router = Router();

// Use multer for parsing multipart/form-data
const upload = multer({ dest: 'uploads/' }); 


router.post('/', upload.any(), createNote);
router.put('/:id', upload.any(), updateNote);

router.get('/:id', getNoteById);
router.get('/user/:userId', upload.any(), getUserNotes );
router.delete('/:id', upload.any(), deleteNote);
router.post('/:noteId/share', shareNote);
router.get('/shared/:sharedId', getSharedNote);

export default router;