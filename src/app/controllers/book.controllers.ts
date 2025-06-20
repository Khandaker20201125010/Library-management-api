import express, { Request, Response } from "express";
import bookModel from "../models/book.model";

export const bookRoutes = express.Router();

bookRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const book = await bookModel.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create book",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

bookRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;

    // Filter setup
    const query: any = {};
    if (filter) {
      query.genre = filter.toString().toUpperCase();
    }

 
    const sortOrder = sort === 'desc' ? -1 : 1;

 
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
