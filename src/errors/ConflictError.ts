import AppError from "./AppError";

class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
    }
}

export default ConflictError;