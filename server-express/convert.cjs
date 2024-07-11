const { unzip } = require("unzipper");
const WordDocument = require("./models/wordDocument");
const { readStyles } = require("./utils/unzipDocx");

const main = async () => {
	// const docxFilePath = "5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx";

	// const wordDocument = new WordDocument(docxFilePath);

	// const unzippedWordFolder = await wordDocument.unzip();

	// const styleMap = await wordDocument.createStyleMap(unzippedWordFolder);

	// console.log(styleMap);

	const publicationId = "2024-07-12_24-27-34_5043-anrows-fitzgibbon-rr2-v1e-client-reviewed";

	// create the stylesheet from unzipped word

	const wordDocument = new WordDocument(`db/publications/${publicationId}/input/5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx`);
	const unzippedWordFolder = `db/publications/${publicationId}/input/5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed`;
	const styleMap = await wordDocument.getStyleMap(unzippedWordFolder);

	const css = await wordDocument.getCssCode(unzippedWordFolder);

	// console.log(css);

	// create style.css file
	const fs = require("fs");
	fs.writeFileSync(`db/publications/${publicationId}/output/style.css`, css);
};

main();
