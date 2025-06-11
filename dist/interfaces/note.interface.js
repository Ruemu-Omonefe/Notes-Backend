"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Note.ts
const mongoose_1 = require("mongoose");
const ContentItemSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['text', 'image', 'audio'], required: true },
    content: { type: String, required: true },
    metadata: {
        altText: String,
        duration: Number,
        size: Number,
        width: Number,
        height: Number,
    }
});
