import AppError from "./AppError";

class UnprocessableError extends AppError {
    constructor(message: string) {
        super(422, message);
    }
}

export default UnprocessableError;