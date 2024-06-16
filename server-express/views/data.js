// this View serves a list of 'data.json data' of a folder to the client.

const express = require("express");
const { getSubfolders, readFile } = require("../utils/fileSystem");

class Data {
	constructor(databaseFolder) {
		this.databaseFolder = databaseFolder;
		this.data = [];
		this.loadData();
		this.router = express.Router();
		this.routes();
	}

	async loadData() {
		const subFolders = await getSubfolders(`db/${this.databaseFolder}`);
		subFolders.forEach(async (folder) => {
			try {
				const data = await readFile(`db/${this.databaseFolder}/${folder}/data.json`);
				const jsonData = JSON.parse(data);
				jsonData.id = folder;
				this.data.push(jsonData);
			} catch (error) {
				console.error("❌ Error parsing JSON data", error);
			}
		});
	}

	routes() {
		this.router.get(`/api/${this.databaseFolder}`, this.getData.bind(this));
	}

	getData(req, res) {
		res.json(this.data);
	}
}

module.exports = Data;
