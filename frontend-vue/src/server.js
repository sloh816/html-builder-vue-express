import axios from "axios";

const config = {
	server_url: "http://localhost:3000"
};

export default async function getProcess() {
	try {
		const response = await axios.get(`${config.server_url}/api/processes`);
		return response.data.processes;
	} catch (error) {
		console.error("Error getting processes:", error);
	}
}
