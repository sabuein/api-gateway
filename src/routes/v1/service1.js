// src/routes/v1/service1.js
const express = require("express");
const router = express.Router();
const service1Controller = require("../../controllers/service1Controller");

// Define routes for service1
router.get("/", service1Controller.getService1Data);
router.post("/", service1Controller.createService1Data);

module.exports = router;