import axios from "axios";

export const server_url = "http://localhost:3000";

export async function getData(databaseFolder) {
	try {
		const response = await axios.get(`/api/${databaseFolder}`);
		const data = response.data;
		data.sort((a, b) => a.id - b.id);
		return data;
	} catch (error) {
		console.error("🔴 Error getting data:", error);
	}
}

export async function getDataById(databaseFolder, id) {
	try {
		const data = await getData(databaseFolder);
		return data.filter((item) => item.id === id)[0];
	} catch (error) {
		console.error("🔴 Error getting data by id:", error);
	}
}

export async function getThemeStylesheet(styleId) {
	try {
		const response = await axios.get(`/api/${styleId}/stylesheet`);
		return response.data;
	} catch (error) {
		console.error("🔴 Error getting theme stylesheet:", error);
	}
}

export async function getPublicationPreview(id) {
	try {
		const response = await axios.get(`/api/publication-preview`);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("🔴 Error getting publication preview:", error);
	}
}
