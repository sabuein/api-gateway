"use strict";

// /src/routes/v1/serviceEventRoutes.mjs
import express from "express";
import {
    getEvent,
    getEventComments,
    addEvent,
    updateEvent,
    deleteEvent,
} from "../../controllers/serviceEventController.mjs";
import validate from "../../middlewares/validation.mjs";
import eventSchema from "../../validations/eventValidation.mjs";

const router = express.Router();

router.get("/", (req, res) => {
    const events = [];
    // code to retrieve an event...
    res.json(events);
});

router.post("/", validate(eventSchema), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Event created successfully!",
    });
});

router.get("/:id/comments", (req, res) => {
    const { id } = req.params;
    const comments = [];
    // code to get comments by eventId
    res.json(comments);
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    /*
    
    If the target resource does not have a current representation and the PUT request successfully creates one, then the origin server must send a 201 Created response:

    HTTP/1.1 201 Created
    Content-Location: /new.html

    If the target resource does have a current representation and that representation is successfully modified with the state in the request, the origin server must send either a 200 OK or a 204 No Content to indicate successful completion of the request:
    
    HTTP/1.1 204 No Content
    Content-Location: /existing.html

    */

    // code to update an event...
    res.json(req.body);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    // code to delete an event...
    res.json({ deleted: id });
});

export default router;