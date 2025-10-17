import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ValidationError } from "../utils/ValidationError.js";
import { getErrorMessage } from "../utils/error.js";

export default function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent || process.env.DEBUG_APP === "true") {
        next(error);
        return;
    }

    if(error instanceof ValidationError){
        res.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors,
        })
        return
    }

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        error: {
        message:
            getErrorMessage(error) ||
            "An error occurred. Please view logs for more details",
        },
    });
}