const express = require("express");
const bodyParser = require("body-parser");
const { restartServer } = require("../utils/pm2");
const Theme = require("../models/theme");

class ThemeHandler {
	constructor() {
		this.router = express.Router();
		this.routes();
	}

	routes() {
		this.router.use(bodyParser.json());
		this.router.use(bodyParser.urlencoded({ extended: true }));

		this.router.post("/api/handle-theme", this.handleTheme.bind(this));
	}

	async handleTheme(req, res) {
		console.log("🟡 Handling 'Theme' formData");
		const data = req.body;

		// get themeId and instantiate Theme object
		const themeId = data.id;
		const theme = new Theme(themeId);

		if (data.action === "edit") {
			console.log(req.body);
			theme.edit({ styleMap: req.body.options.  });
		}

		// update theme name

		// // update styleMap and theme name in data.json
		// const newThemeData = {
		// 	name: data.name,
		// 	styleMap: data.styleMap
		// };
		// await theme.setData(newThemeData);

		// // update style.css
		// await theme.setStylesheet(data.stylesheet);

		// restart the server
		// restartServer();
	}
}

module.exports = ThemeHandler;
