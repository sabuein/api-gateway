// /src/models/serviceUser.mjs
import pool from "../config/db.mjs";

const table = "User";

const fetchData = async (id = null) => {
    try {
        let selectResult;
        if (!!id) selectResult = await pool.query(`SELECT * FROM ${table} WHERE ID = ? AND status = 'active' AND deletedAt IS NULL`, [id]);
        else selectResult = await pool.query(`SELECT * FROM ${table} WHERE deletedAt IS NULL`);
        if (!!selectResult) return selectResult;
    } catch (error) {
        throw new Error("Failed to fetch data: " + error.message);
    } finally {
        console.log("Operation completed.");
    }
};

const insertData = async (properties) => {
    try {
        const { } = properties;
        const insertResult = await pool.query(`INSERT INTO ${table} (id, value) VALUES (?, ?)`, [id, value]);
        if (!!insertResult) return insertResult;
    } catch (error) {
        throw new Error("Failed to insert data: " + error.message);
    } finally {
        console.log("Operation completed.");
    }
};

const updateData = async (id, property, value) => {
    try {
        let updateResult;
        switch (property) {
            case "status":
                updateResult = await pool.query(`UPDATE ${table} SET status = 'suspended' WHERE id = ?`, [id, value]);
                break;
            
            case "status":
                updateResult = await pool.query(``, [id, value]);
                break;
            
            case "status":
                updateResult = await pool.query(``, [id, value]);
                break;
            
            case "status":
                updateResult = await pool.query(``, [id, value]);
                break;

            case "status":
                updateResult = await pool.query(``, [id, value]);
                break;
        
            case "status":
                updateResult = await pool.query(``, [id, value]);
                break;
            
            default:
                break;
        }

        if (!!updateResult) return updateResult;
    } catch (error) {
        throw new Error("Failed to insert data: " + error.message);
    } finally {
        console.log("Operation completed.");
    }
};

const deleteData = async (properties) => {
    try {
        const deleteResult = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [properties.id]);
        if (!!deleteResult) return deleteResult;
    } catch (error) {
        throw new Error("Failed to insert data: " + error.message);
    } finally {
        console.log("Operation completed.");
    }
};

export { fetchData, insertData, updateData, deleteData };