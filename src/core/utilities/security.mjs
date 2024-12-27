import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authentication } from "../configuration/env.mjs";


/** Generate access token for 10 minutes == 600s (by default). */
const access = (payload, expires = "600s") => { 
    return jwt.sign(payload, authentication.jwt, { expiresIn: expires}); 
};

/** Generate refresh token for one month == 2592000s (Maximum refresh token lifetime). */
const refresh = (payload, expires = "2592000s") => { 
    // Idle refresh token lifetime = 129600s === one and a half days
    return jwt.sign(payload, authentication.jwt, { expiresIn: expires}); 
};

/** Verify the token. */
const verify = (encoded, original) => jwt.verify(encoded, authentication.jwt);

const compare = async (data, encrypted) => {
    return await bcrypt.compare(data, encrypted);
};

const hash = async (data, rounds = 10) => {
    return await bcrypt.hash(data, rounds);
};

export {
    access,
    refresh,
    verify,
    hash,
    compare,
};