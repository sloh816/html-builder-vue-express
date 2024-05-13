// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const fs = require("fs").promises;

const { slugify } = require("./utils/utils.js");
const { runProcess } = require("./processes/runProcess");
const { getSubfolders, createPublicationsFolder, readFile } = require("./utils/filesAndFolders.js");

const app = express();
app.use(cors());

// Define a route to serve the list of subfolders within the 'processes' folder
app.get("/api/processes", async (req, res) => {
    try {
        const processFolders = await getSubfolders("./processes");
        const processes = processFolders.map((process) => {
            return {
                name: process,
                slug: slugify(process),
            };
        });
        res.json(processes);
    } catch (error) {
        console.error("🔴 Error fetching subfolders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// multer middleware
const upload = multer({
    dest: "./temp/",
});

// Route to server a list of themes' theme.json data
app.get("/api/themes", async (req, res) => {
    try {
        const themeFolders = await getSubfolders("./themes");
        const themesData = [];
        for (const folder in themeFolders) {
            try {
                const themeData = await readFile(`./themes/${themeFolders[folder]}/theme.json`, "json");
                themesData.push(JSON.parse(themeData));
            } catch {
                console.error("🔴 Error reading theme data:", err);
            }
        }
        res.json(themesData);
    } catch (err) {
        console.error("🔴 Error fetching themes:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Define a route to retrieve word file from the client
app.post("/api/word-to-html", upload.single("wordFile"), async (req, res) => {
    // add .docx extension to the file path
    fs.rename(req.file.path, req.file.path + ".docx");

    // execute 'Word to HTML' main function:
    // runProcess({
    // 	processFolderName: "Word to HTML",
    // 	tempWordFilePath: req.file.path + ".docx",
    // 	publicationName: req.file.originalname.replace(".docx", "")
    // });

    // return a response
    res.json({ file: req.file, body: req.body });
});

app.post("/api/edit-theme", (req, res) => {
    console.log({ body: req.body });
    res.json({ body: req.body });
});

// Start the server
createPublicationsFolder();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
