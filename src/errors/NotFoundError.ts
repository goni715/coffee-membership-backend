import AppError from "./AppError";

class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
    }
}

export default NotFoundError;