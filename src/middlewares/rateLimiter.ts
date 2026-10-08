import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    standardHeaders: "draft-8",
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes.",
    },
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: {
        success: false,
        message: 'Too many attempts, please try again after 15 minutes.',
    },
});