"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedNote = exports.getSharedNotes = exports.shareNote = exports.getUserNotes = exports.getNoteById = exports.deleteNote = exports.updateNote = exports.createNote = void 0;
const note_model_1 = __importDefault(require("../models/note.model"));
const cloudinary_config_1 = require("../configs/cloudinary.config");
const promises_1 = __importDefault(require("fs/promises"));
// import { nanoid } from 'nanoid';
const uuid_1 = require("uuid");
const createNote = async (req, res) => {
    try {
        const { title, userId, numberOfPages, coverDesign } = req.body;
        let contentOrder = [];
        console.log('Received content:', req.body.content);
        console.log('Received content:', typeof (req.body.content));
        try {
            contentOrder = typeof req.body.content === 'string' ? JSON.parse(req.body.content) : req.body.content;
            console.log('✅ Parsed contentOrder:', contentOrder);
        }
        catch (err) {
            res.status(400).json({ message: "Invalid content JSON format." });
            return;
        }
        const files = req.files || [];
        const processedContent = [];
        for (let item of contentOrder) {
            let contentValue = item.content;
            if (item.type === "image" || item.type === "audio") {
                const file = files.find(f => f.originalname === item.content);
                if (!file) {
                    res.status(400).json({ error: `File ${item.content} not found in upload.` });
                    return;
                }
                const resourceType = item.type === "image" ? "image" : "video";
                const uploadResult = await (0, cloudinary_config_1.uploadToCloudinary)(file.path, resourceType, file.originalname);
                await promises_1.default.unlink(file.path);
                contentValue = uploadResult.url;
            }
            processedContent.push({
                type: item.type,
                content: contentValue,
                metadata: item.metadata || {},
            });
        }
        const newNote = new note_model_1.default({
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
    }
    catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Internal Server Errors", error: error });
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, coverDesign, numberOfPages, isFavorite } = req.body;
        const files = req.files || [];
        let updateData = {
            updatedAt: new Date(),
        };
        if (title)
            updateData.title = title;
        if (coverDesign)
            updateData.coverDesign = coverDesign;
        if (numberOfPages)
            updateData.numberOfPages = Number(numberOfPages);
        if (isFavorite)
            updateData.isFavorite = isFavorite;
        if (req.body.content) {
            let contentOrder = [];
            try {
                contentOrder = typeof req.body.content === "string"
                    ? JSON.parse(req.body.content)
                    : req.body.content;
            }
            catch (error) {
                res.status(400).json({ error: "Invalid content JSON." });
            }
            const processedContent = [];
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
                        const result = await (0, cloudinary_config_1.uploadToCloudinary)(uploadedFile.path, resourceType, uploadedFile.originalname);
                        await promises_1.default.unlink(uploadedFile.path);
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
        const updatedNote = await note_model_1.default.findByIdAndUpdate(noteId, updateData, { new: true });
        if (!updatedNote) {
            res.status(404).json({ error: "Note not found." });
        }
        res.status(200).json(updatedNote);
    }
    catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Failed to update note", error });
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const deletedNote = await note_model_1.default.findByIdAndDelete(noteId);
        if (!deletedNote) {
            res.status(404).json({ error: "Note not found." });
        }
        res.status(200).json({ message: "Note deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Failed to delete note", error });
    }
};
exports.deleteNote = deleteNote;
const getNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await note_model_1.default.findById(noteId);
        if (!note) {
            res.status(404).json({ error: "Note not found." });
        }
        res.status(200).json(note);
    }
    catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: "Failed to fetch note", error });
    }
};
exports.getNoteById = getNoteById;
const getUserNotes = async (req, res) => {
    try {
        // const userId = req.query.userId as string;
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "User ID is required." });
        }
        const notes = await note_model_1.default.find({ userId }).sort({ createdAt: -1 });
        if (!notes || notes.length === 0) {
            res.status(404).json({ message: "No notes found for this user." });
            return;
        }
        res.status(200).json({ NumberOfNotes: notes.length, notes: notes });
        // console.log("Fetched notes for user:", userId);
        // console.log("Notes:", notes);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Failed to fetch notes", error });
    }
};
exports.getUserNotes = getUserNotes;
// Share Note Functionality
const shareNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        // Simulate sharing logic, e.g., generate a share link or set a flag
        const note = await note_model_1.default.findById(noteId);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // You can store a shared flag or generate a share token
        note.isShared = true;
        note.sharedId = (0, uuid_1.v4)();
        await note.save();
        res.status(200).json({ message: 'Note shared successfully', shareUrl: `${process.env.FRONTEND_URL}/notebook/share/${note.sharedId}` });
    }
    catch (error) {
        console.error('Share error:', error);
        res.status(500).json({ message: 'Server error while sharing note' });
    }
};
exports.shareNote = shareNote;
// Get All Shared Notes for A User Functionality
const getSharedNotes = async (req, res) => {
    const userId = req.params.userId;
    try {
        const notes = await note_model_1.default.find({ userId, isShared: true });
        if (!notes || notes.length === 0) {
            res.status(404).json({ message: "No shared notes found for this user." });
            return;
        }
        res.status(200).json({ notes });
    }
    catch (error) {
        console.error("Error fetching shared notes:", error);
        res.status(500).json({ message: "Failed to fetch shared notes", error });
    }
};
exports.getSharedNotes = getSharedNotes;
// Get Shared Note by Id Functionality
const getSharedNote = async (req, res) => {
    const { sharedId } = req.params;
    try {
        const note = await note_model_1.default.findOne({ sharedId, isShared: true });
        if (!note) {
            res.status(404).json({ error: "Shared note not found" });
        }
        else {
            res.json({
                title: note.title,
                content: note.content,
                coverDesign: note.coverDesign,
                numberOfPages: note.numberOfPages,
                createdAt: note.createdAt,
            });
        }
    }
    catch (err) {
        console.error("Error fetching shared note:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getSharedNote = getSharedNote;
