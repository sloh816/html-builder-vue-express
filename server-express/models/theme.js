
class Theme {

    constructor(themeName, themeSlug, processSlug) {
        this.themeName = themeName;
        this.themeSlug = themeSlug;
        this.themeId = processSlug + "_" + themeSlug;
    }

    getName() {
        return this.themeName;
    }

    getId() {
        return this.themeId;
    }

    getSlug() {
        return this.themeSlug;
    }

}

module.exports = Theme;