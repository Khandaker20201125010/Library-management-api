import express, { Request, Response } from "express";
import bookModel from "../models/book.model";
import borrowModel from "../models/borrow.model";
import { handleError } from "../../utils/errorHandler";


export const borrowRoutes = express.Router();

// Borrow a book
borrowRoutes.post("/", async (req: Request, res: Response) => {
  const { book, quantity, dueDate } = req.body;

  try {
    const foundBook = await bookModel.findById(book);

    if (!foundBook) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    if (foundBook.copies < quantity) {
      res.status(400).json({
        success: false,
        message: "Not enough copies available",
      });
    }


    foundBook.copies -= quantity;
    await foundBook.updateAvailability();

    const borrow = await borrowModel.create({ book, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
      handleError(res, 500, "Failed to retrieve books", error);
    }
});
