// this View servers a list of themes to the client.

const express = require("express");
const { getSubfolders, readFile } = require("../utils/fileSystem");

class Themes {

    constructor() {
        this.themes = [];
        this.loadThemes();

        this.router = express.Router();
        this.routes();
    }

    async loadThemes() {
        const themeFolders = await getSubfolders("db/themes");
        for ( const index in themeFolders ) {
            const themeData = await readFile(`db/themes/${themeFolders[index]}/theme.json`);
            this.themes.push(JSON.parse(themeData));
        }
    }

    routes() {
        this.router.get("/api/themes", this.getAllThemes.bind(this))
    }

    getAllThemes(req, res) {
        res.json(this.themes);
    }

}

module.exports = Themes;