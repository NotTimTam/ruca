// ./api/routes/v1/index.js

const router = require(`express`).Router();

const { getRucaObjects } = require("../../controllers/v1/index");

router.route("/").get(getRucaObjects);

module.exports = router;
