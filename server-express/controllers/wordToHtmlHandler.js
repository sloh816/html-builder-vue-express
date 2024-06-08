const express = require("express");
const multer = require("multer");
const fsp = require("fs").promises;
const WordToHtml = require("../models/wordToHtml");
const Theme = require("../models/theme");

const upload = multer({
	dest: "./db/temp/"
});

class WordToHtmlHandler {

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    routes() {
        this.router.post("/api/word-to-html", upload.single("wordFile"), this.handleProcess.bind(this))
    }

    handleProcess(req, res) {
        console.log("🟡 Handling 'Word to HTML' formData");

        // add .docx extension to the file path
        fsp.rename(req.file.path, req.file.path + ".docx");
        
        // instantiate Theme object
        const themeSlug = req.body.themeSlug;
        const themeName = req.body.themeName;
        const theme = new Theme(themeName, themeSlug, "word-to-html");

        // instantiate WordToHtml object
        const tempWordFilePath = req.file.path + ".docx";
        const wordFile = req.file.originalname;
        const wordToHtml = new WordToHtml(tempWordFilePath, wordFile, theme);
        wordToHtml.print();

        // run the process
        wordToHtml.runProcess();
    }
}

module.exports = WordToHtmlHandler;