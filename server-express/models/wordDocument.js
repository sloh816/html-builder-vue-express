const { unzipDocx } = require("../utils/unzipDocx");
const { createStyleMapFromWord } = require("../utils/styleMap");

class WordDocument {
	constructor(filePath) {
		this.filePath = filePath;
	}

	async unzip() {
		const unzippedWord = await unzipDocx(this.filePath);
		return unzippedWord;
	}

	async createStyleMap(unzippedWordFolder) {
		const styleMap = await createStyleMapFromWord(unzippedWordFolder);
		return styleMap;
	}
}

module.exports = WordDocument;
