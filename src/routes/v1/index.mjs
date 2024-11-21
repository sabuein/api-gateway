// /src/routes/v1/index.mjs
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { authenticate } from "../../middlewares/authentication.mjs";
import validate from "../../middlewares/validation.mjs";
import productSchema from "../../validations/productValidation.mjs";
import routerUsers from "./serviceUserRoutes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.use("/users", authenticate, routerUsers);

router.get("/protected-route", authenticate, (req, res) => {
    res
        .status(200)
        .json({
            success: true,
            message: "You accessed a protected route!",
            user: req.user
        });
});

router.post("/products", validate(productSchema), (req, res) => {
    res
        .status(200)
        .json({ success: true, message: "Product created successfully!" });
});

// Get data
router.get("/", (req, res) => {
    res
        .status(200)
        .sendFile(join(__dirname, "../../views/index.html")); // Navigate up two levels
});

// Get data
router.get("/:id", (req, res) => {
    res
        .status(200)
        .json({
            success: true,
            id: req.params.id,
        });
});

// Send data to the server for processing or storage.
router.post("/", (req, res) => {
    // Assuming body-parser middleware is used
    const data = req.body;
    res
        .status(200)
        .json({
            success: true,
            message: "Data received",
            data: data
        });
});

export default router;