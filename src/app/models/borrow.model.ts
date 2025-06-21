import mongoose, { Schema, model } from "mongoose";
import { Iborrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<Iborrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "At least one copy must be borrowed"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model<Iborrow>("Borrow", borrowSchema);
