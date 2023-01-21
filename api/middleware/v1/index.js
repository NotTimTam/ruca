const authMiddleware = (req, res, next) => {
	try {
		req.now = Date.now();

		next();
	} catch (error) {
		console.error(error);
		return res.status(401).send("Unknown authentication error.");
	}
};

module.exports = authMiddleware;
