import mongoose, { Schema } from 'mongoose';
import { INote, IPage } from '../interfaces/note.interface';


const PageSchema = new Schema<IPage>({
  pageNumber: { type: Number, required: true },
  text: String,
  images: [String],
  audios: [String],
});

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    coverDesign: { type: String, required: true },
    numberOfPages: { type: Number, required: true },
    pages: [PageSchema],
  },
  { timestamps: true }
);


export default mongoose.model<INote>('Note', NoteSchema);