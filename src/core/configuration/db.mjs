"use strict";

// /src/configuration/db.mjs
import mariadb from "mariadb";
import { db } from "./env.mjs";

// Create a pool for efficient query handling
const pool = mariadb.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the pool directly, as it already supports Promises
export default pool;