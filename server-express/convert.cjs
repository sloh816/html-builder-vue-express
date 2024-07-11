const WordDocument = require("./models/wordDocument");

const main = async () => {
	const docxFilePath = "5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx";

	const wordDocument = new WordDocument(docxFilePath);

	const unzippedWordFolder = await wordDocument.unzip();

	const styleMap = await wordDocument.createStyleMap(unzippedWordFolder);

	console.log(styleMap);
};

main();
