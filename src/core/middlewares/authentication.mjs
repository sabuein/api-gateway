"use strict";

// /src/core/middlewares/authentication.mjs
import { access, verify } from "../utilities/security.mjs";
import { cookieOptions } from "../configuration/storage.mjs";
import { V3 } from "paseto"; // { sign, verify, encrypt, decrypt, generateKey }

const basicAuthUsers = [{ username: "sabuein", password: "0123456789" }];

const validateCredentials = () => {};

// Always store tokens or identifiers, not raw credentials or sensitive data.

// Cookies

/** Sessions can store complex user data, such as roles, permissions, and preferences, without bloating client-side storage. */
const createSession = () => {};
const validateSession = () => {};

/** JWTs are often employed for authentication and authorization to enable stateless and scalable systems, they consist of three parts, encoded in Base64. They are useful for Single Sign-On (SSO). */
const createAndSignJWT = () => {
    // Send a header back to save on the client-side
};
const validateJWT = () => {};

/** We need to store a separate list of revoked JWT tokens and check whether the token received is part of this list. */
const revokingJWTAccess = () => {};

/** Platform Agnostic SEcurity TOkens (PASETO) is a modern alternative to JWTs. It is designed with a focus on security, simplicity, and cryptographic best practices. PASETO tokens are local (encrypted) or public (signed), ensuring that sensitive data is either securely encrypted or signed for authenticity. */
const createToken = () => {
    // This should create public and private keys
};
const validateToken = async (token, publicKey) => {
    const payload = await V3.verify(token, publicKey);
    return payload;
    // { sub: 'johndoe', iat: '2019-07-01T15:22:47.982Z' }
};

const createSecureSession = async (privateKey) => {
    const token = await V3.sign({ sub: "johndoe" }, privateKey);
    return token;
    // v4.public.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoiMjAyMS0wOC0wM1QwNTozOTozNy42NzNaIn3AW3ri7P5HpdakJmZvhqssz7Wtzi2Rb3JafwKplLoCWuMkITYOo5KNNR5NMaeAR6ePZ3xWUcbO0R11YLb02awO
};

// Implement Multi-Factor Authentication (MFA)
// Time-based one-time passwords (TOTP) via apps like Google Authenticator.
// SMS-based OTPs as a fallback, though less secure than app-based methods.
// Push notifications for MFA via secure mobile apps.

/** Basic authentication requiring users to provide valid credentials to ensure they can access certain routes. */
const BasicAuth = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Basic "))
            throw new Error(
                "The HTTP request didn't include a basic authorization header."
            );

        const basicToken = new Buffer.from(authHeader.split(" ")[1], "base64")
            .toString()
            .split(":");
        if (!basicToken) {
            const error = new Error(
                "The provided basic authorization header couldn't be parsed."
            );
            error.status = 403;
            next(error);
        }

        const [user, password] = basicToken;
        const authorized = basicAuthUsers.filter(
            (user) => user.username === user && user.password === password
        );
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
    let bearerToken = null;
    const authHeader = req.headers["authorization"],
        accessBearerToken = req.cookies.access,
        refreshBearerToken = req.signedCookies.refresh;

    try {
        if (!!authHeader && authHeader.startsWith("Bearer ")) {
            bearerToken = req.headers["authorization"].split(" ")[1];
            console.log("We got a bearer token from the header!");
        } else if (!!accessBearerToken) {
            bearerToken = accessBearerToken;
            console.log("We got a bearer access token from the cookies!");
        } else if (!accessBearerToken && !!refreshBearerToken) {
            bearerToken = refreshBearerToken;
            console.log("We got a bearer refresh token from the cookies!");
        } else {
            const error = new Error(
                "The HTTP request didn't include a bearer authorization token."
            );
            error.status = 403;
            next(error);
        }
    } catch (error) {
        error.status = 401;
        next(error);
    }

    const decodedResult = verify(bearerToken);
    if (!!bearerToken && !!decodedResult) {
        try {
            const user = {
                anonymous: decodedResult.anonymous,
                id: decodedResult.id,
                username: decodedResult.username,
                email: decodedResult.email,
                firstName: decodedResult.firstName,
                lastName: decodedResult.lastName,
                role: decodedResult.role,
                status: decodedResult.status,
                settings: decodedResult.settings,
                lastLogin: decodedResult.lastLogin,
                failedLoginAttempts: decodedResult.failedLoginAttempts,
                createdAt: decodedResult.createdAt,
                updatedAt: decodedResult.updatedAt,
            };

            if (!accessBearerToken && !!refreshBearerToken) {
                const accessToken = access(user);
                req.header("Authorization", `Bearer ${accessToken}`);
                res.cookie("access", accessToken, cookieOptions("access"));
            }

            req.session.user = user;
            res.locals.user = user;
            res.locals.authenticated = !user.anonymous;

            next();
        } catch (error) {
            error.status = 403;
            next(error);
        }
    } else {
        const error = new Error(
            "The provided authorization token couldn't be verified."
        );
        error.status = 403;
        next(error);
    }
};

export { BasicAuth, BearerAuth };