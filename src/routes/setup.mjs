// /src/routes/setup.mjs
import express from "express";
import { exec } from "child_process";

const router = express.Router();

/* TO-DO */
router.get("/", (req, res) => {
    const command = 'pwgen -cnysC 15 1';

    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return res.status(500).json({ success: false, error: error.message });
        }

        if (stderr) {
            console.error(`Standard error: ${stderr}`);
            return res.status(500).json({ success: false, error: stderr });
        }

        console.log(`Command output: ${stdout}`);
        res.status(200).json({ success: true, output: stdout });
    });
});

export default router;