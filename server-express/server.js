// server.js

const express = require("express");
const cors = require("cors");

const WordToHtmlHandler = require("./controllers/wordToHtmlHandler");
const EditThemeHandler = require("./controllers/editThemeHandler");

const { createPublicationsFolder, getSubfolders } = require("./utils/fileSystem");
const eventEmitter = require("./utils/eventEmitter");

const Data = require("./views/data");
const ThemeStylesheet = require("./views/themeStylesheet");

class Server {
	constructor(portNumber) {
		this.app = express();
		this.dbFolders = ["processes", "themes", "publications"];
		this.themes = [];
		this.config();
		this.serverRoutes();
		this.handlerRoutes();
		this.server = null;
		this.portNumber = portNumber || 3000;
		this.start(this.portNumber);
	}

	config() {
		this.app.use(cors());
		createPublicationsFolder();
	}

	async serverRoutes() {
		for (let folder of this.dbFolders) {
			const data = new Data(folder);
			this.app.use(data.router);
		}

		this.app.use("/api/publication-outputs", express.static("db/publications"));

		this.themes = await getSubfolders("db/themes");
		for (let folder of this.themes) {
			const themeStylesheet = new ThemeStylesheet(folder);
			this.app.use(themeStylesheet.router);
		}
	}

	handlerRoutes() {
		const wordToHtmlHandler = new WordToHtmlHandler();
		this.app.use(wordToHtmlHandler.router);

		const editThemeHandler = new EditThemeHandler();
		this.app.use(editThemeHandler.router);
	}

	start(portNumber) {
		this.server = this.app.listen(portNumber, () => {
			console.log(`🟢 Server running on port ${portNumber}`);
		});
	}

	stop() {
		if (this.server) {
			this.server.close();
			console.log("🟥 Server stopped.");
		}
	}

	restart() {
		if (this.server) {
			console.log("🟡 Restarting server...");

			try {
				this.server.close();
				console.log("🟥 Server stopped.");
				this.start(this.portNumber);
			} catch (error) {
				console.log("🟥 Error closing server:", error);
			}
		} else {
			this.start(this.portNumber);
		}
	}
}

const server = new Server();

module.exports = Server;
