"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        error: {
            path: req.originalUrl,
            method: req.method
        }
    });
};
exports.default = notFound;
