// /src/core/app.mjs
import express from "express";
import http from "http-proxy-middleware";
import apicache from "apicache";
import cookieParser from "cookie-parser";
import session from "express-session";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import logger from "./middlewares/logging.mjs";
import v1Routes from "./routes/index.mjs";
import { authentication, settings } from "./configuration/env.mjs";
import { sessionOptions } from "./configuration/storage.mjs";
import handlebars from "express-handlebars";
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";

const app = express(),
    port = settings.port,
    __filename = fileURLToPath(import.meta.url),
    __dirname = dirname(__filename),
    limiter = RateLimit({
        windowMs: 60 * 1000, // 15 minutes
        max: 10000, // limit each IP to 100 requests per windowMs
        message: "You have exceeded your 10000 requests per minute limit.",
        headers: true,
    });

// Local variables
app.locals.title = "API Gateway - Version 1.0";

app.engine(
    "hbs",
    handlebars.engine({
        layoutsDir: __dirname + "/views/layouts",
        extname: "hbs",
        defaultLayout: "main",
    })
);

app.set("view engine", "hbs");
app.set("views", "src/core/views");

// app.use(apicache.middleware("5 minutes"));
app.use(express.text({ type: "text/plain" }));
app.use(express.json({ type: "application/json" }));
app.use(
    express.urlencoded({
        type: "application/x-www-form-urlencoded",
        extended: false,
    })
);

app.use(cookieParser(authentication.cookie));
app.use(session(sessionOptions));
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(logger);

// app.disable("etag");

// Serve static files (handles .js, .css, images, webmanifest, etc.)
app.use(
    express.static("src/core/static", {
        setHeaders: (res, path, stat) => res.set("x-timestamp", Date.now()),
    })
);

// Proxy to different services
app.use(
    "/service1",
    http.createProxyMiddleware({
        target: "http://localhost:5000",
        changeOrigin: true,
    })
);
app.use(
    "/service2",
    http.createProxyMiddleware({
        target: "http://localhost:6000",
        changeOrigin: true,
    })
);

app.use("/v1", v1Routes);

app.use((error, req, res, next) => {
    let message = null;
    switch (error.status) {
        case 401:
            message =
                "<h1>401 Unauthorized</h1><p>The request was not successful because it lacks valid authentication credentials for the requested resource.</p>";
            break;
        case 403:
            message =
                "<h1>403 Forbidden</h1><p>The server understood the request but refused to process it.</p>";
            res.redirect(302, "/v1/user/signin");
            break;
        case 404:
            message =
                "<h1>404 Not Found</h1><p>The server cannot find the requested resource.</p>";
            break;
        case 500:
            message =
                "<h1>500 Internal Server Error</h1><p>The server encountered an unexpected condition that prevented it from fulfilling the request.</p>";
            break;
        case 502:
            message =
                "<h1>502 Bad Gateway</h1><p>The server was acting as a gateway or proxy and that it received an invalid response from the upstream server.</p>";
            break;
        case 503:
            message =
                "<h1>503 Service Unavailable</h1><p>The server is not ready to handle the request.</p>";
            break;
        default:
            /*
            res.set("Content-Type", "text/html");
            res.status(error.status ?? 400).send(message ?? "<h1>Unknown Error</h1>");
            */

            res.locals.error = error;
            res.locals.message = error.messsage || message;

            res.set("Content-Type", "application/json");
            res.status(error.status || 500).json({
                success: false,
                code: error.status || 500,
                message: error.messsage || message || "<h1>Unknown Error</h1>",
            });

            res.render("error", {
                title: `Error ${error.status} - [App Name]`,
                heading: "Page Not Found",
                subheading: `We couldn't find the page you were looking for. It might have been moved or no longer exists. Try returning to the homepage or contact us for help.`,
                layout: "index",
            });

            console.error(error.stack);
            break;
    }
});

/*
// Dynamic HTML route handling
app.get("/:page?", (req, res) => {
    const page = req.params.page || "index"; // Default to index.html
    const filePath = join(__dirname, "./static", `${page}.html`);
    res.sendFile(filePath, (error) => {
        if (error) {
            res.status(404).sendFile(join(__dirname, "./static/404.html"));
        }
    });
});

// Serve specific static files with explicit routes (optional)
app.get("/app.webmanifest", (req, res) => res.status(200).sendFile(join(__dirname, "./static/app.webmanifest")));
*/
export { app, port };