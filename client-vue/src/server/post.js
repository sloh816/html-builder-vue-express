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

// export async function sendEditThemeForm(formData) {
// 	try {
// 		await axios.post("/api/edit-theme", formData);
// 		return "Theme has been updated";
// 	} catch (err) {
// 		console.error(err);
// 		return "something went wrong";
// 	}
// }