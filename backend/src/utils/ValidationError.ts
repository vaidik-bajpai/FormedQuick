import { ApiError } from "./ApiError.js";

class ValidationError extends ApiError {
    errors: Record<string, string> 

    constructor(
        statusCode: number,
        message = "something went wrong",
        errors = {},
        stack?: string,
    ) {
        super(statusCode, message, stack);
        this.errors = errors
    }
}

export {ValidationError}