const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const util = require("util");
const { readXMLFile } = require("./fileSystem");

const copyFile = util.promisify(fs.copyFile);
const mkdir = util.promisify(fs.mkdir);

// copies a DOCX file to a new ZIP file with the same name and returns the path to the new ZIP file
async function createZipFromDocx(docxFilePath) {
	const zipFilePath = path.join(path.dirname(docxFilePath), `${path.basename(docxFilePath, ".docx")}.zip`);
	await copyFile(docxFilePath, zipFilePath);
	return zipFilePath;
}

// unzips a ZIP file to a specified output directory and returns the path to the output directory
async function unzipFile(zipFilePath, outputDir) {
	await mkdir(outputDir, { recursive: true });
	await fs
		.createReadStream(zipFilePath)
		.pipe(unzipper.Extract({ path: outputDir }))
		.promise();
	return outputDir;
}

// converts a DOCX file to a ZIP file and unzips it to a directory with the same name as the DOCX file
async function unzipDocx(docxFilePath) {
	try {
		const zipFilePath = await createZipFromDocx(docxFilePath);
		const outputDir = path.join(path.dirname(docxFilePath), path.basename(docxFilePath, ".docx"));
		const unzippedFolderPath = await unzipFile(zipFilePath, outputDir);
		return unzippedFolderPath;
	} catch (err) {
		console.error("Error:", err);
		throw err;
	}
}

async function readDocument(unzipWordFolder) {
	const documentXMLFile = path.join(unzipWordFolder, "word/document.xml");
	const documentXML = await readXMLFile(documentXMLFile);
	const documentBody = documentXML["w:document"]["w:body"][0];
	return documentBody;
}

async function readStyles(unzipWordFolder) {
	const stylesXMLFile = path.join(unzipWordFolder, "word/styles.xml");
	const stylesXML = await readXMLFile(stylesXMLFile);
	const styles = stylesXML["w:styles"]["w:style"];
	return styles;
}

async function readNumbering(unzipWordFolder) {
	const numberingXMLFile = path.join(unzipWordFolder, "word/numbering.xml");
	const numberingXML = await readXMLFile(numberingXMLFile);
	const numbering = numberingXML["w:numbering"];
	return numbering;
}

// function that checks if a numbering.xml file contains a pStyle with a specific value. If it does, it returns the lvl object
function getBulletLvlObject(numberingData, styleName) {
	const abstractNums = numberingData["w:abstractNum"];
	for (const abstractNum of abstractNums) {
		if (abstractNum["w:lvl"]) {
			for (const lvl of abstractNum["w:lvl"]) {
				if (lvl["w:pStyle"] && lvl["w:pStyle"][0]["$"]["w:val"] === styleName) {
					return lvl;
				}
			}
		}
	}
	return false;
}

function findRStyles(documentBody) {
	try {
		const rStyles = [];

		const traverse = (obj) => {
			for (const key in obj) {
				if (key === "w:rStyle") {
					rStyles.push(obj[key][0]["$"]["w:val"]);
				} else if (typeof obj[key] === "object") {
					traverse(obj[key]);
				}
			}
		};

		traverse(documentBody);

		return rStyles;
	} catch (err) {
		console.error("Error:", err);
		throw err;
	}
}

function findPStyles(documentBody) {
	try {
		const pStyles = [];
		const traverse = (obj) => {
			for (const key in obj) {
				if (key === "w:pStyle") {
					pStyles.push(obj[key][0]["$"]["w:val"]);
				} else if (typeof obj[key] === "object") {
					traverse(obj[key]);
				}
			}
		};

		traverse(documentBody);

		return pStyles;
	} catch (err) {
		console.error("Error:", err);
		throw err;
	}
}

function findTableStyles(documentBody) {
	try {
		const pStyles = [];
		const traverse = (obj) => {
			for (const key in obj) {
				if (key === "w:tblStyle") {
					pStyles.push(obj[key][0]["$"]["w:val"]);
				} else if (typeof obj[key] === "object") {
					traverse(obj[key]);
				}
			}
		};

		traverse(documentBody);

		return pStyles;
	} catch (err) {
		console.error("Error:", err);
		throw err;
	}
}

module.exports = { unzipDocx, readDocument, readStyles, readNumbering, getBulletLvlObject, findRStyles, findPStyles, findTableStyles };
