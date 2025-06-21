import mongoose, { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'], 
      trim: true 
    },
    author: { 
      type: String, 
      required: [true, 'Author is required'], 
      trim: true 
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      uppercase: true
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    copies: {
      type: Number,
      required: [true, 'Copies is required'],
      min: [0, 'Copies must be a positive number'],
      default: 1
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);
bookSchema.methods.updateAvailability = function () {
  this.available = this.copies > 0;
  return this.save();
};

export default mongoose.model<IBook>('Book', bookSchema);