// /src/config/env.mjs
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
};

const authentication = {
    // The secret is used to sign and validate signatures.
    jwt: process.env.JWT_SECRET,
    // The audience and issuer are used for validation purposes.
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    // The secret is used to sign and validate cookies.
    cookie: process.env.COOKIE_SECRET
};

const settings = {
    // The basic API port and prefix configuration values are:
    port: process.env.PORT ??= 3000,
    prefix: process.env.API_PREFIX ??= "api"
};

export {
    db,
    authentication,
    settings
};