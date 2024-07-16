const { unzip } = require("unzipper");
const WordDocument = require("./models/wordDocument");
const { readStyles, readDocument } = require("./utils/unzipDocx");
const Publication = require("./models/publication");
const cheerio = require("cheerio");
const { readFile } = require("fs").promises;
const path = require("path");
const xml2js = require("xml2js");
const fs = require("fs");
const Fonts = require("./models/fonts");
const WordToHtml = require("./models/wordToHtml");

function emuToPixels(emu) {
	return Math.floor(emu / 9525, 1);
}

const getImageSizes = async (unzippedFolderPath) => {
	try {
		// const xmlData = await readDocument(unzippedFolderPath);
		const documentXML = await readFile(`${unzippedFolderPath}/word/document.xml`, "utf8");

		const $ = cheerio.load(documentXML);

		const imageSizes = [];

		$("w\\:drawing").each((index, drawing) => {
			const inline = $(drawing).find("wp\\:inline wp\\:extent");

			if (inline.length > 0) {
				const width = parseInt(inline.attr("cx"));
				const height = parseInt(inline.attr("cy"));

				imageSizes.push({
					width: emuToPixels(width),
					height: emuToPixels(height)
				});
			} else {
				console.log("❌ Error: There are images that are not inline.");
			}
		});
		return imageSizes;
	} catch (err) {
		console.error("Error:", err);
		throw err;
	}
};

const main = async () => {
	const publicationId = "2024-07-16_11-19-40_5043-anrows-ncas-21-summary-report-v2-client-reviewed";

	const publication = new Publication(publicationId);
	await publication.setProperties();

	const process = new WordToHtml(publication);
	await process.runProcess();

	// unzip the input word doc
	// const wordFilePath = `${publication.folder}/input/source.docx`;
	// const inputWordDoc = new WordDocument(wordFilePath);
	// const unzippedWordFolder = await inputWordDoc.unzip();
	// await inputWordDoc.getStyleMap(unzippedWordFolder);
	// const css = await inputWordDoc.getCssCode(unzippedWordFolder);

	// console.log(css);

	// const inputWordFile = `${publication.folder}/input/source.docx}`;
	// const wordDocument = new WordDocument(inputWordFile);
	// const unzippedWordFolder = await wordDocument.unzip();

	// const styleMap = await wordDocument.getStyleMap(unzippedWordFolder);

	// const css = await wordDocument.getCssCode(unzippedWordFolder);

	// const imageSizes = await getImageSizes(unzippedWordFolder);
	// console.log(imageSizes);

	// console.log(css);

	// // create the stylesheet from unzipped word

	// const wordDocument = new WordDocument(`db/publications/${publicationId}/input/5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx`);
	// const unzippedWordFolder = `db/publications/${publicationId}/input/5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed`;
	// const styleMap = await wordDocument.getStyleMap(unzippedWordFolder);

	// const css = await wordDocument.getCssCode(unzippedWordFolder);

	// // create style.css file
	// const fs = require("fs");
	// fs.writeFileSync(`db/publications/${publicationId}/output/style.css`, css);
};

main();
