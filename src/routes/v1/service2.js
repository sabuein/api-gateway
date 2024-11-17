// src/routes/v1/service2.js
const express = require("express");
const router = express.Router();
const service2Controller = require("../../controllers/service2Controller");

// Define routes for service2
router.get("/", service2Controller.getService1Data);
router.post("/", service2Controller.createService1Data);

module.exports = router;