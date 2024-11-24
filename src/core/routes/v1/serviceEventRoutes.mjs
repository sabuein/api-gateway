"use strict";

// /src/routes/v1/serviceEventRoutes.mjs
import express from "express";
import {
    getEvent,
    getEventComments,
    addEvent,
    updateEvent,
    deleteEvent
} from "../../controllers/serviceEventController.mjs";
import validate from "../../middlewares/validation.mjs";
import eventSchema from "../../validations/eventValidation.mjs";

const router = express.Router();

router.get("/", (req, res) => {
    const events = [];
    // code to retrieve an event...
    res.json(events);
});

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    const comments = [];
    // code to get comments by eventId
    res.json(comments);
});

router.post("/", validate(eventSchema), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Event created successfully!"
    });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    // code to update an event...
    res.json(req.body);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    // code to delete an event...
    res.json({ deleted: id });
});

export default router;