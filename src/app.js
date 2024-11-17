// Express application

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Middleware to parse JSON (if needed for incoming requests)
app.use(express.json());

// Proxy to different services
app.use("/api/v1/service1", createProxyMiddleware({ target: "http://localhost:5000", changeOrigin: true }));
app.use("/api/v1/service2", createProxyMiddleware({ target: "http://localhost:6000", changeOrigin: true }));

// Versioned API
app.use("/api/v1", require("./routes/v1"));

/*

// Delete a resource.
app.delete("/api/item/:id", (req, res) => {
    const id = req.params.id;
    res.json({ message: `Item ${id} deleted` });
});

// Update parts of a resource.
app.patch("/api/item/:id", (req, res) => {
    const id = req.params.id;
    const partialUpdate = req.body;
    res.json({ message: `Item ${id} partially updated`, data: partialUpdate });
});

// Update a resource completely.
app.put("/api/item/:id", (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    res.json({ message: `Item ${id} updated`, data: updatedData });
});

app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    res.json({
        success: true,
        message: `User ${userId} fetched successfully`,
        data: {
            id: userId,
            name: "User Name",
            domain: "abuein.com"
        }
    });
});

*/

// Handle 404 errors (this must come after all routes)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Resource not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred"
    });
});

module.exports = app;