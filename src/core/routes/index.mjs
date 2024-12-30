"use strict";

// /src/routes/v1/index.mjs
import express from "express";
import adminRouter from "./v1/admin.mjs";
import commandsRouter from "./v1/commands.mjs";
import eventsRouter from "./v1/events.mjs";
import jobsRouter from "./v1/jobs.mjs";
import libraryRouter from "./v1/library.mjs";
import postsRouter from "./v1/posts.mjs";
import usersRouter from "./v1/users.mjs";

const router = express.Router();

router.get("/", function (req, res, next) {
    res.status(200).json({
        success: true,
        message: "You accessed v1 route!",
        user: req.user,
        cookies: req.cookies,
    });
});

router.use("/auth", adminRouter);
router.use("/cmd", commandsRouter);
router.use("/events", eventsRouter);
router.use("/jobs", jobsRouter);
router.use("/library", libraryRouter);

/** The posts endpoint offers a dataset of post data, including details like titles, body content, user IDs, and tags. */
router.use("/posts", postsRouter);

/** The users endpoint provides a versatile dataset of user information and related data like carts, posts, and todos. */
router.use("/users", usersRouter);

export default router;