// Written by Larry Hudson.

const fs = require("fs");

function writeImageFile({ base64Data, filename }) {
	fs.writeFile(filename, base64Data, "base64", function (err) {
		if (err) {
			console.log(err);
		} else {
			// console.log("Writing image file:", filename);
		}
	});
}

async function writeImageFiles($, outputFolderPath, outputImageKey = "") {
	fs.mkdir(outputFolderPath, { recursive: true }, function (err) {});

	console.log("► Writing image files...");

	$("img").each(async (index, img) => {
		var imgSrc = $(img).attr("src");
		if (imgSrc.startsWith("data:image/png")) {
			var fileExt = "png";
			var base64Data = imgSrc.replace(/^data:image\/png;base64,/, "");
		} else if (imgSrc.startsWith("data:image/jpeg")) {
			var fileExt = "jpg";
			var base64Data = imgSrc.replace(/^data:image\/jpeg;base64,/, "");
		} else {
			return null;
		}

		if (outputImageKey) {
			var filename = `${outputFolderPath}/${outputImageKey}-image${index + 1}.${fileExt}`;
			// var newDataSrc = `assets/img/image${index + 1}-500px.${srcExt}`;
			var newSrc = `images/${outputImageKey}-image${index + 1}.${fileExt}`;
		} else {
			var filename = `${outputFolderPath}/image${index + 1}.${fileExt}`;
			// var newDataSrc = `assets/img/image${index + 1}-500px.${srcExt}`;
			var newSrc = `images/image${index + 1}.${fileExt}`;
		}

		$(img).attr("src", newSrc);
		// $(img).attr("data-src", newDataSrc);
		// $(img).addClass("lazy");
		writeImageFile({ base64Data, filename });
	});

	console.log("Files written successfully:", outputFolderPath);
	return $.html();
}

module.exports = {
	writeImageFiles
};
