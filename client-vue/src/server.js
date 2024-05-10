import axios from "axios";

// #region GET data from server
export async function getProcesses() {
	try {
		const response = await axios.get(`/api/processes`);
		return response.data;
	} catch (error) {
		console.error("Error getting processes:", error);
	}
}

export async function getThemes(templateName) {
	try {
		const response = await axios.get(`/api/themes`);
		if (templateName) {
			return response.data.filter((theme) => theme.template === templateName);
		}
		return response.data;
	} catch (error) {
		console.error("Error getting themes:", error);
	}
}

export async function getTheme(themeSlug) {
	try {
		const response = await axios.get(`/api/theme/${themeSlug}`);
		return response.data;
	} catch (error) {
		console.error("Error getting theme:", error);
	}
}
// #endregion

// #region POST data to server
export async function sendWordToHTmlForm(formData) {
	try {
		await axios.post("/api/word-to-html", formData);
		return "File has been uploaded";
	} catch (err) {
		console.error(err);
		return "something went wrong";
	}
}
// #endregion
