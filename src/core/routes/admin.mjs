"use strict";

// /src/routes/admin.mjs
import express from "express";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { BasicAuth, BearerAuth } from "../middlewares/authentication.mjs";
import { cookieConfig } from "../utils/helpers.mjs";
import User from "../classes/User.mjs";
import validate from "../middlewares/validation.mjs";
import userSchema from "../validations/userValidation.mjs";
import {
    access,
    refresh,
    verify,
    hash,
    compare,
} from "../utils/security.mjs";
import e from "express";
import { app } from "../app.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 301 Moved Permanently
// 302 Moved Temporarily
// 308 Permanent Redirect

const router = express.Router();

/** Get the admin page. */
router.get("/", BearerAuth, (req, res, next) => {
    try {
        res.links({
            next: 'http://demo.com?page=2',
            middle: 'http://demo.com?page=4',
            last: 'http://demo.com?page=6'
        });
        // res.status(200).sendFile(join(__dirname, "../views/admin.html"));
        res.render("admin", { title: "Admin", user: res.locals.user, layout: "main" });
        console.log(res.get("link"));
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** Get new refresh token. */
router.post("/refresh", (req, res, next) => {
    try {
        const { id, username, email, firstName, lastName} = req.query;
        const token = refresh({
            id: id,
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            sessionId: req.cookies.sessionId,
            anonymous: false
        });

        res.cookie("refresh", token, cookieConfig());
        res.redirect(308, `access`);
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** Get new access token. */
router.post("/access", async (req, res, next) => {
    try {
        if (req.signedCookies.refresh) {
            const decodedResult = verify(req.signedCookies.refresh);
            const token = access({
                id: decodedResult.id,
                username: decodedResult.username,
                email: decodedResult.email,
                firstName: decodedResult.firstName,
                lastName: decodedResult.lastName,
                print: decodedResult.print,
                sessionId: req.cookies.sessionId,
                anonymous: decodedResult.anonymous
            });
            res.cookie("access", token, cookieConfig("access"));
            res.redirect(302, "/cc");
        }
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** User registration interface. */
router.get("/register", (req, res) => {
    try {
        // res.status(200).sendFile(join(__dirname, "../views/register.html"));
        res.render("register", { title: "Register", layout: "index" });
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** User registration back-end. */
router.post("/register", validate(userSchema), async (req, res, next) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;
        const hashedPassword = hash(password);
        const user = new User({ username, email, password: hashedPassword, firstName, lastName, role});
        await user.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully."
        });
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** User signin interface. */
router.get("/signin", (req, res) => {
    try {
        // res.status(200).sendFile(join(__dirname, "../views/signin.html"));
        // Serves the body of the page aka "signin.hbs" to the container //aka "index.hbs"
        res.render("signin", { title: "Signin", layout: "index" });
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** User signin back-end. */
router.post("/signin", validate(userSchema), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        try {
            const user = await User.findOne(username, email);
            if (!user) res.status(401).json({ success: false, message: "User cannot be found." });
            const passwordMatch = compare(password, user.password);
            if (!passwordMatch) res.status(401).json({
                success: false,
                message: "Password doesn't match."
            });
            req.user = await user.save();
            res.redirect(308, `refresh?id=${req.user.id}&username=${req.user.username}&email=${req.user.email}&firstName=${req.user.firstName}&lastName=${req.user.lastName}`);
        } catch (error) {
            error.status = 401;
            next(error);
        }
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** User signout interface. */
router.get("/signout", (req, res) => {
    try {
        // res.status(200).sendFile(join(__dirname, "../views/signout.html"));
        res.render("signout", { title: "Signout", layout: "index" });
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

/** Set the app database. */
router.get("/setup", (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "This is a test setup endpoint.",
            request: {
                user: req.user ?? null,
                cookies: req.cookies,
                signedCookies: req.signedCookies,
                query: req.query,
                params: req.params,
                body: req.body,
            }
        });
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

export default router;