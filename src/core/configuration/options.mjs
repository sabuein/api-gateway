"use strict";

import path from "path";
// /src/configuration/storage.mjs
import { authentication } from "./env.mjs";

/** Generate cookie config file. */
const cookieOptions = (type) => {
    // The size is typically 4KB per cookie
    return {
        domain: "app.abuein.com",
        path: "/",
        signed: type === "access" ? false : true, // if you use the secret with cookieParser
        httpOnly: type === "access" ? false : true, // Prevents access to cookies via JavaScript, mitigating Cross-Site Scripting (XSS) risks.
        sameSite: "strict", // Restricts cross-site requests, reducing CSRF risks. SameSite=Strict for high-security applications. SameSite=Lax for applications needing limited third-party cookie usage.
        maxAge: type === "access" ? 10 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000, // time-to-live (TTL) in seconds: 10 minutes for access, one month for others, 1*60*1000 === 1 minute because we are using "cookie-parser" to set cookies (remove this option and cookie will die when browser is closed), use short expiration times for sensitive data.
        secure: true, // Ensures cookies are sent only over HTTPS, mitigating Man-in-the-Middle (MITM) risks.
        // there are many other params you can find here https://www.npmjs.com/package/cookie#options-1
    };
};

/** Generate session config file. */
const sessionOptions = () => {
    return {
        name: "abuein",
        secret: authentication.session,
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        cookie: { secure: true }, // Set `secure: true` if using HTTPS
    };
};

const stripeOptions = () => {
    return {
        apiVersion: "2023-10-16",
        appInfo: {
            // For sample support and debugging, not required for production:
            name: "stripe-samples/accept-a-payment/payment-element",
            version: "0.0.2",
            url: "https://github.com/stripe-samples",
        },
    };
}

export { cookieOptions, sessionOptions, stripeOptions };