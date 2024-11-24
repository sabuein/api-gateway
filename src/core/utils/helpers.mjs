import crypto from "crypto";

const getNewSecret = () => crypto.randomBytes(64).toString("hex");

/** Generate cookie config file for  (Maximum refresh token lifetime). */
const cookieConfig = (type) => {
    return {
        httpOnly: true, // Prevent client-side access to cookies
        //secure: true, // to force https (if you use it)
        sameSite: "strict", // Mitigate CSRF attacks (other: lax)
        maxAge: (type === "access") ? 10*60*1000 : 30*24*60*60*1000, // ttl in seconds: 10 minutes for access, one month for others, 1*60*1000 === 1 minute because we are using "cookie-parser" to set cookies (remove this option and cookie will die when browser is closed)
        signed: true, // if you use the secret with cookieParser
        // there is many other params you can find here https://www.npmjs.com/package/cookie#options-1
    };
};

export {
    getNewSecret,
    cookieConfig
};