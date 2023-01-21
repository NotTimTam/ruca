# ruca.js API v1

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

An open-source, self-deployable express API.

For more information on RUCA codes, visit [this site](https://www.ers.usda.gov/data-products/rural-urban-commuting-area-codes/documentation/).

## Setup

Necessary `.env` parameters:

-   `PORT`
    -   This is the port the API will be hosted on. If one is not provided, it defaults to `3000`.
-   `VERSION_TARGET`
    -   The version of the API you would like to use. The only available version is `v1`, which is also the default.
-   `REQUEST_LIMIT`
    -   The number of requests per 1 hour that an API client can make. (default `1000`)

Example:

```
PORT=8000
VERSION_TARGET=v1
REQUEST_LIMIT=1000
```

Make sure to run `npm i` to install all the necessary dependencies beforehand.

## Running the API

The API can be started by using `NODE.js` to run the `api.js` file in the root of the directory. There are also two `NPM Scripts`, `start` and `dev` which will do this. `dev` runs the API through the NPM package called [Nodemon](https://www.npmjs.com/package/nodemon).

## Documentation

### GET `RUCA OBJECTS`

-   Method: **`GET`**
-   Route: `<host>/api/v1/`
-   Query Parameters:

    -   All query parameters are **optional**, providing none will **return a list of all the data**.
    -   `FIPSCode`
        -   The [FIPS code](https://en.wikipedia.org/wiki/FIPS_county_code) to filter under.
    -   `state`
        -   The 2-letter state abbreviation to filter by. (ie., `AZ`) _(case-insensitive)_
    -   `county`
        -   The name of the county to filter by. _(case-insensitive)_
    -   `tractFIPSCode`
        -   The [state-county-tract FIPS code](http://www.ffiec.gov/Geocode/) to filter by.
    -   `primaryRUCACode`
        -   The primary RUCA code to filter by.
    -   `secondaryRUCACode`
        -   The secondary RUCA code to filter by.
    -   `population`
        -   The exact population number to filter by.
    -   `minPopulation`
        -   A minimum value on the population, showing only those that are greater than, or equal to the provided number.
    -   `maxPopulation`
        -   A cap on the maximum population, showing only those that are less than, or equal to the provided number.
    -   `landArea`
        -   The exact land area (**in square miles**) to filter by.
    -   `minLandArea`
        -   A cap on the maximum land area (**sq. mi**), showing only those that are greater than, or equal to the provided number.
    -   `maxLandArea`
        -   A minimum value on the land area (**sq. mi**), showing only those that are less than, or equal to the provided number.
    -   `popDensity`
        -   The exact population density (**per sq. mi**) to filter by.
    -   `minPopDensity`
        -   A cap on the maximum population density (**per sq. mi**), showing only those that are greater than, or equal to the provided number.
    -   `maxPopDensity`
        -   A minimum value on the population density (**per sq. mi**), showing only those that are less than, or equal to the provided number.

Example:

```javascript
axios.get(
	"http://localhost:3000/api/v1/?state=AZ&PrimaryRUCACode=2&minPopulation=1500"
);
```

Learn more about Axios, an excellent HTTP client request tool, [here](https://www.npmjs.com/package/axios).
