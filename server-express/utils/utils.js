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

	const timestamp = now.toLocaleString("en-AU", options).replaceAll("/", "-").replaceAll(":", "-").replace(", ", "_");
	return timestamp;
}

module.exports = {
	slugify,
	getTimestamp
};
