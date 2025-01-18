

// const fs = require("fs");
const jsonPath = path.join(__dirname, "js", "links.json");

// Serve the JSON file
router.get("/links", (req, res) => {
    fs.readFile(jsonPath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading JSON file");
        res.json(JSON.parse(data));
    });
});

// Update the JSON file
router.post("/links", (req, res) => {
    const newLinks = req.body.links;
    fs.writeFile(jsonPath, JSON.stringify({ links: newLinks }, null, 2), (err) => {
        if (err) return res.status(500).send("Error writing JSON file");
        res.send("Links updated successfully");
    });
});