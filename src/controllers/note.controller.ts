import { Request, Response } from "express";
import Note from "../models/note.model";
import { uploadToCloudinary } from "../configs/cloudinary.config";
import { IContentItem } from "../interfaces/note.interface";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, userId, numberOfPages, coverDesign } = req.body;

    let contentOrder: IContentItem[] = [];
    
    try {
      contentOrder = typeof req.body.content === 'string' ? JSON.parse(req.body.content) : req.body.content;
      console.log('✅ Parsed contentOrder:', contentOrder);
    } catch (err) {
    res.status(400).json({ error: "Invalid content JSON format." });
    }

    const files = req.files as Express.Multer.File[] || [];
    const processedContent: IContentItem[] = [];

    for (let item of contentOrder) {
      let contentValue = item.content;

      if (item.type === "image" || item.type === "audio") {
        const file = files.find(f => f.originalname === item.content);

        if (!file) {
          res.status(400).json({ error: `File ${item.content} not found in upload.` });
          return;
        }

        const resourceType = item.type === "image" ? "image" : "video";
        const uploadResult = await uploadToCloudinary(file.path, resourceType);
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
      coverDesign,
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
    const { title, coverDesign, numberOfPages } = req.body;

    // Parse content
    let contentOrder: IContentItem[] = [];

    try {
      contentOrder = typeof req.body.content === "string" ? JSON.parse(req.body.content) : req.body.content;
    } catch (error) {
      res.status(400).json({ error: "Invalid content JSON." });
    }

    const files = req.files as Express.Multer.File[] || [];

    const processedContent: IContentItem[] = [];

    for (let item of contentOrder) {
      if (!item.type || !item.content) {
        console.warn("Skipping invalid item:", item);
        continue;
      }

      let contentValue = item.content;

      // If it's an image or audio, check if it's a file upload or an existing URL
      if (item.type === "image" || item.type === "audio") {
        const uploadedFile = files.find(f => f.originalname === item.content);

        if (uploadedFile) {
          const resourceType = item.type === "image" ? "image" : "video";
          const result = await uploadToCloudinary(uploadedFile.path, resourceType);
          contentValue = result.url;
        }
        // else: retain the old URL in `content`
      }

      processedContent.push({
        type: item.type,
        content: contentValue,
        metadata: item.metadata || {},
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        title,
        coverDesign,
        numberOfPages,
        content: processedContent,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedNote) {
      res.status(404).json({ error: "Note not found." });
    }

    res.status(200).json(updatedNote);

  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Failed to update note", error });
  }
};
