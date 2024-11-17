// src/config/db.js
const mysql = require("mysql2");

// Create a pool for efficient query handling
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export a promise-based version of the pool
const db = pool.promise();

module.exports = db;