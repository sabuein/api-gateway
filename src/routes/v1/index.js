// src/routes/v1/index.js
const express = require("express");
const router = express.Router();

router.use("/service1", require("./service1"));
router.use("/service2", require("./service2"));

// Get data
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the API",
    });
});

// Send data to the server for processing or storage.
app.post("/", (req, res) => {
    const data = req.body; // Assuming body-parser middleware is used
    res.json({
        success: true,
        message: "Data received",
        data: data
    });
});

module.exports = router;