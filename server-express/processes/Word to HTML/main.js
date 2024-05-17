const { getTimestamp, slugify, formatDate, formatTime } = require("../../utils/utils.js");
const { createFolder, copyFile, writeFile, deleteFile, readFile } = require("../../utils/filesAndFolders.js");
const { writeImageFiles } = require("../../utils/writeImageFiles.js");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");

function cleanUpHtml(html) {
	console.log("🔃 Cleaning up HTML...");

	try {
		let $ = cheerio.load(html);

		// Select all <a> tags with an id that starts with '_'
		$("a[id^=_]").each((index, element) => {
			const id = $(element).attr("id");
			$(element).parent().attr("id", id); // Move the id to its parent tag
			$(element).remove();
		});

		// replace TOC links with cleaner links
		$("[id^=_]").each((index, element) => {
			const currentId = $(element).attr("id");
			const cleanId = index + "_" + slugify($(element).text().trim());
			$(`[href*=#${currentId}]`).attr("href", `#${cleanId}`);
			$(element).attr("id", cleanId);
		});

		// Select all <p> tags containing only an image
		$("p").each((index, element) => {
			if ($(element).children().length === 1 && $(element).children("img").length === 1) {
				// Unwrap the image
				$(element).children("img").unwrap();
			}
		});

		// add an aria label to the footnote back button
		$("a[href^=#footnote]").each((index, element) => {
			$(element).attr("aria-label", "Back to footnote reference");
		});

		// wrap the footnotes list in a 'section' tag and add a 'Footnotes' heading
		$("ol:has(li[id*=footnote])").each((index, element) => {
			$(element).wrap('<section id="footnotes"></section>');
		});
		$("#footnotes").prepend("<h2>Footnotes</h2>");

		// if there's a strong tag inside another strong tag, remove the second one.
		$("strong > strong").each((index, element) => {
			$(element).unwrap();
		});

		// convert table with class 'two-columns' to a two-column div layout
		$("table.two-columns").each((index, element) => {
			const table = $(element);

			const column1Contents = table.find("td:nth-child(1)").html();
			const column2Contents = table.find("td:nth-child(2)").html();

			const twoColumnDiv = $(`<div class="two-columns">`);
			twoColumnDiv.append(`<div class="column-1">${column1Contents}</div>`);
			twoColumnDiv.append(`<div class="column-2">${column2Contents}</div>`);

			table.replaceWith(twoColumnDiv);
		});

		// add classes to images from alt text:
		const pattern = /\$__(\w+)/;
		$("img").each(function () {
			var altText = $(this).attr("alt");
			var match = pattern.exec(altText);
			while (match) {
				$(this).addClass(match[1]);
				altText = altText.replace(match[0], "");
				match = pattern.exec(altText);
			}
			$(this).attr("alt", altText);
		});

		console.log("✅ HTML cleaned up.");

		// overwrite html
		return $("body").html();
	} catch (err) {
		console.error("🔴 Error cleaning up HTML:", err);
	}
}

async function writeHtmlFile({ templatePath, content, title, outputFilePath }) {
	const templateHtml = await fs.readFile(templatePath, "utf8");
	const html = templateHtml.replace("{{ content }}", content).replace("{{ title }}", title);
	await fs.writeFile(outputFilePath, html, "utf-8");
}

async function convertWordToHTml({ wordFilePath, outputFolderPath, documentName, styleMap }) {
	console.log("🔃 Converting word to html...");
	mammoth
		.convertToHtml({ path: wordFilePath }, { styleMap })
		.then(async (result) => {
			const rawHtml = result.value;

			// write image files
			let $ = cheerio.load(rawHtml);
			const imagesFolder = outputFolderPath + "/images";
			await createFolder(imagesFolder);
			let html = await writeImageFiles($, imagesFolder, slugify(documentName));

			const body = cleanUpHtml(html);

			// write html file
			const templatePath = path.resolve("themes/word-to-html_anrows-ncas/template.html");
			await writeHtmlFile({
				templatePath,
				content: body,
				title: documentName,
				outputFilePath: outputFolderPath + "/index.html"
			});
			// await writeFile(outputFolderPath + "/index.html", body);

			console.log("✅ Word converted to HTML.");
		})
		.catch((err) => {
			console.error("🔴 Error converting Word to HTML:", err);
		});
}

async function main(tempWordFilePath, document, themeFolder) {
	try {
		console.log("==== Converting Word to HTML... ====");
		console.log({ tempWordFilePath, document, themeFolder });
		const timestamp = getTimestamp();
		const documentName = document.replace(".docx", "");
		const newJobFolder = `${timestamp + "_" + slugify(documentName)}`;

		// create a job folder in the publications folder
		const newJobFolderPath = await createFolder(`publications/${newJobFolder}`);

		// create an input folder
		const inputFolderPath = await createFolder(`${newJobFolderPath}/input`);

		// copy uploaded word file from temp to job input folder
		const inputWordFilePath = await copyFile(tempWordFilePath, inputFolderPath + "/source.docx");

		// delete temp word file
		deleteFile(tempWordFilePath);

		// create an output folder
		const outputFolderPath = await createFolder(`${newJobFolderPath}/output`);

		// create a publication object
		const publicationObject = {
			name: document,
			date: formatDate(timestamp.split("_")[0]),
			time: formatTime(timestamp.split("_")[1].replace(/-/g, ":")),
			folder: newJobFolder
		};

		// write object to a info.json file
		await writeFile(`${newJobFolderPath}/info.json`, JSON.stringify(publicationObject, null, 4));

		//get styleMap from theme.json
		const themesFolder = `themes/${themeFolder}`;
		const themeJsonFile = readFile(`${themesFolder}/theme.json`, "json");
		const themeJsonData = JSON.parse(themeJsonFile);
		let styleMap = themeJsonData.styleMap;

		// add two-column table style map item
		styleMap.push("table[style-name='Two columns'] => table.two-columns:fresh");

		// convert word doc to html
		await convertWordToHTml({
			wordFilePath: inputWordFilePath,
			outputFolderPath,
			documentName,
			styleMap
		});

		// copy stylesheet from theme folder
		await copyFile(`${themesFolder}/style.css`, `${outputFolderPath}/style.css`);
	} catch (err) {
		console.error("🔴 Error converting Word to HTML:", err);
	}
}

module.exports = {
	main
};
