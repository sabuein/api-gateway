// /src/middlewares/authentication.mjs
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwt as authentication } from "../config/env.mjs";

// Middleware to ensure only authenticated users can access certain routes
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        // Verify the token
        const decoded = jwt.verify(token, authentication.secret);
        
        // Attach user info to request object
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }
};

const getNewSecret = () => crypto.randomBytes(64).toString("hex");

const generateAccessToken = (username) => {
    return jwt.sign(username, authentication.secret, { expiresIn: "1800s" });
};

export {
    authenticate,
    generateAccessToken
};