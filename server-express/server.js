// server.js

const express = require("express");
const cors = require("cors");

const WordToHtmlHandler = require("./controllers/handleWordToHtml");
const { createPublicationsFolder } = require("./utils/fileSystem");
const Info = require("./views/info");

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
        const processes = new Info("processes")
        this.app.use(processes.router)

        const themes = new Info("themes")
        this.app.use(themes.router)

        const publications = new Info("publications")
        this.app.use(publications.router)

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