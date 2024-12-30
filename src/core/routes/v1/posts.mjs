"use strict";

// /src/routes/v1/servicePostRoutes.mjs
import express from "express";
import {
    getPost,
    getPostComments,
    addPost,
    updatePost,
    deletePost,
} from "../../controllers/servicePostController.mjs";
import validate from "../../middlewares/validation.mjs";
import {
    postSchema,
    newPostSchema,
} from "../../validations/postValidation.mjs";

const router = express.Router();

/** Get all posts. */
router.get("/", (req, res) => {
    // ?limit=10&skip=10&select=title,reactions,userId
    // ?sortBy=title&order=asc
    const { limit, skip, select, sortBy, order } = req.query;
    const posts = {
        posts: [
            {
                id: 1,
                title: "His mother had always taught him",
                body: "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.",
                tags: ["history", "american", "crime"],
                reactions: {
                    likes: 192,
                    dislikes: 25,
                },
                views: 305,
                userId: 121,
            },
            // 30 items
        ],
        total: 251,
        skip: 0,
        limit: 30,
    };

    let results = posts.posts;

    if (limit) {
        results = results.filter((r) => r.firstName === firstName);
    }

    if (skip) {
        results = results.filter((r) => r.lastName === lastName);
    }

    if (select) {
        results = results.filter((r) => +r.age === +age);
    }

    if (sortBy) {
        results = results.filter((r) => +r.age === +age);
    }

    if (order) {
        results = results.filter((r) => +r.age === +age);
    }

    res.status(200).json(results);
});

/** Get all posts tags. */
router.get("/tags", (req, res) => {
    const tags = [
        {
            slug: "history",
            name: "History",
            url: "https://dummyjson.com/posts/tag/history",
        },
        {
            slug: "american",
            name: "American",
            url: "https://dummyjson.com/posts/tag/american",
        },
        {
            slug: "crime",
            name: "Crime",
            url: "https://dummyjson.com/posts/tag/crime",
        },
        {
            slug: "french",
            name: "French",
            url: "https://dummyjson.com/posts/tag/french",
        },
        {
            slug: "fiction",
            name: "Fiction",
            url: "https://dummyjson.com/posts/tag/fiction",
        },
        {
            slug: "english",
            name: "English",
            url: "https://dummyjson.com/posts/tag/english",
        },
    ];
    res.status(200).json(tags);
});

/** Get posts tag list. */
router.get("/tag-list", (req, res) => {
    const tagList = [
        "history",
        "american",
        "crime",
        "french",
        "fiction",
        "english",
        "magical",
        "mystery",
        "love",
        "classic",
        "memory",
        "nostalgia",
        "nature",
        "tranquility",
        "life",
        "books",
        // ... more items
    ];
    res.status(200).json(tagList);
});

/** Get posts by a tag. */
router.get("/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const tagPosts = {
        posts: [
            {
                id: 153,
                title: "The forest was alive with the sounds of nature",
                body: "Birds sang, leaves rustled, and a gentle stream trickled nearby. It was a symphony of life, a reminder of the world's beauty. The dense canopy overhead filtered the sunlight, creating a mosaic of light and shadow on the forest floor, a tranquil haven far from the chaos of modern life.",
                tags: ["nature", "tranquility", "life"],
                reactions: {
                    likes: 366,
                    dislikes: 28,
                },
                views: 1868,
                userId: 24,
            },
            {
                id: 167,
                title: "The market was a bustling maze of sights and sounds",
                body: "Stalls filled with colorful produce, the air rich with the scent of spices and fresh flowers. Vendors called out their wares, and the crowd moved in a vibrant dance. It was a place of energy and life, where every visit promised something new.",
                tags: ["market", "vibrant", "life"],
                reactions: {
                    likes: 1165,
                    dislikes: 5,
                },
                views: 3654,
                userId: 118,
            },
        ],
        total: 3,
        skip: 0,
        limit: 3,
    };
    res.status(200).json(tagPosts);
});

/** Search posts. */
router.get("/search", (req, res) => {
    const searchTerm = req.query.q;
    // Process search term
    const searchResults = {
        posts: [
            {
                id: 7,
                title: "This is important to remember.",
                body: "This is important to remember. Love isn't like pie. You don't need to divide it among all your friends and loved ones. No matter how much love you give, you can always give more. It doesn't run out, so don't try to hold back giving it as if it may one day run out. Give it freely and as much as you want.",
                tags: ["magical", "crime"],
                reactions: {
                    likes: 127,
                    dislikes: 26,
                },
                views: 168,
                userId: 70,
            },
            // 17 results
        ],
        total: 17,
        skip: 0,
        limit: 17,
    };
    res.status(200).json(searchResults);
});

/** Get all posts by user id. */
router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    const userPosts = {
        posts: [
            {
                id: 61,
                title: "I'm going to hire professional help tomorrow.",
                body: "I'm going to hire professional help tomorrow. I can't handle this anymore. She fell over the coffee table and now there is blood in her catheter. This is much more than I ever signed up to do.",
                tags: ["fiction", "classic", "american"],
                reactions: {
                    likes: 1127,
                    dislikes: 40,
                },
                views: 4419,
                userId: 5, // user id is 5
            },
        ],
        total: 2,
        skip: 0,
        limit: 2,
    };
    res.status(200).json(userPosts);
});

/** Add a new post. */
router.post("/add", validate(newPostSchema), (req, res) => {
    const newPost = {
        id: 252,
        title: "I am in love with someone.",
        userId: 5,
        /* other post data */
    };
    res.status(200).json(newPost);
});

/** Get post's comments. */
router.get("/:postId/comments", (req, res) => {
    const postId = req.params.postId;
    const comments = {
        comments: [
            {
                id: 93,
                body: "These are fabulous ideas!",
                postId: 1, // post id is 1
                likes: 7,
                user: {
                    id: 190,
                    username: "leahw",
                    fullName: "Leah Gutierrez",
                },
            },
        ],
        total: 3,
        skip: 0,
        limit: 3,
    };
    res.status(200).json(comments);
});

/** Get a single post. */
router.get("/:postId", (req, res) => {
    const postId = req.params.postId;
    const post = {
        id: 2112,
        title: "His mother had always taught him",
        body: "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.",
        tags: ["history", "american", "crime"],
        reactions: {
            likes: 192,
            dislikes: 25,
        },
        views: 305,
        userId: 121,
    };
    res.status(200).json(post);
});

/** Update a post. */
router.put("/:postId", (req, res) => {
    // OR PATCH
    const postId = req.params.postId;
    const updatedPost = {
        id: 1,
        title: "I think I should shift to the moon", // only title was updated
        body: "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.",
        userId: 121,
        tags: ["history", "american", "crime"],
        reactions: {
            likes: 192,
            dislikes: 25,
        },
    };
    res.status(200).json(updatedPost);
});

/** Delete a post. */
router.delete("/:postId", (req, res) => {
    const postId = req.params.postId;
    const deletedPost = {
        id: 1,
        title: "His mother had always taught him",
        body: "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.",
        tags: ["history", "american", "crime"],
        reactions: {
            likes: 192,
            dislikes: 25,
        },
        views: 305,
        userId: 121,
        isDeleted: true,
        deletedOn: "",
    };
    res.status(200).json(deletedPost);
});

export default router;