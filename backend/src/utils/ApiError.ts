class ApiError extends Error {
    message!: string;
    statusCode!: number;
    stack!: string;

    constructor(
        statusCode: number,
        message = "something went wrong",
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}