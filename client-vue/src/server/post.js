import axios from "axios";

export async function sendWordToHtmlForm(formData) {
	try {
		const response = await axios.post("/api/word-to-html", formData);
		return response.data.success;
	} catch (err) {
		console.error(err);
		return "something went wrong";
	}
}

export async function sendThemeForm(themeData) {
	try {
		await axios.post("/api/handle-theme", themeData);
	} catch (err) {
		console.error(err);
		return "something went wrong";
	}
}
