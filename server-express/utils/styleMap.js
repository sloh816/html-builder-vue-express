const { readDocument, readStyles, readNumbering, getBulletLvlObject, findRStyles, findPStyles, findTableStyles } = require("./unzipDocx");
const { slugify, repeatString } = require("./functions");

function addStyleItems(documentBody, styles, numbering, styleMapObject) {
	// get all the style ids used in the document
	const usedStyleIds = new Set(findPStyles(documentBody));

	// create an item for each paragraph style
	for (let styleId of usedStyleIds) {
		const styleObject = styles.find((style) => style["$"]["w:styleId"] === styleId);
		const styleName = styleObject["w:name"][0]["$"]["w:val"]; //get style name

		let tag = "p";

		// check if the style is a heading style
		try {
			const outlineLevel = styleObject["w:pPr"][0]["w:outlineLvl"];
			if (outlineLevel) {
				const outlineLevelValue = outlineLevel[0]["$"]["w:val"];
				const headingLevel = parseInt(outlineLevelValue) + 1;
				tag = `h${headingLevel}`;
			}
		} catch {
			// skip throwing error for some style objects that don't have ["w:pPr"]
			// do nothing
		}

		// check if the style is bullet or numbered list
		try {
			// check if bullet, by checking if styleId is in numberingXml
			const bulletStyle = getBulletLvlObject(numbering, styleId);

			if (bulletStyle) {
				const bulletLevel = parseInt(bulletStyle["$"]["w:ilvl"]) + 1;
				const bulletType = bulletStyle["w:numFmt"][0]["$"]["w:val"];

				if (bulletType === "decimal") {
					tag = repeatString("ol > li", bulletLevel);
				} else if (bulletType === "bullet") {
					tag = repeatString("ul > li", bulletLevel);
				}
			}
		} catch {
			// skip throwing error for some style objects that don't have ["pPr"]
			// do nothing
		}

		// create styleMap item and add it to the styleMapObject
		styleMapItem = {
			type: "p",
			styleName: styleName,
			tag: tag,
			className: slugify(styleName),
			id: styleId
		};

		styleMapObject.push(styleMapItem);

		// const styleMapItem = `p[style-name='${styleName}'] => ${tag}.${slugify(styleName)}:fresh`;
		// styleMap.push(styleMapItem);
	}

	// get all the character styles in the document
	const usedCharacterStyleIds = new Set(findRStyles(documentBody));

	// create an item for each character style
	for (let characterStyle of usedCharacterStyleIds) {
		const styleObject = styles.find((style) => style["$"]["w:styleId"] === characterStyle);
		const styleName = styleObject["w:name"][0]["$"]["w:val"]; //get style name

		let tag = "span";

		// if strong or emphasis, change tag to strong or em
		if (styleName === "Strong") {
			tag = "strong";
		} else if (styleName === "Emphasis") {
			tag = "em";
		}

		// create styleMap item and add it to the styleMapObject
		styleMapItem = {
			type: "r",
			styleName: styleName,
			tag: tag,
			className: slugify(styleName),
			id: characterStyle
		};

		styleMapObject.push(styleMapItem);

		// create styleMap item and add it to the styleMap array
		// const styleMapItem = `r[style-name='${styleName}'] => ${tag}.${slugify(styleName)}:fresh`;
		// styleMap.push(styleMapItem);
	}

	// get all the tableObjects in the document
	const usedTableIds = new Set(findTableStyles(documentBody));

	// create an item for each table style
	for (let tableId of usedTableIds) {
		const tableStyleObject = styles.find((style) => style["$"]["w:styleId"] === tableId);
		const tableStyleName = tableStyleObject["w:name"][0]["$"]["w:val"]; //get style name

		// create styleMap item and add it to the styleMapObject
		styleMapItem = {
			type: "table",
			styleName: tableStyleName,
			tag: "table",
			className: slugify(tableStyleName),
			id: tableId
		};

		styleMapObject.push(styleMapItem);

		// create styleMap item and add it to the styleMap array
		// const styleMapItem = `table[style-name='${tableStyleName}'] => table.${slugify(tableStyleName)}:fresh`;
		// styleMap.push(styleMapItem);
	}

	return styleMapObject;
}

function createStyleMap(styleMapObjects) {
	let styleMap = [];
	for (const object of styleMapObjects) {
		const styleMapItem = `${object.type}[style-name='${object.styleName}'] => ${object.tag}.${object.className}:fresh`;
		styleMap.push(styleMapItem);
	}

	return styleMap;
}

async function createStyleMapObjects(unzippedWordFolder) {
	const documentBody = await readDocument(unzippedWordFolder);
	const styles = await readStyles(unzippedWordFolder);
	const numbering = await readNumbering(unzippedWordFolder);

	let styleMapObjects = [];
	styleMapObjects = addStyleItems(documentBody, styles, numbering, styleMapObjects);

	return styleMapObjects;
	// console.log(styleMapObjects);

	// const styleMap = createStyleMapArray(styleMapObject);

	// return styleMap;
}

module.exports = {
	createStyleMapObjects,
	createStyleMap
};
