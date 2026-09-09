import AppError from "./AppError";

class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(401, message);
    }
}

export default UnauthorizedError;