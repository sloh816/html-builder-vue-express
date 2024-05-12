function runProcess({ processFolderName, publicationName, tempWordFilePath }) {
	console.log("Running process:", processFolderName);

	const { main } = require(`./${processFolderName}/main`);

	if (processFolderName === "Word to HTML") {
		main(tempWordFilePath, publicationName);
	}
}

module.exports = {
	runProcess
};
