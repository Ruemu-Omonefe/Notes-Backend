import { Request, Response } from 'express';
import Note from '../models/note.model';

// export const getNotes = async (req: Request, res: Response) => {
//   try {
//     const notes = await Note.find({ user: (req as any).user.id }).sort({ createdAt: -1 });
//     res.status(200).json(notes);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getNote = async (req: Request, res: Response) => {
//   try {
//     const note = await Note.findOne({ 
//       _id: req.params.id, 
//       user: (req as any).user.id 
//     });
    
//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
    
//     res.status(200).json(note);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const createNote = async (req: Request, res: Response) => {
//   try {
//     const { title, content } = req.body;
//     const note = new Note({ 
//       title, 
//       content, 
//       user: (req as any).user.id 
//     });
    
//     await note.save();
//     res.status(201).json(note);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const updateNote = async (req: Request, res: Response) => {
//   try {
//     const { title, content, isFavorite } = req.body;
    
//     const note = await Note.findOneAndUpdate(
//       { _id: req.params.id, user: (req as any).user.id },
//       { title, content, isFavorite },
//       { new: true }
//     );
    
//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
    
//     res.status(200).json(note);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const deleteNote = async (req: Request, res: Response) => {
//   try {
//     const note = await Note.findOneAndDelete({ 
//       _id: req.params.id, 
//       user: (req as any).user.id 
//     });
    
//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
    
//     res.status(200).json({ message: 'Note deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, numberOfPages, coverDesign } = req.body;
      if (!title || !numberOfPages || !coverDesign)  res.status(400).json({ message: 'Missing required fields' });
  
    const pages = Array.from({ length: numberOfPages }, (_, i) => ({ pageNumber: i + 1 }));
    const note = await Note.create({ userId: (req.user as any)._id, title, numberOfPages, coverDesign, pages });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note', error: err });
  }
};


// export const createNote = async (req: Request, res: Response) => {
//   const { title, numberOfPages, coverDesign } = req.body;

//   if (!title || !numberOfPages || !coverDesign)
//     return res.status(400).json({ message: 'Missing required fields' });

//   const pages = Array.from({ length: numberOfPages }, (_, i) => ({
//     pageNumber: i + 1,
//   }));

//   const note = await Note.create({
//     userId: req.user.id,
//     title,
//     numberOfPages,
//     coverDesign,
//     pages,
//   });

//   res.status(201).json(note);
// };


