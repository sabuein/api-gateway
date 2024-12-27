"use strict";

// /src/configuration/storage.mjs
import { authentication } from "./env.mjs";

/** Generate cookie config file. */
const cookieOptions = (type) => {
    // The size is typically 4KB per cookie
    return {
        domain: "abuein.com",
        signed: (type === "access") ? false : true, // if you use the secret with cookieParser
        httpOnly: (type === "access") ? false : true, // Prevents access to cookies via JavaScript, mitigating Cross-Site Scripting (XSS) risks.
        sameSite: "strict", // Restricts cross-site requests, reducing CSRF risks. SameSite=Strict for high-security applications. SameSite=Lax for applications needing limited third-party cookie usage.
        maxAge: (type === "access") ? 10*60*1000 : 30*24*60*60*1000, // time-to-live (TTL) in seconds: 10 minutes for access, one month for others, 1*60*1000 === 1 minute because we are using "cookie-parser" to set cookies (remove this option and cookie will die when browser is closed), use short expiration times for sensitive data.
        //secure: true, // Ensures cookies are sent only over HTTPS, mitigating Man-in-the-Middle (MITM) risks.
        // there are many other params you can find here https://www.npmjs.com/package/cookie#options-1
    };
};

/** Generate session config file. */
const sessionOptions = () => {
    return {
        secret: authentication.session,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set `secure: true` if using HTTPS
    }
};

export {
    cookieOptions,
    sessionOptions
};