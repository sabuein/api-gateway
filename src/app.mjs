// /src/app.mjs
import express from "express";
import http from "http-proxy-middleware";
import logger from './middlewares/logging.mjs';
import route from "./routes/v1/index.mjs";
import auth from "./routes/auth.mjs";
import setup from "./routes/setup.mjs";
import commandRoutes from "./routes/command.mjs";
import apicache from "apicache";

const app = express();

let cache = apicache.middleware;
//sapp.use(cache("5 minutes"));

// Apply globally to log all incoming requests
app.use(logger);

// Serve static files from the "public" directory
app.use(express.static("src/public"));

// Middleware to parse JSON (if needed for incoming requests)
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Proxy to different services
app.use("/service1", http.createProxyMiddleware({ target: "http://localhost:5000", changeOrigin: true }));
app.use("/service2", http.createProxyMiddleware({ target: "http://localhost:6000", changeOrigin: true }));

app.use("/", commandRoutes);
app.use("/auth", auth);
app.use("/setup", setup);
app.use("/v1", route);

/*

// Delete a resource.
app.delete("/item/:id", (req, res) => {
    const id = req.params.id;
    res.json({ message: `Item ${id} deleted` });
});

// Update parts of a resource.
app.patch("/item/:id", (req, res) => {
    const id = req.params.id;
    const partialUpdate = req.body;
    res.json({ message: `Item ${id} partially updated`, data: partialUpdate });
});

// Update a resource completely.
app.put("/item/:id", (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    res.json({ message: `Item ${id} updated`, data: updatedData });
});

app.get("/user/:id", (req, res) => {
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

// Handle different errors (this must come after all routes)
app.use((req, res, next) => {
    res
        .status(400)
        .json({
            success: false,
            message: "Client-side input fails validation"
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(401)
        .json({
            success: false,
            message: "The user isn't not authorized to access a resource. This usually returns when the user isn't authenticated."
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(403)
        .json({
            success: false,
            message: "This means the user is authenticated, but it's not allowed to access a resource"
        });
});

*/

app.use((req, res, next) => {
    res
        .status(404)
        .json({
            success: false,
            message: "This indicates that a resource is not found"
        });
});

app.use((req, res, next) => {
    res
        .status(500)
        .json({
            success: false,
            message: "This is a generic server error. It probably shouldn't be thrown explicitly"
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(502)
        .json({
            success: false,
            message: "This indicates an invalid response from an upstream server"
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(503)
        .json({
            success: false,
            message: "This indicates that something unexpected happened on server side (It can be anything like server overload, some parts of the system failed, etc.)"
        });
});

export default app;