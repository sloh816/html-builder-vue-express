const { getSubfolders, readFile } = require("./fileSystem");
const { readStyles } = require("./unzipDocx");
const Fonts = require("../models/fonts");

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
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getFontSize(parentStyleId, styles);
		} catch {
			// do nothing
		}
	}
}

function convertPtToRem(ptSize) {
	if (ptSize <= 9) {
		return "0.8rem";
	}

	if (ptSize <= 10) {
		return "0.9rem";
	}

	if (10 < ptSize && ptSize <= 11) {
		return "1rem";
	}

	if (ptSize >= 12 && ptSize <= 14) {
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

function getSpacing(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
	try {
		const spacing = styleObject["w:pPr"][0]["w:spacing"][0]["$"];
		return {
			before: spacing["w:before"],
			after: spacing["w:after"]
		};
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getSpacing(parentStyleId, styles);
		} catch {
			// do nothing
		}
	}
}

function setSpacing(cssObject, selector, spacing) {
	if (spacing["before"]) {
		const before = parseInt(spacing["before"]) / 20;
		cssObject[selector]["margin-top"] = before + "px";
	}

	if (spacing["after"]) {
		const after = parseInt(spacing["after"]) / 20;
		cssObject[selector]["margin-bottom"] = after + "px";
	}
}

function getFontFamily(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
	try {
		const fontFamily = styleObject["w:rPr"][0]["w:rFonts"][0]["$"]["w:ascii"];
		return fontFamily;
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getFontFamily(parentStyleId, styles);
		} catch {
			// do nothing
		}
	}
}

function getBorder(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
	try {
		const border = styleObject["w:pPr"][0]["w:pBdr"][0];
		return {
			top: border["w:top"][0]["$"],
			bottom: border["w:bottom"][0]["$"],
			left: border["w:left"][0]["$"],
			right: border["w:right"][0]["$"]
		};
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getBorder(parentStyleId, styles);
		} catch {
			// do nothing
		}
	}
}

function setBorder(cssObject, selector, border) {
	const borderSide = (side) => {
		const borderObject = border[side];
		if (borderObject) {
			let borderStyle = "";

			if (borderObject["w:val"] === "single") {
				borderStyle = "solid";
			}

			if (borderObject["w:sz"]) {
				const borderSize = parseInt(borderObject["w:sz"] / 4);
				borderStyle += ` ${borderSize}px`;
			}

			if (borderObject["w:color"]) {
				const colour = borderObject["w:color"];
				borderStyle += ` #${colour}`;
			}

			cssObject[selector][`border-${side}`] = borderStyle;

			if (borderObject["w:space"]) {
				let space = parseInt(borderObject["w:space"]);

				if (side === "left") {
					if (cssObject[selector][`margin-${side}`]) {
						const margin = parseInt(cssObject[selector][`margin-${side}`].replace("px", ""));
						space += margin;
						delete cssObject[selector][`margin-${side}`];
					}
				}

				cssObject[selector][`padding-${side}`] = `${space}px`;
			}
		}
	};

	for (const side in border) {
		borderSide(side);
	}
}

async function setFontFamily(cssObject, selector, fontFamily) {
	const fonts = new Fonts();
	const font = await fonts.getFont(fontFamily);
	const css = font["css"];

	cssObject[selector]["font-family"] = css;
}

function getShading(styleId, styles) {
	const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
	try {
		const shading = styleObject["w:pPr"][0]["w:shd"][0]["$"]["w:fill"];
		return shading;
	} catch {
		try {
			const parentStyleId = styleObject["w:basedOn"][0]["$"]["w:val"];
			return getShading(parentStyleId, styles);
		} catch {
			// do nothing
		}
	}
}

function setBackgroundColor(cssObject, selector, colourId) {
	if (colourId && colourId !== "auto") {
		cssObject[selector]["background-color"] = `#${colourId}`;
	}
}

async function createCssObject(unzippedWordFolder, styleMapObjects) {
	const styles = await readStyles(unzippedWordFolder);

	const cssObject = {};

	// create css object for the body
	cssObject[".word-to-html"] = {};
	const normalFontSize = getFontFamily("Normal", styles);
	if (normalFontSize) {
		await setFontFamily(cssObject, ".word-to-html", normalFontSize);
	}

	// create css objects for each styleMapObject
	for (const object of styleMapObjects) {
		const selector = "." + object.className;
		cssObject[selector] = {};

		// colour
		const colourId = getColour(object.id, styles);
		if (colourId) {
			setColour(cssObject, selector, colourId);
		}

		// font size
		const fontSize = getFontSize(object.id, styles);
		if (fontSize) {
			cssObject[selector]["font-size"] = fontSize;
		}

		// font weight
		const fontWeight = getFontWeight(object.id, styles);
		if (fontWeight) {
			cssObject[selector]["font-weight"] = fontWeight;
		}

		// indentations
		const indentation = getIndentation(object.id, styles);
		if (indentation) setIndentation(cssObject, selector, indentation);

		// justification
		const justification = getJustification(object.id, styles);
		if (justification) {
			cssObject[selector]["text-align"] = justification;
		}

		// spacing before and after
		const spacing = getSpacing(object.id, styles);
		if (spacing) {
			setSpacing(cssObject, selector, spacing);
		}

		// font family
		const fontFamily = getFontFamily(object.id, styles);
		if (fontFamily) {
			await setFontFamily(cssObject, selector, fontFamily);
		}

		// border
		const border = getBorder(object.id, styles);
		if (border) {
			setBorder(cssObject, selector, border);
		}

		// shading
		const shading = getShading(object.id, styles);
		if (shading) {
			setBackgroundColor(cssObject, selector, shading);
		}
	}

	return cssObject;
}

function generateCssCode(cssObject, contentClass) {
	let cssCode = "";
	for (const selector in cssObject) {
		if (selector === contentClass) {
			cssCode += `${selector} {\n`;
		} else {
			cssCode += `${contentClass} ${selector} {\n`;
		}

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
