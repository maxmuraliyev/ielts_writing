import rateLimit from 'express-rate-limit';
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 40, // max 40 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this client. Please wait a moment before sending another assessment.'
    }
});
