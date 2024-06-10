const pm2 = require("pm2");

const serverName = "html-builder-express";

function restartServer() {
	console.log("🟡 Restarting server...");
	pm2.connect((error) => {
		if (error) {
			console.error("❌ PM2 connection error", error);
			return;
		}

		pm2.restart(serverName),
			(restartErr) => {
				pm2.disconnect();
				if (restartErr) {
					console.error("❌ PM2 restart error", restartErr);
				} else {
					console.log("🟢 PM2 restart successful");
				}
			};
	});
}

module.exports = {
	restartServer
};
