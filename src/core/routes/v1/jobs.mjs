"use strict";

// /src/routes/v1/serviceJobRoutes.mjs
import express from "express";
import validate from "../../middlewares/validation.mjs";
import { postSchema } from "../../validations/postValidation.mjs";

const router = express.Router();

router.get("/", (req, res) => {
    const articles = [];
    // code to retrieve an article...
    res.json(articles);

    // Latest jobs

    // Your application has been received.

    // Thank you for your interest in this position. If your qualifications match those needed for this position, someone will be in touch to discuss next steps. Please feel free to apply for any of our other open positions.

    // « Back to Jobs
});

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;
    const comments = [];
    // code to get comments by articleId
    res.json(comments);
});

router.post("/", validate(postSchema), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Post created successfully!",
    });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    // code to update an article...
    res.json(req.body);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    // code to delete an article...
    res.json({ deleted: id });
});

export default router;