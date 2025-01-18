// /src/server.mjs
import {
    exists,
    open,
    close,
    readFile,
    createReadStream,
    createWriteStream,
    readFileSync,
} from "node:fs";
import { app, port } from "./core/app.mjs";
import http from "http";
import https from "https";

/*

The Router provides route methods for all the other HTTP verbs, that are mostly used in exactly the same way: post(), put(), delete(), options(), trace(), copy(), lock(), mkcol(), move(), purge(), propfind(), proppatch(), unlock(), report(), mkactivity(), checkout(), merge(), m-search(), notify(), subscribe(), unsubscribe(), patch(), search(), and connect().

// Certificate
const privateKey = readFileSync('/etc/ssl/api.abuein.com+3-key.pem', 'utf8');
const certificate = readFileSync('/etc/ssl/api.abuein.com+3.pem', 'utf8');
//const ca = readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');



const credentials = {
    key: privateKey,
    cert: certificate,
    //ca: ca
};

const fs = () => {
    // Create a readable stream
const readStream = createReadStream("input.txt");

// Create a writeable stream
const writeStream = createWriteStream("output.txt");

// Pipe the read 
readStream.pipe(writeStream);

readStream.on("data", (chunk) => {
    console.log(chunk.toString());
});
};

const readFileX = async (fileName) => {
    try {
        const data = await FileSystem.readFile(fileName);
        if (!!data) console.log(data);
    } catch (error) {
        console.error(error);
    }
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

*/

app.listen(port, "0.0.0.0", (error) => {
    if (error) {
        throw error; // e.g. EADDRINUSE
    }
    console.log(`Process ID: ${process.pid}`);
    console.log(`Node.js Version: ${process.version}`);
    console.log(`Server is running on port ${port}`);
});