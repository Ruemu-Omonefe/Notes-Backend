import { Document, Types } from 'mongoose';

export interface IPage {
  pageNumber: number;
  text?: string;
  images?: string[]; // URLs or base64
  audios?: string[];
}

export interface INote extends Document {
  userId: Types.ObjectId;
  title: string;
  coverDesign: string; // filename or URL
  numberOfPages: number;
  pages: IPage[];
  createdAt: Date;
  updatedAt: Date;
}