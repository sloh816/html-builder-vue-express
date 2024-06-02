const { readFile, writeFile, copyFile } = require("./fileSystem.js");

async function updateStyleMap(newStyleMap, themeFolder) {
	console.log({ newStyleMap, themeFolder });
	// read file
	const themeJsonFile = await readFile(`./themes/${themeFolder}/theme.json`, "json");
	const themeJsonData = JSON.parse(themeJsonFile);
	themeJsonData.styleMap = newStyleMap;

	// backup theme.json
	await copyFile(`./themes/${themeFolder}/theme.json`, `./themes/${themeFolder}/theme-backup.json`);

	// write json file
	await writeFile(`./themes/${themeFolder}/theme.json`, JSON.stringify(themeJsonData, null, 4));
}

module.exports = {
	updateStyleMap
};
