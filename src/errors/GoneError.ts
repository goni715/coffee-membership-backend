import AppError from "./AppError";

class GoneError extends AppError {
    constructor(message: string) {
        super(410, message);
    }
}

export default GoneError;