// this View serves a list of 'info.json data' of a folder to the client.

const express = require("express");
const { getSubfolders, readFile } = require("../utils/fileSystem")

class Info {
    constructor(databaseFolder) {
        this.databaseFolder = databaseFolder
        this.info = []
        this.loadInfo()

        this.router = express.Router();
        this.routes();
    }

    async loadInfo() {
        const processFolders = await getSubfolders(`db/${this.databaseFolder}`)
        processFolders.forEach( async ( folder ) => {
            const data = await readFile(`db/${this.databaseFolder}/${folder}/info.json`)
            this.info.push(JSON.parse(data));
        })
    }

    routes() {
        this.router.get(`/api/${this.databaseFolder}`, this.getAllInfo.bind(this));
    }

    getAllInfo(req, res) {
        res.json(this.info)
    }
}

module.exports = Info;