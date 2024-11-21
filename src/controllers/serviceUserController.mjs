// /src/controllers/serviceUserController.mjs

import User from "../classes/User.mjs";

const getUser = async (req, res) => {
    try {
        // Use the fetchData function from the model
        const rows = await fetchData();

        const user = new User(req.user);
        res.json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

const getUsers = async (req, res) => {
    try {
        // Use the fetchData function from the model
        const rows = await fetchData();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, value } = req.body;
        const result = await insertData(name, value);
        res.json({ success: true, message: "Data inserted", id: result.insertId });
    } catch (error) {
        console.error("Error inserting data:", error.message);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

export {
    getUser,
    getUsers,
    createUser,
};