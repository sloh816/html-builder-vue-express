const { getSubfolders, readFile } = require("../utils/fileSystem");

class Fonts {
	constructor() {
		this.fonts = [];
	}

	async setFonts() {
		const fonts = await getSubfolders("db/fonts");

		// read the data.json file
		for (const index in fonts) {
			const font = fonts[index];
			const fontDataFile = await readFile("db/fonts/" + font + "/data.json", "utf8");
			const fontData = JSON.parse(fontDataFile);
			this.fonts[font] = fontData;
		}
	}

	async getFonts() {
		if (this.fonts.length === 0) {
			await this.setFonts();
		}

		return this.fonts;
	}

	async getFont(fontName) {
		if (this.fonts.length === 0) {
			await this.setFonts();
		}

		return this.fonts[fontName];
	}
}

module.exports = Fonts;
