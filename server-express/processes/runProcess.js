function runProcess({ processFolderName, document, tempWordFilePath, themeFolder }) {
	console.log("Running process:", processFolderName);

	const { main } = require(`./${processFolderName}/main`);

	if (processFolderName === "Word to HTML") {
		main(tempWordFilePath, document, themeFolder);
	}
}

module.exports = {
	runProcess
};
