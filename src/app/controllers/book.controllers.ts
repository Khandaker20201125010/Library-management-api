import express, { Request, Response } from "express";
import bookModel from "../models/book.model";
import { z } from "zod";

export const bookRoutes = express.Router();

const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().optional(),
  copies: z.number().min(0, "Copies must be a positive number"),
  available: z.boolean(),
});

bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = BookSchema.parse(req.body);
    const book = await bookModel.create(parsed);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.flatten(),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "asc",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter.toString().toUpperCase();
    }

    const sortOrder = sort === "desc" ? -1 : 1;

    const books = await bookModel
      .find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        error: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve book",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
