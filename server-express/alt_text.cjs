const fs = require("fs");
const unzipper = require("unzipper");

async function unzipFile(zipFilePath, outputDir) {
	try {
		// Ensure the output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Create a stream to read the zip file and extract its contents
		fs.createReadStream(zipFilePath)
			.pipe(unzipper.Extract({ path: outputDir }))
			.on("close", () => {
				console.log(`Unzipped ${zipFilePath} to ${outputDir}`);
			})
			.on("error", (error) => {
				console.error(`Error unzipping file: ${error.message}`);
			});
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

function unzipWord() {
	const docxFile = "5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx";

	// copy file
	const zippedWord = "wordDoc.zip";
	fs.copyFileSync(docxFile, zippedWord);

	// unzip file
	const unzippedWord = "_unzippedWord";
	unzipFile(zippedWord, unzippedWord);
}

function getAltText() {
	// Read the document.xml file
	const documentXMLFile = `_unzippedWord/word/document.xml`;
	const documentXML = fs.readFileSync(documentXMLFile, "utf8");

	// get all the docPrs tags
	const docPrRegex = /docPr.*?\/>/gs;

	const docPrs = [];

	let docPrMatch;

	while ((docPrMatch = docPrRegex.exec(documentXML)) !== null) {
		docPrs.push(docPrMatch[0]);
	}

	// get all the descr tags from the docPr tags
	const descrRegex = /descr="(.*?)"/g;
	const altText = [];

	for (let docPr of docPrs) {
		let descrMatch;
		while ((descrMatch = descrRegex.exec(docPr)) !== null) {
			altText.push(descrMatch[1]);
		}

		console.log("Copy this:\n", altText.join("$__"));
		console.log("Images found:", altText.length);
	}
}

unzipWord();
// setTimeout(getAltText, 2000);
