// models/Note.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMediaMetadata {
  altText?: string;
  duration?: number;
  size?: number;
  width?: number;
  height?: number;
}

export interface IContentItem {
  type: 'text' | 'image' | 'audio';
  content: string; // text content or cloudinary URL
  metadata?: IMediaMetadata;
}

export interface INote extends Document {
  title: string;
  userId: Types.ObjectId;
  coverDesign: string;
  numberOfPages: number;
  content: IContentItem[];
  isFavorite: boolean;
  isShared: boolean;
  sharedId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

