import mongoose, { Schema } from "mongoose";
import { IContentItem, INote } from "../interfaces/note.interface";


const ContentItemSchema = new Schema<IContentItem>({
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

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  coverDesign: { type: String, required: true },
  numberOfPages: { type: Number, required: true },
  content: [ContentItemSchema], // array preserves order
  isFavorite: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  sharedId: { type: String, unique: true, sparse: true } // optional unique identifier

}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);
