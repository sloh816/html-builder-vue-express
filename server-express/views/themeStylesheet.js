const express = require("express");
const { readFile } = require("../utils/fileSystem");

class ThemeStylesheets {
	constructor(styleId) {
		this.styleId = styleId;
		this.stylecss = "";
		this.getStylesheetData();

		this.router = express.Router();
		this.routes();
	}

	async getStylesheetData() {
		const data = await readFile(`db/themes/${this.styleId}/style.css`);
		this.stylecss = data;
	}

	routes() {
		this.router.get(`/api/${this.styleId}/stylesheet`, this.getStylesheet.bind(this));
	}

	getStylesheet(req, res) {
		res.send(this.stylecss);
	}
}

module.exports = ThemeStylesheets;
