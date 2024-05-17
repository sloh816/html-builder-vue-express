const { create } = require("domain");
const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");

async function createFolder(folderPath) {
	console.log("🔃 Creating folder..." + folderPath);
	try {
		await fsp.mkdir(folderPath, { recursive: true });
		console.log("✅ Folder created successfully:", folderPath);
		return folderPath;
	} catch (err) {
		console.error("🔴 Error creating folder:", err);
	}
}

async function copyFile(sourcePath, destinationPath) {
	console.log("🔃 Copying file from..." + sourcePath + " to " + destinationPath);
	try {
		await fsp.copyFile(sourcePath, destinationPath);
		console.log("✅ File copied successfully:", destinationPath);
		return destinationPath;
	} catch (err) {
		console.error("🔴 Error copying file:", err);
	}
}

function writeFile(filePath, fileData) {
	console.log("🔃 Writing file to..." + filePath);
	const fullFilePath = path.resolve(filePath);
	try {
		fsp.writeFile(fullFilePath, fileData);
		console.log("✅ File written successfully:", filePath);
		return filePath;
	} catch (err) {
		console.error("🔴 Error writing file:", err);
	}
}

function deleteFile(filePath) {
	try {
		// Delete the file
		fs.unlinkSync(filePath);
		console.log(`✅ File written successfully:"`, filePath);
	} catch (error) {
		console.error("🔴 Error deleting file:", err);
	}
}

function readFile(filePath) {
	try {
		// Read the file synchronously and return its contents as a string
		const fileContents = fs.readFileSync(filePath, "utf8");
		return fileContents;
	} catch (error) {
		console.error(`Error reading file: ${error.message}`);
		return null;
	}
}

async function getSubfolders(folderPath) {
	console.log("🔃 Getting subfolders from..." + folderPath);
	const fullFolderPath = path.resolve(folderPath);
	try {
		// Read the contents of the folder
		const files = await fsp.readdir(fullFolderPath);

		// Filter out subfolders
		const subfolders = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(fullFolderPath, file);
				const stat = await fsp.stat(filePath);
				if (stat.isDirectory()) {
					return file;
				}
			})
		);

		// Filter out undefined values (non-folders)
		return subfolders.filter(Boolean);
	} catch (err) {
		throw new Error(`🔴 Error getting subfolders: ${err}`);
	}
}

async function getFiles(folderPath) {
	console.log("🔃 Getting files from..." + folderPath);
	const fullFolderPath = path.resolve(folderPath);

	try {
		const files = await fsp.readdir(fullFolderPath);
		return files;
	} catch (err) {
		throw new Error(`🔴 Error getting files: ${err}`);
	}
}

async function createPublicationsFolder() {
	const publicationFolder = path.resolve("publications");
	try {
		await fsp.access(publicationFolder);
	} catch (err) {
		console.log("⚠️ 'publications' folder does not exist.");
		await createFolder(publicationFolder);
	}
}

module.exports = {
	createFolder,
	copyFile,
	writeFile,
	deleteFile,
	readFile,
	createPublicationsFolder,
	getSubfolders,
	getFiles
};
