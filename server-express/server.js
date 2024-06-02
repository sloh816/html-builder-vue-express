// server.js

const express = require("express");
const cors = require("cors");

const Processes = require("./views/processes");

const WordToHtmlHandler = require("./controllers/handleWordToHtml");
const Themes = require("./views/themes");
const { createPublicationsFolder } = require("./utils/fileSystem")

class Server {

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(cors());
        createPublicationsFolder();
    }

    routes() {
        // servers
        const processes = new Processes();
        this.app.use(processes.router);

        const themes = new Themes();
        this.app.use(themes.router);

        // handlers
        const wordToHtmlHandler = new WordToHtmlHandler();
        this.app.use(wordToHtmlHandler.router);
    }

    start(portNumber) {
        this.app.listen(portNumber, () => {
            console.log(`Server running on port ${portNumber}`);
        });
    }
}

const server = new Server();
server.start(3000);