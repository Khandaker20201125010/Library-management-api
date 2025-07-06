import express, { Request, Response } from "express";
import bookModel from "../models/book.model";
import { z } from "zod";
import { handleError } from "../../utils/errorHandler";

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
      handleError(res, 400, "Validation failed", error);
      return;
    }

    handleError(res, 500, "Failed to create book", error);
  }
});

bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter ? { genre: req.query.filter } : {};
    const sortBy = (req.query.sortBy as string) || "createdAt";
    
    const sortA =
      req.query.sort === "asc" || req.query.sort === "desc"
        ? req.query.sort
        : "desc";
    const sortOrder = sortA === "desc" ? -1 : 1;

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
    const skip = (page - 1) * limit;

    const total = await bookModel.countDocuments(filter);

    const books = await bookModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully 📚",
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve books", error);
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
    handleError(res, 500, "Failed to retrieve books", error);
  }
});

bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updateData = req.body;

    const updatedBook = await bookModel.findByIdAndUpdate(bookId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
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
      data: updatedBook,
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve books", error);
  }
});
bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    const deletedBook = await bookModel.findByIdAndDelete(bookId);

    if (!deletedBook) {
      res.status(404).json({
        success: false,
        message: `Book with ID ${bookId} not found`,
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve books", error);
  }
});
