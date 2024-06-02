import axios from "axios";

export const server_url = "http://localhost:3000";

export async function getProcesses() {
	try {
		const response = await axios.get(`/api/processes`);
		return response.data;
	} catch (error) {
		console.error("🔴 Error getting processes:", error);
	}
}

export async function getThemes() {
    try {
        const response = await axios.get(`/api/themes`);
        return response.data;
    } catch {
        console.error("🔴 Error getting themes:", error);
    }
}

export async function getThemeInfo(folder) {
    try {
        const themes = await getThemes();
        return themes.filter( theme => theme.folder === folder )[0]
    } catch (error) {
        console.error("🔴 Error getting theme info:", error);
    }
}

export async function getPublications() {
    try {
        const response = await axios.get(`/api/publications`);
        return response.data;
    } catch {
        console.error("🔴 Error getting publications:", error);
    }
}
