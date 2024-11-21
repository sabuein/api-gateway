// /src/routes/v1/servicePostRoutes.mjs
import express from "express";
import {
    getPost,
    getPostComments,
    addPost,
    updatePost,
    deletePost
} from "../../controllers/servicePostController.mjs";

const router = express.Router();

router.get("/posts", (req, res) => {
    const articles = [];
    // code to retrieve an article...
    res.json(articles);
});

router.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const comments = [];
    // code to get comments by articleId
    res.json(comments);
});

router.post("/posts", (req, res) => {
    // code to add a new article...
    res.json(req.body);
});

router.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    // code to update an article...
    res.json(req.body);
});

router.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    // code to delete an article...
    res.json({ deleted: id });
});

export default router;