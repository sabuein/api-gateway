// /src/middlewares/logging.mjs

// Middleware to log details of incoming requests (useful for debugging or analytics)
const logger = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route handler
};

export default logger;