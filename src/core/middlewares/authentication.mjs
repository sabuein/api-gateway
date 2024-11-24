"use strict";

// /src/core/middlewares/authentication.mjs
import { access, verify } from "../utils/security.mjs";

const basicAuthUsers = [
    { username: "sabuein", password: "0123456789" },
];

/** Basic authentication requiring users to provide valid credentials to ensure they can access certain routes. */
const BasicAuth = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Basic ")) throw new Error("The HTTP request didn't include a basic authorization header.");
        
        const basicToken = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
        if (!basicToken){
            const error = new Error("The provided basic authorization header couldn't be parsed.");
            error.status = 403;
            next(error);
        }

        const [user, password] = basicToken;
        const authorized = basicAuthUsers.filter(user => user.username === user && user.password === password);
        if (authorized.length === 0) {
            const error = new Error("You are not authenticated!");
            error.status = 403;
            next(error);
        }

        res.locals.user = { username: user, password: password };
        res.locals.authenticated = true;

        next();
    } catch (error) {
        error.status = 401;
        next(error);
    }
};

/** with JsonWebToken to ensure only authenticated users can access certain routes. */
const BearerAuth = (req, res, next) => {
    let bearerToken;
    try {
        // const authHeader = req.headers["authorization"];
        // if (!authHeader || !authHeader.startsWith("Bearer ")) throw new Error("The HTTP request didn't include a bearer authorization header.");
        // bearerToken = authHeader.split(" ")[1];
        bearerToken = req.signedCookies.access;
    } catch (error) {
        error.status = 401;
        next(error);
    }

    try {
        const decodedResult = verify(bearerToken);
        res.locals.user = decodedResult;
        res.locals.authenticated = !decodedResult.anonymous;
        next();
    } catch (error) {
        error.status = 403;
        next(error);
    }
};

export {
    BasicAuth,
    BearerAuth,
};