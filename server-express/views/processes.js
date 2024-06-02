// this View serves a list of processes to the client.

const express = require("express");
const { getSubfolders, readFile } = require("../utils/fileSystem")

class Processes {
    constructor() {
        this.processes = []
        this.loadProcesses()

        this.router = express.Router();
        this.routes();
    }

    async loadProcesses() {
        const processFolders = await getSubfolders("db/processes")
        processFolders.forEach( async ( folder ) => {
            const data = await readFile(`db/processes/${folder}/info.json`)
            this.processes.push(JSON.parse(data));
        })
    }

    routes() {
        this.router.get("/api/processes", this.getAllProcesses.bind(this));
    }

    getAllProcesses(req, res) {
        res.json(this.processes)
    }
}

module.exports = Processes;