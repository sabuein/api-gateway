import winston from "winston";

// /src/middlewares/logging.mjs

// Middleware to log details of incoming requests (useful for debugging or analytics)
const loggerX = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} url::${req.url}`);
    console.log(`sessionId: ${req.cookies.sessionId}`);
    next(); // Pass control to the next middleware or route handler
};

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});

export default loggerX;