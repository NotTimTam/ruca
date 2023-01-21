// ./api.js

// Create express app.
const express = require("express");
const app = express();

require("dotenv").config(); // Load .env

const PORT = process.env.PORT || 3000; // Determine host port.
const VERSION_TARGET = process.env.VERSION_TARGET || "v1";

// Middleware.
const cors = require("cors");
app.use(cors());

app.use(express.json());

try {
	// Routers
	const rucaRoutes = require(`./api/routes/${VERSION_TARGET}/index`);

	// Middleware
	const authMiddleware = require(`./api/middleware/${VERSION_TARGET}/index`);

	// Routes
	app.use(`/api/${VERSION_TARGET}/`, authMiddleware, rucaRoutes);
} catch (error) {
	console.error(
		"\nFailed to create routing. (api target value is probably invalid)\n\nError printout:\n",
		error,
		"\n"
	);

	process.exit();
}

// Start app.
app.listen(PORT, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log(
			`RUCA Deployment | Server listening on PORT=${PORT} using API=${VERSION_TARGET}.`
		);
	}
});
