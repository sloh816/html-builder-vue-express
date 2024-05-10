const { create } = require("domain");
const fs = require("fs").promises;
const path = require("path");

async function createFolder(folderPath) {
	console.log("🔃 Creating folder...");
	try {
		await fs.mkdir(folderPath, { recursive: true });
		console.log("✅ Folder created successfully:", folderPath);
		return folderPath;
	} catch (err) {
		console.error("🔴 Error creating folder:", err);
	}
}

async function copyFile(sourcePath, destinationPath) {
	console.log("🔃 Copying file...");
	try {
		await fs.copyFile(sourcePath, destinationPath);
		console.log("✅ File copied successfully:", destinationPath);
		return destinationPath;
	} catch (err) {
		console.error("🔴 Error copying file:", err);
	}
}

async function writeFile(filePath, fileData) {
	console.log("🔃 Writing file...");
	const fullFilePath = path.resolve(filePath);
	try {
		fs.writeFile(fullFilePath, fileData);
		console.log("✅ File written successfully:", filePath);
		return filePath;
	} catch (err) {
		console.error("🔴 Error writing file:", err);
	}
}

async function deleteFile(filePath) {
	console.log("🔃 Deleting file...");
	const fullFilePath = path.resolve(filePath);
	try {
		await fs.unlink(fullFilePath);
		console.log("✅ File deleted successfully:", filePath);
	} catch (err) {
		console.error("🔴 Error deleting file:", err);
	}
}

async function readFile(filePath, fileType) {
	console.log("🔃 Reading file...");
	const fullFilePath = path.resolve(filePath);

	if (fileType === "html" || fileType === "json") {
		try {
			const data = await fs.readFile(fullFilePath, "utf8");
			return data;
		} catch (err) {
			console.error("🔴 Error reading file:", err);
		}
	}
}

async function getSubfolders(folderPath) {
	console.log("🔃 Getting subfolders...");
	const fullFolderPath = path.resolve(folderPath);
	try {
		// Read the contents of the folder
		const files = await fs.readdir(fullFolderPath);

		// Filter out subfolders
		const subfolders = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(fullFolderPath, file);
				const stat = await fs.stat(filePath);
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
	console.log("🔃 Getting files...");
	const fullFolderPath = path.resolve(folderPath);

	try {
		const files = await fs.readdir(fullFolderPath);
		return files;
	} catch (err) {
		throw new Error(`🔴 Error getting files: ${err}`);
	}
}

async function createPublicationsFolder() {
	const publicationFolder = path.resolve("publications");
	try {
		await fs.access(publicationFolder);
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
