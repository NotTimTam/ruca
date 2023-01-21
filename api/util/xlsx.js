// ./util/xlsx.js

const fs = require("fs-extra");
const XLSX = require("xlsx");

const headerMap = {
	"State-County FIPS Code": "FIPSCode",
	"Select State": "state",
	"Select County": "county",
	"State-County-Tract FIPS Code (lookup by address at http://www.ffiec.gov/Geocode/)":
		"tractFIPSCode",
	"Primary RUCA Code 2010": "primaryRUCACode",
	"Secondary RUCA Code, 2010 (see errata)": "secondaryRUCACode",
	"Tract Population, 2010": "population",
	"Land Area (square miles), 2010": "landArea",
	"Population Density (per square mile), 2010": "popDensity",
};

const codeMap = {
	// Primary Codes.
	1: "Metropolitan area core: primary flow within an urbanized area (UA)",
	2: "Metropolitan area high commuting: primary flow 30% or more to a UA",
	3: "Metropolitan area low commuting: primary flow 10% to 30% to a UA",
	4: "Micropolitan area core: primary flow within an urban cluster of 10,000 to 49,999 (large UC)",
	5: "Micropolitan high commuting: primary flow 30% or more to a large UC",
	6: "Micropolitan low commuting: primary flow 10% to 30% to a large UC",
	7: "Small town core: primary flow within an urban cluster of 2,500 to 9,999 (small UC)",
	8: "Small town high commuting: primary flow 30% or more to a small UC",
	9: "Small town low commuting: primary flow 10% to 30% to a small UC",
	10: "Rural areas: primary flow to a tract outside a UA or UC",
	99: "Not coded: Census tract has zero population and no rural-urban identifier information",

	// Secondary Codes.
	1.0: "No additional code",
	1.1: "Secondary flow 30% to 50% to a larger UA",
	2.0: "No additional code",
	2.1: "Secondary flow 30% to 50% to a larger UA",
	3.0: "No additional code",
	4.0: "No additional code",
	4.1: "Secondary flow 30% to 50% to a UA",
	5.0: "No additional code",
	5.1: "Secondary flow 30% to 50% to a UA",
	6.0: "No additional code",
	7.0: "No additional code",
	7.1: "Secondary flow 30% to 50% to a UA",
	7.2: "Secondary flow 30% to 50% to a large UC",
	8.0: "No additional code",
	8.1: "Secondary flow 30% to 50% to a UA",
	8.2: "Secondary flow 30% to 50% to a large UC",
	9.0: "No additional code",
	10.0: "No additional code",
	10.1: "Secondary flow 30% to 50% to a UA",
	10.2: "Secondary flow 30% to 50% to a large UC",
	10.3: "Secondary flow 30% to 50% to a small UC",
};

class XLSXHandler {
	/**
	 * Get some objects from the sheet.
	 * @param {String} path_to_file - The path to the XLSX file to search.
	 * @param {String} sheet_label - The label of the subsheet to search in the file.
	 * @param {Array} filters - The array of filters to search by. `[ [field, modified, value] ]`
	 * ie: `[ ["population", ">", 1000] ]`
	 * @returns - An array of RUCA codes.
	 */
	static async get_objects(path_to_file, sheet_label, filters = []) {
		const workbook = XLSX.readFile(path_to_file);

		// Load correct workbook sheet.
		const workbook_data = sheet_label
			? workbook.Sheets[sheet_label]
			: workbook.Sheets[workbook.SheetNames[0]];

		// Ensure the data exists.
		if (!workbook_data) {
			if (sheet_label)
				return {
					error: true,
					message: `No sheet in file with label "${sheet_label}".`,
				};
			else
				return {
					error: true,
					message: `Failed to load sheet within .xlsx file.`,
				};
		}

		const xlData = XLSX.utils.sheet_to_json(workbook_data, { range: 1 });

		const result = xlData
			.map((object) => this.map_object(object))
			.filter((object) => {
				for (const [field, modifier = "=", value] of filters) {
					if (!object[field]) return undefined;

					switch (modifier) {
						case "=":
							if (typeof value === "string") {
								try {
									if (
										object[field].toLowerCase() !==
										value.toLowerCase()
									)
										return undefined;
								} catch (err) {
									return undefined;
								}
							} else if (object[field] !== value)
								return undefined;

							break;
						case ">=":
							if (object[field] < value) return undefined;
							break;
						case "<=":
							if (object[field] > value) return undefined;
							break;
						case "<":
							if (object[field] >= value) return undefined;
							break;
						case ">":
							if (object[field] <= value) return undefined;
							break;
						default:
							return undefined;
					}
				}

				return object;
			});

		return {
			error: false,
			data: result,
		};
	}

	static map_object(object) {
		const newObject = {};

		for (const [key, value] of Object.entries(object)) {
			const newLabel = headerMap[key];
			// if (newLabel === "county") {
			// 	newObject[newLabel || key] = value.replace(" County", "");
			// } else
			newObject[newLabel || key] = value;
		}

		// County mapping.
		newObject.county = newObject.county.replace(" County", "");

		// Code mapping.
		newObject.primaryRUCACodeExplanation =
			codeMap[newObject.primaryRUCACode];

		newObject.secondaryRUCACodeExplanation =
			codeMap[newObject.secondaryRUCACode];

		return newObject;
	}
}

module.exports = { XLSXHandler, headerMap, codeMap };
