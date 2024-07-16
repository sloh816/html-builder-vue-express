const { slugify, emuToPixels } = require("../utils/functions");
const { createFolder, copyFile, writeFile, readFile } = require("../utils/fileSystem");
const { writeHtmlFile } = require("../utils/writeHtmlFile.js");
const { readDocument } = require("../utils/unzipDocx");
const Publication = require("./publication");
const WordDocument = require("./wordDocument.js");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

class WordToHtml {
	constructor(publication) {
		this.name = "Word to HTML";
		this.slug = "word-to-html";
		this.publication = publication;
		this.print();
	}

	print() {
		console.log("⬜ Word to HTML object created !");
		console.log({ name: this.name, slug: this.slug, publication: this.publication.id });
	}

	getName() {
		return this.name;
	}

	async runProcess() {
		console.log("🟡 Running process:", this.name);
		const publication = this.publication;
		const wordFileName = publication.wordFileName;

		// unzip the input word doc
		const wordFilePath = `${publication.folder}/input/source.docx`;
		const inputWordDoc = new WordDocument(wordFilePath);
		const unzippedWordFolder = await inputWordDoc.unzip();

		// create the styleMap
		const styleMap = await inputWordDoc.getStyleMap(unzippedWordFolder);

		const outputFolderPath = `${publication.folder}/output`;

		// convert word doc to html files
		await this.convertWordToHtml({
			wordFilePath,
			outputFolderPath,
			wordFileName,
			styleMap,
			unzippedWordFolder
		});

		const css = await inputWordDoc.getCssCode(unzippedWordFolder);

		// create style.css file
		await writeFile(`${outputFolderPath}/style.css`, css);

		// // copy stylesheet from theme folder
		// await this.theme.copyStylesheet(outputFolderPath);

		console.log("🟣 Run process: Word to HTML successful!");
	}

	async convertWordToHtml({ wordFilePath, outputFolderPath, wordFileName, styleMap, unzippedWordFolder }) {
		console.log("🟠 Converting Word Doc to HTML Files");

		// create images folder
		const imagesFolderPath = `${outputFolderPath}/images`;
		await createFolder(imagesFolderPath);

		return new Promise((resolve) => {
			let imageCounter = 0;
			mammoth
				.convertToHtml(
					{
						path: wordFilePath
					},
					{
						styleMap: styleMap,
						convertImage: mammoth.images.imgElement(async (image) => {
							console.log("🔃 Writing image files...");
							const imageBuffer = await image.read();
							const imageExt = image.contentType.split("/").pop();
							const imagesFolderName = "images";

							const imageFilename = `${slugify(wordFileName)}-image${imageCounter}.${imageExt}`;

							await fs.promises.writeFile(path.join(outputFolderPath, imagesFolderName, imageFilename), imageBuffer, { encoding: "base64" });

							console.log("Finished writing", path.join(imagesFolderName, imageFilename));

							imageCounter++;

							return {
								src: `${imagesFolderName}/${imageFilename}`
							};
						})
					}
				)
				.then(async (result) => {
					let html = result.value;

					// clean up HTML
					html = await this.cleanUpHtml(html, unzippedWordFolder);

					// write html file
					const templatePath = "db/processes/word-to-html/single.html";
					await writeHtmlFile({
						templateFilePath: templatePath,
						data: {
							content: html,
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

	async cleanUpHtml(html, unzippedWordFolder) {
		console.log("🔃 Cleaning up HTML...");

		try {
			let $ = cheerio.load(html);

			// add image sizes
			const imageSizes = await this.getImageSizes(unzippedWordFolder);
			$("img").each((index, img) => {
				const imageSize = imageSizes[index];

				$(img).attr("width", imageSize.width);
				$(img).attr("height", imageSize.height);
			});

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

			// if table class name contains the word, 'layout' then convert the table into divs
			$("table[class*='layout']").each((index, element) => {
				const table = $(element);
				const className = table.attr("class");

				const div = $(`<div class="${className}">`);

				// for each row, we create a div
				table.find("tr").each((index, row) => {
					const rowDiv = $("<div>");

					// for each cell, we create a div and append the cell's content
					$(row)
						.find("td")
						.each((index, cell) => {
							const cellDiv = $("<div>");
							cellDiv.append($(cell).html());
							rowDiv.append(cellDiv);
						});

					div.append(rowDiv);
				});

				table.replaceWith(div);
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

	async getImageSizes(unzippedFolderPath) {
		try {
			// const xmlData = await readDocument(unzippedFolderPath);
			const documentXML = await readFile(`${unzippedFolderPath}/word/document.xml`, "utf8");

			const $ = cheerio.load(documentXML);

			const imageSizes = [];

			$("w\\:drawing").each((index, drawing) => {
				const inline = $(drawing).find("wp\\:inline wp\\:extent");

				// checks if the image is inline
				if (inline.length > 0) {
					const width = parseInt(inline.attr("cx"));
					const height = parseInt(inline.attr("cy"));

					imageSizes.push({
						width: emuToPixels(width),
						height: emuToPixels(height)
					});
				} else {
					console.log("❌ Error: There are images that are not inline.");
				}
			});
			return imageSizes;
		} catch (err) {
			console.error("Error:", err);
			throw err;
		}
	}
}

module.exports = WordToHtml;
