"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const note_controller_1 = require("../controllers/note.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Use multer for parsing multipart/form-data
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/', upload.any(), note_controller_1.createNote);
router.put('/:id', upload.any(), note_controller_1.updateNote);
router.get('/:id', note_controller_1.getNoteById);
router.get('/user/:userId', upload.any(), note_controller_1.getUserNotes);
router.delete('/:id', upload.any(), note_controller_1.deleteNote);
router.post('/:noteId/share', note_controller_1.shareNote);
router.get('/shared/:sharedId', note_controller_1.getSharedNote);
exports.default = router;
