const fs = require("fs");
const path = require("path");
const { slugify, repeatString } = require("./utils/functions");
const { unzipDocx } = require("./utils/unzipDocx");
const { readXMLFile } = require("./utils/fileSystem");

// function that checks if a numbering.xml file contains a pStyle with a specific value. If it does, it returns the lvl object
const numberingHasPStyle = (numberingData, styleName) => {
	const abstractNums = numberingData["abstractNum"];
	for (const abstractNum of abstractNums) {
		if (abstractNum["lvl"]) {
			for (const lvl of abstractNum["lvl"]) {
				if (lvl["pStyle"] && lvl["pStyle"][0]["$"]["w:val"] === styleName) {
					return lvl;
				}
			}
		}
	}
	return false;
};

const addStyleMapItemForEachParagraphStyle = (documentBody, styles, numbering, styleMap) => {
	// go through all the paragraphs and get a set of used styles
	const usedStyleIds = new Set();
	const paragraphs = documentBody["w:p"];

	for (let paragraph of paragraphs) {
		try {
			const paragraphStyleId = paragraph["w:pPr"][0]["w:pStyle"][0]["$"]["w:val"];
			usedStyleIds.add(paragraphStyleId);
		} catch {
			continue;
		}
	}

	// create a styleMap item for each paragraph style
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
			const bulletStyle = numberingHasPStyle(numbering, styleId);

			if (bulletStyle) {
				const bulletLevel = parseInt(bulletStyle["$"]["w:ilvl"]) + 1;
				const bulletType = bulletStyle["numFmt"][0]["$"]["w:val"];

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

		// create styleMap item and add it to the styleMap array
		const styleMapItem = `p[style-name='${styleName}'] => ${tag}.${slugify(styleName)}:fresh`;
		styleMap.push(styleMapItem);
	}

	return styleMap;
};

const main = async () => {
	const docxFilePath = "5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx";

	// unzip the DOCX file
	const unzippedWord = await unzipDocx(docxFilePath);

	// read the document.xml file
	const documentXMLFile = path.join(unzippedWord, "word/document.xml");
	const documentXML = await readXMLFile(documentXMLFile);
	const documentBody = documentXML["w:document"]["w:body"][0];

	// read the styles.xml file
	const stylesXMLFile = path.join(unzippedWord, "word/styles.xml");
	const stylesXML = await readXMLFile(stylesXMLFile);
	const styles = stylesXML["w:styles"]["w:style"];

	// read the numbering.xml file
	const numberingXMLFile = path.join(unzippedWord, "word/numbering.xml");
	const numberingXML = await readXMLFile(numberingXMLFile);
	const numbering = numberingXML["w:numbering"];

	let styleMap = [];

	styleMap = addStyleMapItemForEachParagraphStyle(documentBody, styles, numbering, styleMap);

	console.log(styleMap);
};

main();
