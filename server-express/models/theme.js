
class Theme {

    constructor(themeName, themeSlug, processSlug) {
        this.themeName = themeName;
        this.themeSlug = themeSlug;
        this.themeFolder = processSlug + "_" + themeSlug;
    }

    getName() {
        return this.themeName;
    }

    getFolder() {
        return this.themeFolder;
    }

    getSlug() {
        return this.themeSlug;
    }

}

module.exports = Theme;