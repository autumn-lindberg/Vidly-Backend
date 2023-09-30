const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {
  customersSearchType,
  customersSchema,
  customersDBschema,
  evaluateSearchType,
} = require("../models/customer");

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

////// CONFIGURATION SETTINGS ////////
const apiEndpoint = "customers";
let searchType = customersSearchType;
let schema = customersSchema;
let db_schema = customersDBschema;
let collection = "Customers";
/////////////////////////////////////

// create model for DB schema
const Data = mongoose.model(collection, db_schema);

// get entire dataset
router.get("/", async (request, response) => {
  try {
    // contact database
    const dataset = await Data.find();
    // send data back to client
    return response.send(dataset);
  } catch (exception) {
    console.log("Exception: ", exception);
    response.status(400).send("error");
  }
});

// get individual entry
router.get("/:entry", async (request, response) => {
  const { entry } = request.params;
  const { searchBy } = request.query;
  searchType = evaluateSearchType(searchBy);

  try {
    // contact datbase and look for entry
    const data = await Data.findOne({
      [searchType]: entry,
    });
  } catch (exception) {
    console.log("Exception: ", exception);
    response.status(400).send("error");
  }

  // if data set is valid but entry is not found
  if (!data || data.length === 0)
    return response
      .status(404)
      .send(`Error 404: ${apiEndpoint}/${entry} Not Found`);
  // send data!
  else response.send(data);
});

// generic post to dataset
router.post("/", async (request, response) => {
  const body = request.body;

  // validate data.
  const result = validateData(body, schema);
  // see if error was returned
  const { error } = result;
  if (error) return response.status(400).send(error.details[0].message);

  // create new object to send to DB
  const data = new Data(body);

  try {
    // sned data to DB
    const answer = await data.save();
  } catch (exception) {
    console.log("Exception: ", exception);
    response.status(400).send("error");
  }

  // send data back
  response.send(data);
});

// bad API call
router.post("/:entry", (request, response) => {
  response.status(404).send("Error 404: Path Provided Is Longer Than Expected");
});

router.put("/", async (request, response) => {
  const data = request.body;
  const { searchBy } = request.query;
  searchType = evaluateSearchType(searchBy);

  // validate data.
  const result = validateData(data, schema);
  // see if error was returned
  const { error } = result;
  if (error) return response.status(400).send(error.details[0].message);

  try {
    // try to contact DB
    const foundData = await Data.findOne({
      [searchType]: data[searchType],
    });
    if (!foundData) return response.send(`Error 404: ${searchType} not found.`);
  } catch (exception) {
    console.log("Exception: ", exception);
    response.status(400).send("error");
  }

  // set properties to those found in body of request
  Object.keys(foundData.toObject()).forEach((prop) => {
    // only set property if it was defined in body
    if (data[prop]) {
      foundData[prop] = data[prop];
    }
  });

  try {
    // contact DB to update item
    const answer = await foundData.save();
  } catch (exception) {
    console.log("Exception: ", exception);
    response.status(400).send("error");
  }

  // send original object back
  response.send(data);
});

// bad API call
router.put("/:entry", (request, response) => {
  response.status(404).send("Error 404: Path Provided Is Longer Than Expected");
});

router.delete("/:entry", async (request, response) => {
  const { entry } = request.params;
  const { searchBy } = request.query;
  searchType = evaluateSearchType(searchBy);

  // if data set is not found
  if (!apiEndpoint)
    response.status(404).send(`Error 404: ${apiEndpoint}/${entry} Not Found`);

  try {
    // search data, grab a copy if found
    const data = await Data.findOne({
      [searchType]: entry,
    });
    // send 404 if not found
    if (!data) {
      return response.status(404).send(`Error 404: ${searchType} not found.`);
    }

    // contact database and POST updated array
    const answer = await Data.deleteOne({
      [searchType]: entry,
    });
  } catch (exception) {
    console.log("Exception: ", exception);
    response.status(400).send("error");
  }

  // send data back
  response.send(data);
});

// bad API call
router.delete("/", (request, response) => {
  return response
    .status(404)
    .send(`Error 404: Data Set Found, But Entry Is Missing`);
});

module.exports = router;
