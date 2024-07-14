const { readStyles } = require("./unzipDocx");

function getColour(styleId, styles) {
    const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
    try {
        const colourId = styleObject["w:rPr"][0]["w:color"][0]["$"]["w:val"];
        // console.log(styleId, colourId);

        return colourId;
    } catch {
        try {
            const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
            // console.log(styleId, parentStyleId);
            return getColour(parentStyleId, styles, cssObject);
        } catch {
            // do nothing
        }
    }
}

function getFontSize(styleId, styles) {
    const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);

    if (styleId === "Hyperlink") {
        return "inherit";
    }

    try {
        const fontSize = styleObject["w:rPr"][0]["w:sz"][0]["$"]["w:val"];
        let ptSize = parseInt(fontSize) / 2;
        return convertPtToRem(ptSize);
    } catch {}
}

function convertPtToRem(ptSize) {
    if (10 < ptSize && ptSize <= 12) {
        return "1rem";
    }

    if (ptSize <= 10) {
        return "0.9rem";
    }

    if (ptSize > 12 && ptSize <= 14) {
        return "1.2rem";
    }

    if (ptSize > 14 && ptSize <= 20) {
        return "1.5rem";
    }

    if (ptSize > 20 && ptSize < 30) {
        return "1.8rem";
    }

    if (ptSize >= 30) {
        return "2.5rem";
    }

    return ptSize;
}

function getFontWeight(styleId, styles) {
    const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
    try {
        const bold = styleObject["w:rPr"][0]["w:b"][0];
        if (bold === "") {
            return "bold";
        } else {
            const boldValue = bold["$"]["w:val"];
            if (boldValue === "0") {
                return "normal";
            }
        }
    } catch {
        // do nothing
    }
}

function getIndentation(styleId, styles) {
    const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
    try {
        const indentObject = styleObject["w:pPr"][0]["w:ind"][0]["$"];
        return {
            left: indentObject["w:left"],
            right: indentObject["w:right"],
            hanging: indentObject["w:hanging"],
        };
        // TO DO: Add first line value
    } catch {
        try {
            const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
            return getIndentation(parentStyleId, styles);
        } catch {
            // do nothing
        }
    }
}

function setIndentation(cssObject, selector, indentation) {
    if (indentation["left"]) {
        cssObject[selector]["margin-left"] = indentation["left"] + "px";
    }
}

async function createCssObject(unzippedWordFolder, styleMapObjects) {
    const styles = await readStyles(unzippedWordFolder);

    const cssObject = {};

    // create css object
    for (const object of styleMapObjects) {
        const selector = "." + object.className;
        cssObject[selector] = {};

        // get the colour of the style
        const colourId = getColour(object.id, styles);
        if (colourId && colourId !== "auto" && colourId !== "000000") {
            cssObject[selector]["color"] = `#${colourId}`;
        }

        // get font size
        const fontSize = getFontSize(object.id, styles);
        if (fontSize) {
            cssObject[selector]["font-size"] = fontSize;
        }

        // get font weight
        const fontWeight = getFontWeight(object.id, styles);
        if (fontWeight) {
            cssObject[selector]["font-weight"] = fontWeight;
        }

        const indentation = getIndentation(object.id, styles);
        if (indentation) setIndentation(cssObject, selector, indentation);
    }

    return cssObject;
}

function generateCssCode(cssObject) {
    let cssCode = "";
    for (const selector in cssObject) {
        cssCode += `${selector} {\n`;
        for (const property in cssObject[selector]) {
            cssCode += `    ${property}: ${cssObject[selector][property]};\n`;
        }
        cssCode += "}\n\n";
    }

    return cssCode;
}

module.exports = {
    createCssObject,
    generateCssCode,
};
