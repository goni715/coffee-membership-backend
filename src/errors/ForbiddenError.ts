import AppError from "./AppError";

class ForbiddenError extends AppError {
    constructor(message: string) {
        super(403, message);
    }
}

export default ForbiddenError;