const { readStyles } = require("./unzipDocx");

function getColour(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
	if (styleId === "hyperlink") {
		return "inherit";
	}

	try {
		const colourId = styleObject["w:rPr"][0]["w:color"][0]["$"]["w:val"];
		return colourId;
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getColour(parentStyleId, styles);
		} catch {
			// do nothing
		}
	}
}

function setColour(cssObject, selector, colourId) {
	if (selector.includes("hyperlink")) {
		cssObject[selector]["color"] = "inherit";
	} else if (selector.includes("toc")) {
		selector = `${selector} a`;
		cssObject[selector] = {};
		cssObject[selector]["color"] = `#${colourId}`;
	} else if (colourId && colourId !== "auto") {
		cssObject[selector]["color"] = `#${colourId}`;
	}
}

function getFontSize(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);

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
			firstline: indentObject["w:firstLine"]
		};
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
	for (const key in indentation) {
		const intValue = parseInt(indentation[key]);
		const inches = intValue / 1440;
		const pixels = inches * 96;
		indentation[key] = Math.floor(pixels, 1);
	}

	if (indentation["left"]) {
		cssObject[selector]["margin-left"] = indentation["left"] + "px";
	}

	if (indentation["right"]) {
		cssObject[selector]["margin-right"] = indentation["right"] + "px";
	}

	if (indentation["hanging"]) {
		cssObject[selector]["text-indent"] = "-" + indentation["hanging"] + "px";
	}

	if (indentation["firstline"]) {
		cssObject[selector]["text-indent"] = indentation["firstline"] + "px";
	}
}

function getJustification(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
	try {
		const justification = styleObject["w:pPr"][0]["w:jc"][0]["$"]["w:val"];
		return justification;
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getJustification(parentStyleId, styles);
		} catch {
			// do nothing
		}
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
		if (colourId) {
			setColour(cssObject, selector, colourId);
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

		// get indentations
		const indentation = getIndentation(object.id, styles);
		if (indentation) setIndentation(cssObject, selector, indentation);

		// get justification
		const justification = getJustification(object.id, styles);
		if (justification) {
			cssObject[selector]["text-align"] = justification;
		}
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
	generateCssCode
};
