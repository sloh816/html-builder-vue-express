// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

const fs = require("fs").promises;
const path = require("path");

const { slugify } = require("./utils/utils.js");
const { runProcess } = require("./processes/runProcess");
const { getSubfolders, createPublicationsFolder, readFile } = require("./utils/filesAndFolders.js");
const { updateStyleMap } = require("./utils/editData.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// #region Routes for server to retrieve data
app.use(express.static(path.resolve("publications")));

// Serve a list of 'processes' subfolders
app.get("/api/processes", async (req, res) => {
	try {
		const processFolders = await getSubfolders("./processes");
		const processes = processFolders.map((process) => {
			return {
				name: process,
				slug: slugify(process)
			};
		});
		res.json(processes);
	} catch (error) {
		console.error("🔴 Error fetching subfolders:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Serve a list of 'theme.json' data
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

// Serve a list of 'publications' subfolders
app.get("/api/publications", async (req, res) => {
	try {
		const publicationFolders = await getSubfolders("./publications");
		const publicationsData = [];
		for (const folder in publicationFolders) {
			try {
				const publicationData = await readFile(`./publications/${publicationFolders[folder]}/info.json`, "json");
				publicationsData.push(JSON.parse(publicationData));
			} catch (err) {
				console.error("🔴 Error reading publication data:", err);
			}
		}
		res.json(publicationsData);
	} catch (error) {
		console.error("🔴 Error fetching subfolders:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});
// #endregion

// #region Routes for client to retrieve data

// multer middleware
const upload = multer({
	dest: "./temp/"
});

app.post("/api/word-to-html", upload.single("wordFile"), async (req, res) => {
	// add .docx extension to the file path
	fs.rename(req.file.path, req.file.path + ".docx");

	// execute 'Word to HTML' main function:
	runProcess({
		processFolderName: "Word to HTML",
		tempWordFilePath: req.file.path + ".docx",
		document: req.file.originalname,
		themeFolder: "word-to-html_" + req.body.theme
	});

	// return a response
	res.json({ file: req.file, body: req.body });
});

app.post("/api/edit-theme", upload.single(""), async (req, res) => {
	// update stylemap
	const styleMap = [];
	for (const key in req.body) {
		if (key.startsWith("styleMapItem-")) {
			styleMap.push(req.body[key]);
		}
	}

	const themeFolder = req.body.themeFolder;

	await updateStyleMap(styleMap, themeFolder);

	res.json({ body: req.body });
});
// #endregion

// Start the server
createPublicationsFolder();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
