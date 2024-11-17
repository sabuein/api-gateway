// src/controllers/service1Controller.js
const db = require("../config/db");

exports.getService1Data = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM service1_table');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.createService1Data = async (req, res) => {
    try {
        const { name, value } = req.body;
        const [result] = await db.query('INSERT INTO service1_table (name, value) VALUES (?, ?)', [name, value]);
        res.json({ success: true, message: "Data inserted", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database error" });
    }
};