// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises; // For asynchronous file system operations

const app = express();
app.use(cors());

// functions
function slugify(string) {
	return string
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

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
		res.json({ processes });
	} catch (error) {
		console.error("Error fetching subfolders:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
