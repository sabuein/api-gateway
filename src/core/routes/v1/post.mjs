"use strict";

// /src/routes/v1/servicePostRoutes.mjs
import express from "express";
import {
    getPost,
    getPostComments,
    addPost,
    updatePost,
    deletePost
} from "../../controllers/servicePostController.mjs";
import validate from "../../middlewares/validation.mjs";
import postSchema from "../../validations/postValidation.mjs";

const router = express.Router();

router.get("/", (req, res) => {
    const articles = [];
    // code to retrieve an article...
    res.json(articles);
});

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    const comments = [];
    // code to get comments by articleId
    res.json(comments);
});

router.post("/", validate(postSchema), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Post created successfully!"
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