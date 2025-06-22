"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (res, statusCode, message, error) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: formatError(error),
    });
};
exports.handleError = handleError;
const formatError = (error) => {
    if ((error === null || error === void 0 ? void 0 : error.name) === "ZodError" || (error instanceof Error && "flatten" in error)) {
        return {
            name: "ValidationError",
            errors: error.flatten ? error.flatten().fieldErrors : {},
        };
    }
    if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError" && error.errors) {
        const formatted = {};
        for (const key in error.errors) {
            const err = error.errors[key];
            formatted[key] = {
                message: err.message,
                kind: err.kind,
                path: err.path,
                value: err.value,
            };
        }
        return {
            name: error.name,
            errors: formatted,
        };
    }
    return typeof error === "object" && error !== null
        ? error
        : { message: (error === null || error === void 0 ? void 0 : error.toString()) || "An unknown error occurred" };
};
