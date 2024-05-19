async function runProcess({ processFolderName, document, tempWordFilePath, themeFolder }) {
	console.log("Running process:", processFolderName);

	const { main } = require(`./${processFolderName}/main`);

	if (processFolderName === "Word to HTML") {
		try {
			await main(tempWordFilePath, document, themeFolder);
		} catch (error) {
			console.error("🔴 Error running process:", error);
		}
	}
}

module.exports = {
	runProcess
};
