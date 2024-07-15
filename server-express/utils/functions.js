function slugify(string) {
	return string
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function getTimestamp() {
	const now = new Date();
	const options = {
		timeZone: "Australia/Melbourne",
		hour12: false, // Use 24-hour format
		year: "numeric",
		month: "2-digit", // Zero-padded month (01-12)
		day: "2-digit", // Zero-padded day (01-31)
		hour: "2-digit", // Zero-padded hour (00-23)
		minute: "2-digit", // Zero-padded minute (00-59)
		second: "2-digit"
	};

	const date = now.toLocaleDateString("en-AU", options).split(", ")[0];
	const time = now.toLocaleTimeString("en-AU", options).split(", ")[1].replaceAll(":", "-");

	const dateArray = date.split("/");
	const formattedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`; // YYYY-MM-DD

	const timestamp = `${formattedDate}_${time}`;
	return timestamp;
}

function formatDate(inputDate) {
	// Create a Date object from the input date string
	const date = new Date(inputDate);

	// Get day of the month
	const day = date.getDate();

	// Get month name
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const monthIndex = date.getMonth();
	const monthName = monthNames[monthIndex];

	// Get year
	const year = date.getFullYear();

	// Format the date as "Month, Year"
	const formattedDate = `${day} ${monthName}, ${year}`;

	return formattedDate;
}

function formatTime(inputTime) {
	// Parse the input time string
	const [hours, minutes, seconds] = inputTime.split(":").map(Number);

	// Determine if it's AM or PM
	const period = hours >= 12 ? "PM" : "AM";

	// Convert hours to 12-hour format
	let formattedHours = hours % 12;
	formattedHours = formattedHours === 0 ? 12 : formattedHours;

	// Format the time
	const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;

	return formattedTime;
}

function generateId(prefix) {
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < 16; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return prefix + "-" + result;
}

// function that repeats string n times
function repeatString(string, n) {
	if (n <= 0) {
		return "";
	}
	return Array(n).fill(string).join(" ");
}

function emuToPixels(emu) {
	return Math.floor(emu / 9525, 1);
}

module.exports = {
	slugify,
	getTimestamp,
	formatDate,
	formatTime,
	generateId,
	repeatString,
	emuToPixels
};
