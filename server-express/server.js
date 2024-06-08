// server.js

const express = require("express");
const cors = require("cors");

const WordToHtmlHandler = require("./controllers/wordToHtmlHandler");
const { createPublicationsFolder } = require("./utils/fileSystem");
const Data = require("./views/data");

class Server {

    constructor() {
        this.app = express();
        this.dbFolders = ["processes", "themes", "publications"]
        this.config();
        this.routes();
    }

    config() {
        this.app.use(cors());
        createPublicationsFolder();
    }

    routes() {
        // servers
        for (let folder of this.dbFolders) {
            const data = new Data(folder)
            this.app.use(data.router)
        }

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