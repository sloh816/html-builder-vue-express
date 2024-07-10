const { readFile, copyFile, createFolder, writeFile, folderExists } = require("../utils/fileSystem");

class Theme {
	constructor(themeId) {
		this.id = themeId;
		this.folder = `db/themes/${this.id}`;
		this.stylesheetPath = `${this.folder}/style.css`;
		this.dataFilePath = `${this.folder}/data.json`;
	}

	// reads the data.json file of the theme
	async getData(key = false) {
		const data = await readFile(this.dataFilePath);
		if (!key) {
			return JSON.parse(data);
		} else {
			const value = JSON.parse(data)[key];
			if (value) {
				return value;
			} else {
				console.log(`❌ Key '${key}' not found in the theme data.json file`);
				return value;
			}
		}
	}

	// copies style.css file from themes folder to a destination folder
	async copyStylesheet(destinationFolder) {
		const destinationPath = `${destinationFolder}/style.css`;
		await copyFile(this.stylesheetPath, destinationPath);
	}

	async backupData() {
		const backupFolder = `${this.folder}/backup`;

		// check if backup folder exists, if not create it
		const backupFolderExists = await folderExists(backupFolder);
		if (!backupFolderExists) {
			await createFolder(backupFolder);
		}

		// copy style.css and data.json to backup folder
		await this.copyStylesheet(backupFolder);
		await copyFile(this.dataFilePath, `${backupFolder}/data.json`);
	}

	async setData(newData) {
		let data = {};

		//check if data file exists, if not create it
		const dataFileExists = await folderExists(this.dataFilePath);

		if (dataFileExists) {
			const fileData = await readFile(this.dataFilePath);
			data = JSON.parse(fileData);

			for (let key in newData) {
				data[key] = newData[key];
			}

			await writeFile(this.dataFilePath, JSON.stringify(data, null, 4));
		} else {
			console.log("❌ Data file doesn't exist");
		}
	}

	async setStylesheet(newStylesheet) {
		await writeFile(this.stylesheetPath, newStylesheet);
	}

	async createNewTheme({ id, name, processId, options }) {
		// check if theme folder exists, if not create it
		const themeFolderExists = await folderExists(this.folder);

		if (themeFolderExists) {
			console.log(`Cannot create new theme: ❌ Theme folder already exists`);
		} else {
			await createFolder(this.folder);
			await this.setData({ id, name, processId });

			if (processId === "word-to-html") {
				const { styleMap, stylesheet } = options;
				await this.setData({ styleMap });
				await this.setStylesheet(stylesheet);
			}
		}
	}

	async edit({ name, styleMap, stylesheet }) {
		console.log("🔃 Editing theme...");

		// create a backup of current themeFiles
		await this.backupData();

		console.log({ name, styleMap, stylesheet });

		if (name) {
			this.setData({ name });
		}

		if (styleMap) {
			this.setData({ styleMap });
		}

		if (stylesheet) {
			this.setData({ stylesheet });
		}
	}
}

module.exports = Theme;
