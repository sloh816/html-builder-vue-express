import axios from "axios";

const config = {
	server_url: "http://localhost:3000"
};

export default async function getProcesses() {
	try {
		const response = await axios.get(`${config.server_url}/api/processes`);
		return response.data;
	} catch (error) {
		console.error("Error getting processes:", error);
	}
}
