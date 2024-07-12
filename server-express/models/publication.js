const { getTimestamp, slugify, formatDate, formatTime } = require("../utils/functions");
const { createFolder, copyFile, deleteFile, writeFile, readFile } = require("../utils/fileSystem");

class Publication {
    constructor(id = null) {
        this.wordFileName = null;
        this.id = id;
        this.publicationFolder = null;
    }

    async setProperties(wordFileName = null) {
        if (this.id) {
            this.publicationFolder = `db/publications/${this.id}`;
        }

        if (wordFileName) {
            this.wordFileName = wordFileName;
        } else {
            this.wordFileName = await this.getData("uploadedFileName");
        }
    }

    async getData(key = false) {
        const data = await readFile(`${this.publicationFolder}/data.json`);
        if (!key) {
            return JSON.parse(data);
        } else {
            const value = JSON.parse(data)[key];
            if (value) {
                return value;
            } else {
                console.log(`❌ Key '${key}' not found in the publication data.json file`);
                return value;
            }
        }
    }

    print() {
        return {
            wordFileName: this.wordFileName,
            id: this.id,
            publicationFolder: this.publicationFolder,
        };
    }

    setId(wordFileName) {
        const timestamp = getTimestamp();
        const id = `${timestamp + "_" + slugify(wordFileName)}`;
        this.id = id;
    }

    generateDataObject() {
        const timestamp = getTimestamp();
        const dataObject = {
            uploadedFileName: this.wordFileName,
            date: formatDate(timestamp.split("_")[0]),
            time: formatTime(timestamp.split("_")[1].replace(/-/g, ":")),
            processName: "Word to HTML",
        };
        return dataObject;
    }

    async createPublicationFolder(tempWordFilePath, wordFileName) {
        this.setId(wordFileName);
        this.setProperties(wordFileName);

        // create a job folder in the publications folder
        const newJobFolderPath = await createFolder(this.publicationFolder);

        // create an input folder
        const inputFolderPath = await createFolder(`${newJobFolderPath}/input`);

        // copy uploaded word file from temp to job input folder
        await copyFile(tempWordFilePath, inputFolderPath + `/source.docx`);

        // delete temp word file
        deleteFile(tempWordFilePath);

        // create an output folder
        await createFolder(`${newJobFolderPath}/output`);

        // create data.json file
        const dataObject = this.generateDataObject();
        await writeFile(`${newJobFolderPath}/data.json`, JSON.stringify(dataObject, null, 4));
    }
}

module.exports = Publication;
