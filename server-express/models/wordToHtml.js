const { getTimestamp, slugify, formatDate, formatTime } = require("../utils/functions");
const { createFolder, copyFile, deleteFile, writeFile, readFile } = require("../utils/fileSystem");
const { writeImageFiles } = require("../utils/writeImageFiles.js");
const { writeHtmlFile } = require("../utils/writeHtmlFile.js");
const Publication = require("./publication");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const WordDocument = require("./wordDocument.js");

class WordToHtml {
	constructor(tempWordFilePath, wordFile) {
		this.name = "Word to HTML";
		this.slug = "word-to-html";
		this.tempWordFilePath = tempWordFilePath;
		this.wordFile = wordFile;
		this.print();
	}

	print() {
		console.log("⬜ Word to HTML object created !");
		console.log({ name: this.name, slug: this.slug, tempWordFilePath: this.tempWordFilePath, wordFile: this.wordFile });
	}

	getName() {
		return this.name;
	}

	async runProcess() {
		console.log("🟡 Running process:", this.name);
		const wordFileName = this.wordFile.replace(".docx", "");

		const publication = new Publication(this.tempWordFilePath, wordFileName);
		await publication.createPublicationFolder();

		// unzip the input word doc
		const inputWordDoc = new WordDocument(publication.inputWordFilePath);
		const unzippedWordFolder = await inputWordDoc.unzip();

		// create the styleMap
		const styleMap = await inputWordDoc.getStyleMap(unzippedWordFolder);

		// convert word doc to html files
		await this.convertWordToHtml({
			wordFilePath: publication.inputWordFilePath,
			outputFolderPath: publication.outputFolderPath,
			wordFileName,
			styleMap
		});

		const css = await inputWordDoc.getCssCode(unzippedWordFolder);

		// create style.css file
		await writeFile(`${publication.outputFolderPath}/style.css`, css);

		// // copy stylesheet from theme folder
		// await this.theme.copyStylesheet(outputFolderPath);

		console.log("🟣 Run process: Word to HTML successful!");
	}

	convertWordToHtml({ wordFilePath, outputFolderPath, wordFileName, styleMap }) {
		console.log("🟠 Converting Word Doc to HTML Files");

		return new Promise((resolve) => {
			mammoth
				.convertToHtml({ path: wordFilePath }, { styleMap })
				.then(async (result) => {
					let html = result.value;

					// write image files
					let $ = cheerio.load(html);
					const imagesFolder = await createFolder(outputFolderPath + "/images");
					html = await writeImageFiles($, imagesFolder, slugify(wordFileName));

					// clean up HTML
					const body = await this.cleanUpHtml(html);

					// write html file
					const templatePath = "db/processes/word-to-html/single.html";
					await writeHtmlFile({
						templateFilePath: templatePath,
						data: {
							content: body,
							title: wordFileName
						},
						outputFilePath: outputFolderPath + "/index.html"
					});

					// copy the template css file
					const templateCssPath = "db/processes/word-to-html/template-style.css";
					await copyFile(templateCssPath, outputFolderPath + "/template-style.css");

					console.log("🔶 Successfully converted Word Doc to HTML Files");
					resolve();
				})
				.catch((err) => {
					console.error("🔴 Error converting Word to HTML:", err);
				});
		});
	}

	async cleanUpHtml(html) {
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

			// return clean html
			return $("body").html();
		} catch (err) {
			console.error("🔴 Error cleaning up HTML:", err);
		}
	}
}

module.exports = WordToHtml;
