// /src/server.mjs
import app from "./app.mjs";
import { settings } from "./config/env.mjs";

app.listen(settings.port, () => {
    console.log(`Server is running on port ${settings.port}`);
});