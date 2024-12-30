"use strict";

/** @module Post */
/** Class representing a post. */
class Post {
    #id; // Unique post ID
    #userId; // ID of the user who created the post
    #content; // Text content of the post
    #media = []; // Array of media URLs (images, videos)
    #isPinned = false;
    #likes = []; // Array of user IDs who liked the post
    #comments = []; // Array of comment objects
    #shares = 0; // Number of times the post was shared
    #tags = []; // Tags or mentions (e.g., ["#coding", "@sala_dev"])
    #createdAt = new Date().toISOString(); // Post creation timestamp
    #updatedAt;
    #scheduledAt;
    #visibility = "public"; // Visibility setting: "public", "private", "followers"
    #reactions = {
        // Reactions count
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0,
    };
    #poll = {
        question: "Which feature do you want next?",
        options: [
            { option: "Dark mode", votes: 10 },
            { option: "Light theme", votes: 5 },
        ],
    };

    static keys(post) {
        const properties = [];
        for (let property in post) properties.push(property);
        return properties;
    }

    static entries(event) {
        const properties = [];
        Object.entries(event).forEach(([key, value]) =>
            properties.push([key, value])
        );
        return properties;
    }

    constructor(properties) {
        // Object.assign(this, properties);
        const { userId, content } = properties;

        this.#userId = userId;
        this.#content = content;
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    // Add a like
    addLike(userId) {
        if (!this.#likes.includes(userId)) this.#likes.push(userId);
    }

    // Add a comment
    addComment(comment) {
        this.#comments.push(comment);
    }

    // Add a reaction
    addReaction(reactionType) {
        if (this.#reactions[reactionType] !== undefined)
            this.#reactions[reactionType]++;
    }
}

export default Post;