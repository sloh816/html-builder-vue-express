// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises; // For asynchronous file system operations
const { slugify } = require("./utils/utils");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define a route to serve the list of subfolders within the 'processes' folder
app.get("/api/processes", async (req, res) => {
	try {
		const processesFolder = "./processes"; // Path to the 'processes' folder
		const processFolders = await fs.readdir(processesFolder);
		const processes = processFolders.map((process) => {
			return {
				name: process,
				slug: slugify(process)
			};
		});
		res.json(processes);
	} catch (error) {
		console.error("Error fetching subfolders:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Create multer middleware instance

app.post("/api/word-to-html", (req, res) => {
	const formData = req.body;
	console.log("Form data received: ", formData);
	res.send("Form submitted successfully");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
