// /src/core/app.mjs
import express from "express";
import http from "http-proxy-middleware";
import apicache from "apicache";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import logger from './middlewares/logging.mjs';
import v1Routes from "./routes/v1/index.mjs";
import commandRoutes from "./routes/command.mjs";
import routerAdmins from "./routes/admin.mjs";
import { authentication, settings } from "./config/env.mjs";
import handlebars from "express-handlebars";

const app = express(),
    port = settings.port,
    __filename = fileURLToPath(import.meta.url),
    __dirname = dirname(__filename);

// Local variables
app.locals.title = "API Gateway v1";

app.engine("hbs", handlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "main"
}));
app.set("view engine", "hbs");
app.set("views", "src/core/views");

app.use(logger);
app.use(express.static("src/core/static", {
    setHeaders: function (res, path, stat) {
        res.set("x-timestamp", Date.now())
    }
}));
// app.use(apicache.middleware("5 minutes"));
app.use(express.text({ type: "text/plain" }));
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ type: "application/x-www-form-urlencoded", extended: false }));
app.use(cookieParser(authentication.cookie));

// Proxy to different services
app.use("/service1", http.createProxyMiddleware({ target: "http://localhost:5000", changeOrigin: true }));
app.use("/service2", http.createProxyMiddleware({ target: "http://localhost:6000", changeOrigin: true }));

// Routes
app.use("/", commandRoutes);
app.use("/cc", routerAdmins);
app.use("/v1", v1Routes);

app.use((error, req, res, next) => {
    let message = null;
    switch (error.status) {
        case 401:
            message = "<h1>401 Unauthorized</h1><p>The request was not successful because it lacks valid authentication credentials for the requested resource.</p>";
            break;
        case 403:
            message = "<h1>403 Forbidden</h1><p>The server understood the request but refused to process it.</p>";
            res.redirect(302, "/cc/signin");
            break;
        case 404:
            message = "<h1>404 Not Found</h1><p>The server cannot find the requested resource.</p>";
            break;
        case 500:
            message = "<h1>500 Internal Server Error</h1><p>The server encountered an unexpected condition that prevented it from fulfilling the request.</p>";
            break;
        case 502:
            message = "<h1>502 Bad Gateway</h1><p>The server was acting as a gateway or proxy and that it received an invalid response from the upstream server.</p>";
            break;
        case 503:
            message = "<h1>503 Service Unavailable</h1><p>The server is not ready to handle the request.</p>";
            break;
        default:
            /*
            res.set("Content-Type", "text/html");
            res.status(error.status ?? 400).send(message ?? "<h1>Unknown Error</h1>");
            */
            res.set("Content-Type", "application/json");
            res.status(error.status || 500).json({
                success: false,
                code: error.status || 500,
                message: error.messsage || message || "<h1>Unknown Error</h1>",
            });

            console.error(error.stack);
            break;
    }
});

export {
    app,
    port,
};