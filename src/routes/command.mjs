// /src/routes/command.mjs
import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.get("/get-password", (req, res) => {
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

/*
    You can set it up as a systemd service:
    
    1. Create a new service file:
    sudo nano /etc/systemd/system/command-service.service

    2. Add the following content, replacing /path/to/app.js with the full path to your Node.js script:
    [Unit]
    Description=Node.js Command Service
    After=network.target

    [Service]
    ExecStart=/usr/bin/node /path/to/app.js
    Restart=always
    User=your-username
    Group=your-group
    Environment=PATH=/usr/bin:/usr/local/bin
    Environment=NODE_ENV=production
    WorkingDirectory=/path/to/

    [Install]
    WantedBy=multi-user.target

    3. Reload systemd and start the service:
    sudo systemctl daemon-reload
    sudo systemctl start command-service
    sudo systemctl enable command-service

    4. You can now access the service by sending a request to the configured endpoint, for example:
    curl http://localhost:4000/run-command

*/

export default router;