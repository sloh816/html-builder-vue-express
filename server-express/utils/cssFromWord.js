const { readStyles } = require("./unzipDocx");

async function createCssObject(unzippedWordFolder, styleMapObjects) {
	const styles = await readStyles(unzippedWordFolder);

	const cssObject = {};

	// create css object
	for (const object of styleMapObjects) {
		// get the styleObject from styles based on the id
		const styleObject = styles.find((style) => style["$"]["w:styleId"] === object.id);
		const selector = "." + object.className;
		cssObject[selector] = {};

		// get the colour of the style
		try {
			const colour = styleObject["w:rPr"][0]["w:color"][0]["$"]["w:val"];
			const cssColour = "#" + colour.trim();

			if (cssColour !== "#000000" && cssColour !== "#auto") {
				cssObject[selector]["color"] = cssColour;
			}
		} catch {
			// do nothing
		}

		// get font size
		try {
			const fontSize = styleObject["w:rPr"][0]["w:sz"][0]["$"]["w:val"];
			let ptSize = parseInt(fontSize) / 2;
			const cssFontSize = getFontSize(ptSize, object.id);
			cssObject[selector]["font-size"] = cssFontSize;
		} catch {
			// do nothing
		}

		// get font weight
		try {
			const bold = styleObject["w:rPr"][0]["w:b"][0];
			if (bold === "") {
				cssObject[selector]["font-weight"] = "bold";
			} else {
				const boldValue = bold["$"]["w:val"];
				if (boldValue === "0") {
					cssObject[selector]["font-weight"] = "normal";
				}
			}
		} catch {
			// do nothing
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

function getFontSize(ptSize, objectId) {
	if (objectId === "Hyperlink") {
		return "inherit";
	}

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

module.exports = {
	createCssObject,
	generateCssCode
};
