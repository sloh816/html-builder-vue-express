async function runProcess({ processFolderName, options }) {
	console.log("Running process:", processFolderName);

	const { main } = require(`./${processFolderName}/main`);

	if (processFolderName === "Word to HTML") {
        const { tempWordFilePath, document, themeFolder } = options;
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
