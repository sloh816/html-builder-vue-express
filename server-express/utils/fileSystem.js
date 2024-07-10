const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

async function createFolder(folderPath) {
	console.log("🔃 Creating folder..." + folderPath);
	try {
		await fsp.mkdir(folderPath, { recursive: true });
		console.log("✅ Folder created successfully:", folderPath);
		return folderPath;
	} catch (err) {
		console.error("❌ Error creating folder:", err);
	}
}

async function copyFile(sourcePath, destinationPath) {
	console.log("🔃 Copying file from..." + sourcePath + " to " + destinationPath);
	try {
		await fsp.copyFile(sourcePath, destinationPath);
		console.log("✅ File copied successfully:", destinationPath);
		return destinationPath;
	} catch (err) {
		console.error("❌ Error copying file:", err);
	}
}

async function copyFolder(sourceFolder, targetFolder) {
	console.log("🔃 Copying folder from..." + sourceFolder + " to " + targetFolder);
	try {
		// Ensure the target directory exists
		await fsp.mkdir(targetFolder, { recursive: true });

		// Read the contents of the source directory
		const entries = await fsp.readdir(sourceFolder, { withFileTypes: true });

		// Iterate over each entry in the source directory
		for (let entry of entries) {
			const sourcePath = path.join(sourceFolder, entry.name);
			const targetPath = path.join(targetFolder, entry.name);

			if (entry.isDirectory()) {
				// If the entry is a directory, recursively copy it
				await copyFolder(sourcePath, targetPath);
			} else {
				// If the entry is a file, copy it
				await fsp.copyFile(sourcePath, targetPath);
			}
		}
	} catch (err) {
		console.error("❌ Error copying folder:", err);
	}
}

async function renameFolder(oldPath, newPath) {
	console.log("🔃 Renaming folder from..." + oldPath + " to " + newPath);
	try {
		await fsp.rename(oldPath, newPath);
		console.log("✅ Folder renamed successfully:", newPath);
	} catch (err) {
		console.error("❌ Error renaming folder:", err);
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
		console.error("❌ Error writing file:", err);
	}
}

function deleteFile(filePath) {
	try {
		console.log("🔃 Deleting file..." + filePath);
		fs.unlinkSync(filePath);
		console.log(`✅ File deleted successfully:"`, filePath);
	} catch (error) {
		console.error("❌ Error deleting file:", err);
	}
}

async function readFile(filePath) {
	try {
		console.log("🔃 Reading file from..." + filePath);
		const absPath = path.resolve(filePath);
		const data = await fsp.readFile(absPath, "utf8");
		return data;
	} catch (error) {
		console.error(`❌ Error reading file from path: ${filePath}`);
		throw error;
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
		throw new Error(`❌ Error getting subfolders: ${err}`);
	}
}

async function getFiles(folderPath) {
	console.log("🔃 Getting files from..." + folderPath);
	const fullFolderPath = path.resolve(folderPath);

	try {
		const files = await fsp.readdir(fullFolderPath);
		return files;
	} catch (err) {
		throw new Error(`❌ Error getting files: ${err}`);
	}
}

async function createPublicationsFolder() {
	const publicationFolder = path.resolve("db/publications");
	try {
		await fsp.access(publicationFolder);
	} catch (err) {
		console.log("⚠️ 'publications' folder does not exist.");
		await createFolder(publicationFolder);
	}
}

async function folderExists(folderPath) {
	try {
		const absPath = path.resolve(folderPath);
		await fsp.access(absPath);
		console.log(`✅ Folder exists: ${folderPath}`);
		return true;
	} catch (err) {
		console.log(`⚠️ Folder does not exist: ${folderPath}`);
		return false;
	}
}

// function that reads an XML file and returns a promise that resolves to the parsed XML object
function readXMLFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				return reject(err);
			}

			xml2js.parseString(data, (err, result) => {
				if (err) {
					return reject(err);
				}
				resolve(result);
			});
		});
	});
}

module.exports = {
	createFolder,
	copyFile,
	writeFile,
	deleteFile,
	readFile,
	createPublicationsFolder,
	getSubfolders,
	getFiles,
	folderExists,
	copyFolder,
	renameFolder,
	readXMLFile
};
