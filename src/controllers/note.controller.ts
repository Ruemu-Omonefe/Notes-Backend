import { Request, Response } from "express";
import Note from "../models/note.model";
import { getCoverDesign, uploadToCloudinary } from "../configs/cloudinary.config";
import { IContentItem } from "../interfaces/note.interface";
import fs from 'fs/promises';
// import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { get } from "http";



export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, userId, numberOfPages } = req.body;

    let coverDesign = null;
    const coverDesignOptions = await getCoverDesign();
    if (coverDesignOptions) {
      const randomIndex = Math.floor(Math.random() * coverDesignOptions.length);
      coverDesign = coverDesignOptions[randomIndex];
    }

    let contentOrder: IContentItem[] = [];
    try {
      contentOrder = typeof req.body.content === 'string' ? JSON.parse(req.body.content) : req.body.content;
      console.log('✅ Parsed contentOrder:', contentOrder);
    } catch (err) {
      res.status(400).json({ message: "Invalid content JSON format." });
      return;
    }

    const files = req.files as Express.Multer.File[] || [];
    const processedContent: IContentItem[] = [];

    // File Upload
    for (let item of contentOrder) {
      let contentValue = item.content;

      if (item.type === "image" || item.type === "audio") {
        const file = files.find(f => f.originalname === item.content);

        if (!file) {
          res.status(400).json({ error: `File ${item.content} not found in upload.` });
          return;
        }

        const resourceType = item.type === "image" ? "image" : "video";
        const uploadResult = await uploadToCloudinary(file.path, resourceType, file.originalname);
        await fs.unlink(file.path);
        contentValue = uploadResult.url;
      }

      processedContent.push({
        type: item.type,
        content: contentValue,
        metadata: item.metadata || {},
      });
    }

    const newNote = new Note({
      title,
      userId,
      coverDesign: coverDesign,
      numberOfPages,
      content: processedContent,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newNote.save();

    res.status(201).json(newNote);

  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal Server Errors", error: error });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const { title, coverDesign, numberOfPages, isFavorite } = req.body;
    const files = req.files as Express.Multer.File[] || [];

    let updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (coverDesign) updateData.coverDesign = coverDesign;
    if (numberOfPages) updateData.numberOfPages = Number(numberOfPages);
    if (isFavorite) updateData.isFavorite = isFavorite;

    if (req.body.content) {
      let contentOrder: IContentItem[] = [];

      try {
        contentOrder = typeof req.body.content === "string"
          ? JSON.parse(req.body.content)
          : req.body.content;
      } catch (error) {
        res.status(400).json({ error: "Invalid content JSON." });
      }

      const processedContent: IContentItem[] = [];

      for (let item of contentOrder) {
        if (!item.type || !item.content) {
          console.warn("Skipping invalid item:", item);
          continue;
        }

        let contentValue = item.content;
        const isCloudinaryUrl = typeof contentValue === "string" && contentValue.startsWith("http");

        if ((item.type === "image" || item.type === "audio") && !isCloudinaryUrl) {
          const uploadedFile = files.find(f => f.originalname === item.content);

          if (uploadedFile) {
            const resourceType = item.type === "image" ? "image" : "video";
            const result = await uploadToCloudinary(uploadedFile.path, resourceType, uploadedFile.originalname);
            await fs.unlink(uploadedFile.path);
            contentValue = result.url;
          }
        }

        processedContent.push({
          type: item.type,
          content: contentValue,
          metadata: item.metadata || {},
        });
      }

      updateData.content = processedContent;
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, { new: true });

    if (!updatedNote) {
       res.status(404).json({ error: "Note not found." });
    }

    res.status(200).json(updatedNote);

  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note", error });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      res.status(404).json({ error: "Note not found." });
    }

    res.status(200).json({ message: "Note deleted successfully." });

  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Failed to delete note", error });
  }
};
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      res.status(404).json({ error: "Note not found." });
    }

    res.status(200).json(note);

  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Failed to fetch note", error });
  }
};
export const getUserNotes  = async (req: Request, res: Response) => {
  try {
    // const userId = req.query.userId as string;
    const userId = req.params.userId
    if (!userId) {
      res.status(400).json({ error: "User ID is required." });
    }
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    if (!notes || notes.length === 0) {
      res.status(404).json({ message: "No notes found for this user." });
      return;
    }

    res.status(200).json({NumberOfNotes: notes.length, notes: notes});
    // console.log("Fetched notes for user:", userId);
    // console.log("Notes:", notes);

  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Failed to fetch notes", error });
  }
};

// Share Note Functionality
export const shareNote = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;

    // Simulate sharing logic, e.g., generate a share link or set a flag
    const note = await Note.findById(noteId);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // You can store a shared flag or generate a share token
    note.isShared = true;
    note.sharedId = uuidv4();
    await note.save();

    res.status(200).json({ message: 'Note shared successfully', shareUrl: `${process.env.FRONTEND_URL}/notebook/share/${note.sharedId}`});
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({ message: 'Server error while sharing note' });
  }
};

// Get All Shared Notes for A User Functionality
export const getSharedNotes = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const notes = await Note.find({ userId, isShared: true });

    if (!notes || notes.length === 0) {
      res.status(404).json({ message: "No shared notes found for this user." });
      return;
    }

    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error fetching shared notes:", error);
    res.status(500).json({ message: "Failed to fetch shared notes", error });
  }
};

// Get Shared Note by Id Functionality
export const getSharedNote = async (req: Request, res: Response) => {
  const { sharedId } = req.params;

  try {
    const note = await Note.findOne({ sharedId, isShared: true });

    if (!note) {
      res.status(404).json({ error: "Shared note not found" });
    } else {
      res.json({
        title: note.title,
        content: note.content,
        coverDesign: note.coverDesign,
        numberOfPages: note.numberOfPages,
        createdAt: note.createdAt,
      });
    }
  } catch (err) {
    console.error("Error fetching shared note:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

