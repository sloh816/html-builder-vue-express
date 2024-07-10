const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const util = require("util");

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

module.exports = { unzipDocx };
