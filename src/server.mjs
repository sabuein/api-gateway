// /src/server.mjs
import { app, port } from "./core/app.mjs";

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});