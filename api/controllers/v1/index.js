const { XLSXHandler: XLSX, headerMap } = require("../../util/xlsx");
const VERSION_TARGET = process.env.VERSION_TARGET;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
GET RUCA OBJECTS
.get('/') 
req.query = {
	FIPSCode,
	state,
	county,
	tractFIPSCode,
	primaryRUCACode,
	secondaryRUCACode,

	population,
	maxPopulation,
	minPopulation,

	landArea,
	minLandArea,
	maxLandArea,

	popDensity,
	minPopDensity,
	maxPopDensity,
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const getRucaObjects = async (req, res) => {
	const {
		FIPSCode,
		state,
		county,
		tractFIPSCode,
		primaryRUCACode,
		secondaryRUCACode,

		population,
		maxPopulation,
		minPopulation,

		landArea,
		minLandArea,
		maxLandArea,

		popDensity,
		minPopDensity,
		maxPopDensity,
	} = req.query;

	try {
		let filters = [];

		// Specific general.
		if (FIPSCode) filters.push(["FIPSCode", "=", FIPSCode]);
		if (state) filters.push(["state", "=", state]);
		if (county) filters.push(["county", "=", county]);
		if (tractFIPSCode) filters.push(["tractFIPSCode", "=", tractFIPSCode]);
		if (primaryRUCACode)
			filters.push(["primaryRUCACode", "=", primaryRUCACode]);
		if (secondaryRUCACode)
			filters.push(["secondaryRUCACode", "=", secondaryRUCACode]);

		// Population.
		if (population) filters.push(["population", "=", +population]);
		if (minPopulation) filters.push(["population", ">=", +minPopulation]);
		if (maxPopulation) filters.push(["population", "<=", +maxPopulation]);

		// Land area.
		if (landArea) filters.push(["landArea", "=", +landArea]);
		if (minLandArea) filters.push(["landArea", ">=", +minLandArea]);
		if (maxLandArea) filters.push(["landArea", "<=", +maxLandArea]);

		// Population density.
		if (popDensity) filters.push(["popDensity", "=", +popDensity]);
		if (minPopDensity) filters.push(["popDensity", ">=", +minPopDensity]);
		if (maxPopDensity) filters.push(["popDensity", "<=", +maxPopDensity]);

		const xlsx_res = await XLSX.get_objects(
			`./api/resources/data/${VERSION_TARGET}.xlsx`,
			null,
			filters
		);

		if (xlsx_res.error) throw xlsx_res.message;

		const { data } = xlsx_res;

		return res.status(200).json({
			data:
				data.length > 0
					? data
					: "No results found within those parameters.",
			parametersRecieved: filters
				.map((filter) => filter.join(""))
				.join("; "),
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Failed to get RUCA objects.`);
	}
};

module.exports = { getRucaObjects };
