"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = __importDefault(require("../models/book.model"));
const zod_1 = require("zod");
const errorHandler_1 = require("../../utils/errorHandler");
exports.bookRoutes = express_1.default.Router();
const BookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    genre: zod_1.z.string().min(1, "Genre is required"),
    isbn: zod_1.z.string().min(1, "ISBN is required"),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(0, "Copies must be a positive number"),
    available: zod_1.z.boolean(),
});
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = BookSchema.parse(req.body);
        const book = yield book_model_1.default.create(parsed);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            (0, errorHandler_1.handleError)(res, 400, "Validation failed", error);
            return;
        }
        (0, errorHandler_1.handleError)(res, 500, "Failed to create book", error);
    }
}));
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter ? { genre: req.query.filter } : {};
        const sortBy = req.query.sortBy || "createdAt";
        const sortA = req.query.sort === "asc" || req.query.sort === "desc"
            ? req.query.sort
            : "desc";
        const sortOrder = sortA === "desc" ? -1 : 1;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
        const skip = (page - 1) * limit;
        const total = yield book_model_1.default.countDocuments(filter);
        const books = yield book_model_1.default
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
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, 500, "Failed to retrieve books", error);
    }
}));
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.default.findById(bookId);
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
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, 500, "Failed to retrieve books", error);
    }
}));
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updateData = req.body;
        const updatedBook = yield book_model_1.default.findByIdAndUpdate(bookId, updateData, {
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
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, 500, "Failed to retrieve books", error);
    }
}));
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deletedBook = yield book_model_1.default.findByIdAndDelete(bookId);
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
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, 500, "Failed to retrieve books", error);
    }
}));
