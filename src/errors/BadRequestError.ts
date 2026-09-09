import AppError from "./AppError";

class BadRequestError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}

export default BadRequestError;