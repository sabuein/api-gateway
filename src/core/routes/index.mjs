"use strict";

// /src/routes/v1/index.mjs
import express from "express";
import adminRouter from "./v1/admin.mjs";
import commandRouter from "./v1/command.mjs";
import eventRouter from "./v1/event.mjs";
import jobRouter from "./v1/job.mjs";
import libraryRouter from "./v1/library.mjs";
import postRouter from "./v1/post.mjs";
import userRouter from "./v1/user.mjs";

const router = express.Router();

router.get("/", function (req, res, next) {
    res.status(200).json({
        success: true,
        message: "You accessed v1 route!",
        user: req.user,
        cookies: req.cookies
    });
});

router.use("/", adminRouter);
router.use("/cmd", commandRouter);
router.use("/event", eventRouter);
router.use("/job", jobRouter);
router.use("/library", libraryRouter);
router.use("/post", postRouter);
router.use("/user", userRouter);

export default router;