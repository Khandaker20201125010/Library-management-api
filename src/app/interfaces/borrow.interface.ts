import { Types } from "mongoose";

export interface Iborrow {
  book: Types.ObjectId; // was: string
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}