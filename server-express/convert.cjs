const { unzip } = require("unzipper");
const WordDocument = require("./models/wordDocument");
const { readStyles, readDocument } = require("./utils/unzipDocx");
const Publication = require("./models/publication");
const cheerio = require("cheerio");
const { readFile } = require("fs").promises;
const path = require("path");
const xml2js = require("xml2js");
const fs = require("fs");

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
			const width = parseInt(inline.attr("cx"));
			const height = parseInt(inline.attr("cy"));

			imageSizes.push({
				width: emuToPixels(width),
				height: emuToPixels(height)
			});
		});
		return imageSizes;
	} catch (err) {
		console.error("Error:", err);
		throw err;
	}
};

const main = async () => {
	const publicationId = "2024-07-15_13-31-31_5043-anrows-fitzgibbon-rr2-v1e-client-reviewed";

	const publication = new Publication(publicationId);
	await publication.setProperties();
	console.log(publication.print());

	const inputWordFile = `${publication.folder}/input/source.docx}`;
	const wordDocument = new WordDocument(inputWordFile);
	const unzippedWordFolder = `${publication.folder}/input/source`;

	const styleMap = await wordDocument.getStyleMap(unzippedWordFolder);

	const css = await wordDocument.getCssCode(unzippedWordFolder);

	const imageSizes = await getImageSizes(unzippedWordFolder);

	const html = await readFile(`${publication.folder}/output/index.html`, "utf8");

	const $ = cheerio.load(html);
	$("img").each((index, img) => {
		// console.log($(img).prop("outerHTML"));
		const imageSize = imageSizes[index];

		$(img).attr("width", imageSize.width);
		$(img).attr("height", imageSize.height);
	});

	// console.log($.html());

	// console.log(imageSizes);

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
