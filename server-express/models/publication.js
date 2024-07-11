const { getTimestamp, slugify, formatDate, formatTime } = require("../utils/functions");
const { createFolder, copyFile, deleteFile, writeFile, readFile } = require("../utils/fileSystem");

class Publication {
	constructor(id = null) {
		this.tempWordFilePath = null;
		this.wordFileName = null;
		this.id = id;
		this.publicationFolder = `db/publications/${this.id}`;
		this.inputWordFilePath = `${this.publicationFolder}/input/${this.wordFileName}.docx`;
		this.outputFolderPath = `${this.publicationFolder}/output`;
		this.setProperties();
	}

	setProperties() {
		if (this.id) {
			this.publicationFolder = `db/publications/${this.id}`;
			this.inputWordFilePath = `${this.publicationFolder}/input/${this.wordFileName}.docx`;
			this.outputFolderPath = `${this.publicationFolder}/output`;
		}
	}

	print() {
		return {
			tempWordFilePath: this.tempWordFilePath,
			wordFileName: this.wordFileName,
			id: this.id,
			publicationFolder: this.publicationFolder,
			inputWordFilePath: this.inputWordFilePath,
			outputFolderPath: this.outputFolderPath
		};
	}

	generateId(tempWordFilePath, wordFileName) {
		console.log(tempWordFilePath, wordFileName);
		const timestamp = getTimestamp();
		const id = `${timestamp + "_" + slugify(wordFileName)}`;
		this.id = id;
		this.tempWordFilePath = tempWordFilePath;
		this.wordFileName = wordFileName;
	}

	generateDataObject() {
		const timestamp = getTimestamp();
		const dataObject = {
			uploadedFileName: this.wordFileName,
			date: formatDate(timestamp.split("_")[0]),
			time: formatTime(timestamp.split("_")[1].replace(/-/g, ":")),
			processName: "Word to HTML"
		};
		return dataObject;
	}

	async createPublicationFolder(tempWordFilePath, wordFileName) {
		this.generateId(tempWordFilePath, wordFileName);
		this.publicationFolder = `db/publications/${this.id}`;
		this.inputWordFilePath = `${this.publicationFolder}/input/${this.wordFileName}.docx`;
		this.outputFolderPath = `${this.publicationFolder}/output`;

		// create a job folder in the publications folder
		const newJobFolderPath = await createFolder(this.publicationFolder);

		// create an input folder
		const inputFolderPath = await createFolder(`${newJobFolderPath}/input`);

		// copy uploaded word file from temp to job input folder
		await copyFile(this.tempWordFilePath, inputFolderPath + `/${this.wordFileName}.docx`);

		// delete temp word file
		deleteFile(this.tempWordFilePath);

		// create an output folder
		await createFolder(`${newJobFolderPath}/output`);

		// create data.json file
		const dataObject = this.generateDataObject();
		await writeFile(`${newJobFolderPath}/data.json`, JSON.stringify(dataObject, null, 4));
	}
}

module.exports = Publication;
