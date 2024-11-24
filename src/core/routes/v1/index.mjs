"use strict";

// /src/routes/v1/index.mjs
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { BasicAuth, BearerAuth } from "../../middlewares/authentication.mjs";
import routerEvents from "./serviceEventRoutes.mjs";
import routerPosts from "./servicePostRoutes.mjs";
import routerUsers from "./serviceUserRoutes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.post("/", (req, res) => res.redirect("/"));

router.get("/private", BearerAuth, (req, res) => {
    if (!req.cookies.token) {
        res.status(401).json({
            success: false,
            message: "You don't have token cookie even authorized with access token!"
        });
    }
    res.status(200).json({
        success: true,
        message: "You accessed a private route!",
        user: req.user,
        cookies: req.cookies
    });
});

router.use("/events", BearerAuth, routerEvents);
router.use("/posts", BearerAuth, routerPosts);
router.use("/users", BearerAuth, routerUsers);

export default router;