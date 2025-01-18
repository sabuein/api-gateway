// /src/core/app.mjs
import express from "express";
import http from "http-proxy-middleware";
import apicache from "apicache";
import cookieParser from "cookie-parser";
import session from "express-session";
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";
import logger from "./middlewares/logging.mjs";
import v1Routes from "./routes/index.mjs";
import { authentication, settings } from "./configuration/env.mjs";
import { sessionOptions } from "./configuration/options.mjs";
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

app.use(
    express.json({
        type: "application/json",
        // We need the raw body to verify webhook signatures.
        // Let's compute it only when hitting the Stripe webhook endpoint.
        verify: function (req, res, buf) {
            if (req.originalUrl.startsWith("/webhook")) {
                req.rawBody = buf.toString();
            }
        },
    })
);

app.use(
    express.urlencoded({
        type: "application/x-www-form-urlencoded",
        extended: true,
    })
);

app.use(cookieParser(authentication.cookie));
app.use(session(sessionOptions()));

// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
  });


app.use(compression());
/*
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'http://127.0.0.1:8000', 'https://app.abuein.com', "http://localhost:3210"]
      }
    }
  }));
  */
// app.use(limiter);
app.use(logger);

// app.disable("etag");

// Serve static files (handles .js, .mjs, .css, images, webmanifest, etc.)
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

app.get("/error-handler", (req, res) => {
    const status = req.query.status || 500;
    const message = status === '404' ? 'Page Not Found' : 'Internal Server Error';
    res.status(status).json({ error: message });
});

app.all("/", (req, res) => {
    res.redirect("/v1");
});

const Status = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
};

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use((error, req, res, next) => {
    let heading = null;
    let message = null;
    switch (error.status) {
        case 400:
            heading = "400 Bad Request";
            message = "The server would not process the request due to something the server considered to be a client error.";
            break;
        
        case 401:
            heading = "401 Unauthorized";
            message = "The request was not successful because it lacks valid authentication credentials for the requested resource.";
            break;
        
        case 403:
            heading = "403 Forbidden";
            message = "The server understood the request but refused to process it.";
            break;
        
        case 404:
            heading = "404 Not Found";
            message = "The server cannot find the requested resource.";
            break;
        
        case 500:
            heading = "500 Internal Server Error";
            message = "The server encountered an unexpected condition that prevented it from fulfilling the request.";
            break;
        
        case 502:
            heading = "502 Bad Gateway";
            message = "The server was acting as a gateway or proxy and that it received an invalid response from the upstream server. Express server is down.";
            break;
        
        case 503:
            heading = "503 Service Unavailable";
            message = "The server is not ready to handle the request.";
            break;
        
        case 504:
            heading = "504 Gateway Timeout";
            message = "The server, while acting as a gateway or proxy, did not get a response in time from the upstream server in order to complete the request. This is similar to a 502 Bad Gateway, except that in a 504 status, the proxy or gateway did not receive any HTTP response from the origin within a certain time. Please try again later.";
            break;
            
        default:
            /*
            res.set("Content-Type", "application/json");
            res.status(error.status || 500).json({
                success: false,
                code: error.status || 500,
                message: error.messsage || message || "<h1>Unknown Error</h1>",
            });
            */
            if (!heading) heading = "Unknown Error";
            if (!message) message = "The server detected an unspecified error occurs whilst processing the request.";

            res.status(error.status).render("error", {
                code: error.status,
                title: `Error ${error.status} &dash; AbuEin Web Portal`,
                heading: heading,
                subheading: message,
                layout: "exception",
            });

            console.error(error.stack);
            break;
    }
});

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect respects this prop as well)
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
  }



// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
    res.status(404);
    res.send({ error: "Sorry, can't find that" })
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
