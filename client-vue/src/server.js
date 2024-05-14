import axios from "axios";

export const server_url = "http://localhost:3000";

// #region GET data from server
export async function getProcesses() {
	try {
		const response = await axios.get(`/api/processes`);
		return response.data;
	} catch (error) {
		console.error("Error getting processes:", error);
	}
}

export async function getPublications() {
	try {
		const response = await axios.get(`/api/publications`);
		return response.data;
	} catch (error) {
		console.error("🔴 Error getting publications:", error);
	}
}

export async function getPublicationData(publicationFolder) {
	try {
		const response = await axios.get(`/api/publications`);
		return response.data.filter((publication) => publication.folder === publicationFolder)[0];
	} catch (err) {
		console.error("🔴 Error getting publication data:", err);
	}
}

export async function getThemesData(templateName) {
	try {
		const response = await axios.get(`/api/themes`);

		if (templateName) {
			return response.data.filter((theme) => theme.template === templateName);
		}

		return response.data;
	} catch (error) {
		console.error("🔴 Error getting themes:", error);
	}
}

export async function getThemeData(themeSlug) {
	try {
		const response = await axios.get(`/api/themes`);
		return response.data.filter((theme) => theme.slug === themeSlug)[0];
	} catch (error) {
		console.error("🔴 Error getting themes:", error);
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

export async function sendEditThemeForm(formData) {
	try {
		await axios.post("/api/edit-theme", formData);
		return "Theme has been updated";
	} catch (err) {
		console.error(err);
		return "something went wrong";
	}
}
// #endregion
