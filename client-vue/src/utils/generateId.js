export default function generateId(prefix) {
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < 16; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return prefix + "-" + result;
}
