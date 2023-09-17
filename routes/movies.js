const Joi = require("joi");
const express = require("express");
const router = express.Router();

// import genres and movies arrays
const { movies } = require("../fakeMovieService");

// Define Schema
const moviesSchema = Joi.object({
  _id: Joi.string().required(),
  title: Joi.string().required(),
  genre: {
    _id: Joi.string().required(),
    name: Joi.string().required(),
  },
  numberInStock: Joi.number().required(),
  dailyRentalRate: Joi.number().required(),
  publishDate: Joi.string().required(),
  liked: Joi.boolean(),
});

let dataSet = movies;
let searchType = "title";
let schema = moviesSchema;
const apiEndpoint = "movies";

// validate data using joi
function validateData(data, schema) {
  if (
    !data ||
    !schema ||
    Object.keys(data) === 0 ||
    Object.keys(schema) === 0
  ) {
    return null;
  }
  return schema.validate(data);
}

// get entire dataset
router.get("/", (request, response) => {
  return response.send(movies);
});

// get individual entry
router.get("/:entry", (request, response) => {
  const { entry } = request.params;

  // if dataset not found or search prop not found, return 404
  if (!dataSet || !searchType)
    return response
      .status(404)
      .send(`Error 404: ${apiEndpoint}/${entry} Not Found`);

  // otherwise assume dataset is valid. search it.
  // search through dataset array to find if something matches
  const data = dataSet.find((data) => {
    return data[searchType] === entry;
  });

  // if data set is valid but entry is not found
  if (!data)
    return response
      .status(404)
      .send(`Error 404: ${apiEndpoint}/${entry} Not Found`);
  // send data!
  else response.send(data);
});

// generic post to dataset
router.post("/", (request, response) => {
  const data = request.body;

  // If data set is not found
  if (!schema || !dataSet)
    return response.status(404).send(`Error 404: ${apiEndpoint} Not Found`);

  // otherwise assume good endpoint. validate data.
  const result = validateData(data, schema);

  // otherwise assume good data
  const { error } = result;
  if (error) return response.status(400).send(error.details[0].message);

  // contact database and POST updated array
  dataSet.push(data);

  // send data back
  response.send(data);
});

// bad API call
router.post("/:entry", (request, response) => {
  response.status(404).send("Error 404: Path Provided Is Longer Than Expected");
});

router.put("/", (request, response) => {
  const data = request.body;

  // otherwise assume good endpoint. validate data.
  const result = validateData(data, schema);

  // otherwise assume good data
  const { error } = result;
  if (error) return response.status(400).send(error.details[0].message);

  // find data in dataset
  const foundData = dataSet.find((item) => {
    return item[searchType] === data[searchType];
  });
  if (!foundData) return response.send(`Error 404: ${searchType} not found.`);

  // set properties to those found in body of request
  Object.keys(foundData).forEach((prop) => {
    foundData[prop] = data[prop];
  });

  // contact database and POST updated array

  // send object back
  response.send(data);
});

// bad API call
router.put("/:entry", (request, response) => {
  response.status(404).send("Error 404: Path Provided Is Longer Than Expected");
});

router.delete("/:entry", (request, response) => {
  const { entry } = request.params;
  const sentData = request.body;

  // if data set is not found
  if (!apiEndpoint || !dataSet || !searchType || !schema)
    response.status(404).send(`Error 404: ${apiEndpoint}/${entry} Not Found`);

  // otherwise assume good endpoint. validate data.
  const result = validateData(sentData, schema);

  // otherwise assume good data
  const { error } = result;
  if (error) return response.status(400).send(error.details[0].message);

  // find data in dataset
  const data = dataSet.find((data) => {
    return data[searchType] === sentData[searchType];
  });
  if (!data)
    return response.status(404).send(`Error 404: ${searchType} not found.`);

  // contact database and POST updated array
  const index = dataSet.indexOf(data);
  dataSet.splice(index, 1);

  // send data back
  response.send(data);
});

// bad API call
router.delete("/api/:apiEndpoint", (request, response) => {
  return response
    .status(404)
    .send(`Error 404: Data Set Found, But Entry Is Missing`);
});

module.exports = router;
