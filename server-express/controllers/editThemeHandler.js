const express = require("express");
const bodyParser = require("body-parser");
const { copyFile, folderExists, createFolder, writeFile, readFile } = require("../utils/fileSystem");

class EditThemeHandler {
	constructor() {
		this.router = express.Router();
		this.routes();
	}

	routes() {
		this.router.use(bodyParser.json());
		this.router.use(bodyParser.urlencoded({ extended: true }));

		this.router.post("/api/edit-theme", this.handleEditTheme.bind(this));
	}

	async handleEditTheme(req, res) {
		console.log("🟡 Handling 'Edit Theme' formData");
		const data = req.body;

		// create styleMap from data
		const styleMap = [];
		for (const key in data) {
			if (key.startsWith("styleMapItem-")) {
				styleMap.push(data[key]);
			}
		}

		// get themeId
		const themeId = data.themeId;

		// create a backup of current themeFiles
		await this.createBackup(themeId);

		// update styleMap in data.json
		const dataJson = await readFile(`db/themes/${themeId}/data.json`);
		const dataObject = JSON.parse(dataJson);
		dataObject.styleMap = styleMap;
		await writeFile(`db/themes/${themeId}/data.json`, JSON.stringify(dataObject, null, 4));

		// update style.css
		const stylesheet = data.stylesheet;
		await writeFile(`db/themes/${themeId}/style.css`, stylesheet);
	}

	async createBackup(themeId) {
		const themeFolder = `db/themes/${themeId}`;
		const backupFolder = `${themeFolder}/backup`;

		// check if backup folder exists, if not create it
		const backupFolderExists = await folderExists(backupFolder);
		if (!backupFolderExists) {
			await createFolder(backupFolder);
		}

		// copy style.css and data.json to backup folder
		await copyFile(`${themeFolder}/style.css`, `${backupFolder}/style.css`);
		await copyFile(`${themeFolder}/data.json`, `${backupFolder}/data.json`);
	}
}

module.exports = EditThemeHandler;
