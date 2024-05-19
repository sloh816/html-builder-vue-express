const fs = require("fs").promises;
const path = require("path");

async function writeHtmlFile({ templateFilePath, data, outputFilePath }) {
	const fullTemplathFilePath = path.resolve(templateFilePath);
	const fullOuputFilePath = path.resolve(outputFilePath);

	const templateHtml = await fs.readFile(fullTemplathFilePath, "utf8");

	let html = templateHtml;
	for (const [key, value] of Object.entries(data)) {
		html = html.replace(`{{ ${key} }}`, value);
	}

	await fs.writeFile(fullOuputFilePath, html, "utf-8");
}

module.exports = {
	writeHtmlFile
};
