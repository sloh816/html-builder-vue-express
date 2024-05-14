const { getTimestamp, slugify, formatDate, formatTime } = require("../../utils/utils.js");
const { createFolder, copyFile, writeFile, deleteFile, readFile } = require("../../utils/filesAndFolders.js");
const { writeImageFiles } = require("../../utils/writeImageFiles.js");
const mammoth = require("mammoth");
const cheerio = require("cheerio");

async function cleanUpHtml(htmlFile) {
	console.log("🔃 Cleaning up HTML...");

	try {
		let html = await readFile(htmlFile, "html");
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

		// overwrite html file
		html = $.html();
		await writeFile(htmlFile, html);
	} catch (err) {
		console.error("🔴 Error cleaning up HTML:", err);
	}
}

async function convertWordToHTml(wordFilePath, outputFolderPath, imageKey, styleMap) {
	console.log("converting word to html...");

	try {
		const mammothObject = await mammoth.convertToHtml({ path: wordFilePath }, { styleMap });
		const rawHtml = mammothObject.value;

		// write image files
		let $ = cheerio.load(rawHtml);
		const imagesFolder = outputFolderPath + "/images";
		await createFolder(imagesFolder);
		let html = await writeImageFiles($, imagesFolder, imageKey);

		// write html file
		const outputHtmlFile = await writeFile(outputFolderPath + "/index.html", html);
		await cleanUpHtml(outputHtmlFile);
	} catch (error) {
		console.error("🔴 Error converting Word to HTML:", error);
	}
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
		await deleteFile(tempWordFilePath);

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
		const themeJsonFile = await readFile(`themes/${themeFolder}/theme.json`, "json");
		const themeJsonData = JSON.parse(themeJsonFile);
		const styleMap = themeJsonData.styleMap;

		// convert word doc to html
		await convertWordToHTml(inputWordFilePath, outputFolderPath, documentName, styleMap);
	} catch (err) {
		console.error("🔴 Error converting Word to HTML:", err);
	}
}

module.exports = {
	main
};
