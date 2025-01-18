"use strict";

// /src/routes/v1/index.mjs
import express from "express";
import authRouter from "./v1/auth.mjs";
import commandsRouter from "./v1/commands.mjs";
import configRouter from "./v1/config.mjs";
import eventsRouter from "./v1/events.mjs";
import jobsRouter from "./v1/jobs.mjs";
import libraryRouter from "./v1/library.mjs";
import moneyRouter from "./v1/money.mjs";
import postsRouter from "./v1/posts.mjs";
import pushRouter from "./v1/push.mjs";
import usersRouter from "./v1/users.mjs";
import resourcesRouter from "./v1/resources.mjs";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/cmd", commandsRouter);
router.use("/config", configRouter);
router.use("/events", eventsRouter);
router.use("/jobs", jobsRouter);
router.use("/library", libraryRouter);
router.use("/money", moneyRouter);

/** The posts endpoint offers a dataset of post data, including details like titles, body content, user IDs, and tags. */
router.use("/posts", postsRouter);

router.use("/push", pushRouter);

/** The users endpoint provides a versatile dataset of user information and related data like posts, etc. */
router.use("/users", usersRouter);

router.use("/", resourcesRouter);

export default router;