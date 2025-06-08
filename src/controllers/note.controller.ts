import { Request, Response } from "express";
import Note from "../models/note.model";
import { uploadToCloudinary } from "../configs/cloudinary.config";
import { IContentItem } from "../interfaces/note.interface";
import fs from 'fs/promises';

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
