const express = require("express");
const multer = require("multer");
const fsp = require("fs").promises;
const WordToHtml = require("../models/wordToHtml");
const Publication = require("../models/publication");
const { restartServer } = require("../utils/pm2");

const upload = multer({
	dest: "./db/temp/"
});

class WordToHtmlHandler {
	constructor() {
		this.router = express.Router();
		this.routes();
	}

	routes() {
		this.router.post("/api/word-to-html", upload.single("wordFile"), this.handleProcess.bind(this));
	}

	async handleProcess(req, res) {
		console.log("🟡 Handling 'Word to HTML' formData");

		// add .docx extension to the file path
		fsp.rename(req.file.path, req.file.path + ".docx");
		const tempWordFilePath = req.file.path + ".docx";
		const wordFile = req.file.originalname;

        // create the publication folder
		const publication = new Publication();
		await publication.createPublicationFolder(tempWordFilePath, wordFile);

        // run the process on the publication
		const process = new WordToHtml(publication);
		const success = await process.runProcess();

        // send the response
        res.send({success});

        // // restart the server to serve the new files
		// restartServer();
	}
}

module.exports = WordToHtmlHandler;
