const express = require("express");
const multer = require("multer");
const fsp = require("fs").promises;
const WordToHtml = require("../models/wordToHtml");
const Publication = require("../models/publication");
const Theme = require("../models/theme");
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

		const publication = new Publication();
		await publication.createPublicationFolder(tempWordFilePath, wordFile);

		const process = new WordToHtml(publication);
		await process.runProcess();
		restartServer();

		// instantiate Theme object
		// const theme = new Theme(req.body.themeId);

		// instantiate WordToHtml object
		// const tempWordFilePath = req.file.path + ".docx";
		// const wordFile = req.file.originalname;
		// const wordToHtml = new WordToHtml(tempWordFilePath, wordFile, theme);
		// wordToHtml.print();

		// run the process
		// wordToHtml.runProcess();
		// restartServer();
	}
}

module.exports = WordToHtmlHandler;
