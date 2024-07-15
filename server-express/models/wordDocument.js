const { unzipDocx } = require("../utils/unzipDocx");
const { createStyleMap, createStyleMapObjects } = require("../utils/styleMap");
const { createCssObject, generateCssCode } = require("../utils/cssFromWord");

class WordDocument {
	constructor(filePath) {
		this.filePath = filePath;
		this.styleMapObjects = [];
		this.styleMap = [];
	}

	async unzip() {
		const unzippedWord = await unzipDocx(this.filePath);
		return unzippedWord;
	}

	async getStyleMap(unzippedWordFolder) {
		if (this.styleMapObjects.length === 0) {
			this.styleMapObjects = await this.getStyleMapObjects(unzippedWordFolder);
			this.styleMap = createStyleMap(this.styleMapObjects);
		}

		return this.styleMap;
	}

	async getStyleMapObjects(unzippedWordFolder) {
		const styleMapObjects = await createStyleMapObjects(unzippedWordFolder);
		return styleMapObjects;
	}

	async getCssCode(unzippedWordFolder) {
		const cssObject = await createCssObject(unzippedWordFolder, this.styleMapObjects);
		const cssCode = generateCssCode(cssObject, ".word-to-html");
		return cssCode;
	}
}

module.exports = WordDocument;
