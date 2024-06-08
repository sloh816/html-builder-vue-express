import axios from "axios";

export const server_url = "http://localhost:3000";

export async function getData(databaseFolder) {
    try {
        const response = await axios.get(`/api/${databaseFolder}`);
        return response.data;
    } catch (error) {
        console.error("🔴 Error getting data:", error);
    }
}

export async function getDataById(databaseFolder, id) {
    try {
        const data = await getData(databaseFolder)
        return data.filter( item => item.id === id )[0]
    } catch (error) {
        console.error("🔴 Error getting data by id:", error);
    }

}
