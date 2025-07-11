import express, { Request, Response } from "express";
import bookModel from "../models/book.model";
import borrowModel from "../models/borrow.model";
import { handleError } from "../../utils/errorHandler";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  const { book, quantity, dueDate } = req.body;

  try {
    const foundBook = await bookModel.findById(book);

    if (!foundBook) {
      return handleError(res, 404, "Book not found");
    }

    if (foundBook.copies < quantity) {
      return handleError(res, 400, "Not enough copies available");
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
    handleError(res, 500, "Failed to borrow book", error);
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // Full aggregation with pagination
    const fullSummary = await borrowModel.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    const total = fullSummary.length;
    const paginated = fullSummary.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    handleError(res, 500, "Failed to retrieve summary", error);
  }
});

