const express = require("express");
// import genres and movies arrays
const { genres } = require("./fakeGenreService");
const { movies } = require("./fakeMovieService");
const Joi = require("joi");
const app = express();

// ENDPOINTS
// /api/data
// /api/data/genres
// /api/data/genres/name
// /api/data/movies
// /api/data/movies/title

// enable JSON parsing in body of request
app.use(express.json());

let dataSet;
let searchType;
let schema;

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

// Define Schemas

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
const genresSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
});

app.get("/api", (request, response) => {
  response.send("Hello and welcome to my API!");
});

// get entire dataset
app.get("/api/:apiEndpoint", (request, response) => {
  const { apiEndpoint } = request.params;

  //// NEW ENTRY: USE THIS CHUNK ///
  if (apiEndpoint === "genres") {
    // contact database and get genres (array)

    //respond to request
    return response.send(genres);
  }
  //////////////////////////////////

  if (apiEndpoint === "movies") {
    // contact database and get movies (array)

    //respond to request
    return response.send(movies);
  }
  // If not found, send not found error
  return response.status(404).send(`Error 404: ${apiEndpoint} Not Found`);
});

// get individual entry
app.get("/api/:apiEndpoint/:entry", (request, response) => {
  const { apiEndpoint, entry } = request.params;

  //// NEW ENTRY: USE THIS CHUNK ///
  if (apiEndpoint === "genres") {
    // contact database and get genres (array)

    dataSet = genres;
    searchType = "name";
  }
  /////////////////////////////////

  if (apiEndpoint === "movies") {
    // contact database and get movies (array)

    dataSet = movies;
    searchType = "title";
  }

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
app.post("/api/:apiEndpoint", (request, response) => {
  const { apiEndpoint } = request.params;
  const data = request.body;

  //// NEW ENTRY: USE THIS CHUNK ///
  if (apiEndpoint === "movies") {
    schema = moviesSchema;
    dataSet = movies;
  }
  //////////////////////////////////

  if (apiEndpoint === "genres") {
    schema = genresSchema;
    dataSet = genres;
  }
  // If data set is not found
  if (!schema || !dataSet)
    return response.status(404).send(`Error 404: ${apiEndpoint} Not Found`);

  // otherwise assume good endpoint. validate data.
  const result = validateData(data, schema);
  if (!result) return response.status(400).send("Error 400 Bad Request");

  // otherwise assume good data
  const { error } = result;
  if (error) return response.status(400).send(error.details[0].message);

  // contact database and POST updated array
  dataSet.push(data);

  // send data back
  response.send(data);
});

// bad API call
app.post("/api/:apiEndpoint/:entry", (request, response) => {
  response.status(404).send("Error 404: Path Provided Is Longer Than Expected");
});

app.put("/api/:apiEndpoint", (request, response) => {
  const { apiEndpoint } = request.params;
  const data = request.body;
  if (apiEndpoint === "movies") {
    schema = moviesSchema;
    dataSet = movies;
    searchType = "title";
  }
  if (apiEndpoint === "genres") {
    schema = genresSchema;
    dataSet = genres;
    searchType = "name";
  }

  // if data set is not found
  if (!schema || !dataSet || !searchType)
    return response.status(404).send(`Error 404: ${apiEndpoint} Not Found`);

  console.log(data);
  // otherwise assume good endpoint. validate data
  const result = validateData(data, schema);
  if (!result) return response.status(400).send("Error 400 Bad Request");

  // find data in dataset
  const foundData = dataSet.find((item) => {
    return item[searchType] === data[searchType];
  });
  if (!foundData) return response.send(`Error 404: ${searchType} not found.`);

  // set properties to those found in body of request
  Object.keys(foundData).forEach((prop) => {
    foundData[prop] = body[prop];
  });

  // contact database and POST updated array

  // send object back
  response.send(data);
});

// bad API call
app.put("/api/:apiEndpoint/:entry", (request, response) => {
  response.status(404).send("Error 404: Path Provided Is Longer Than Expected");
});

app.delete("/api/:apiEndpoint/:entry", (request, response) => {
  const { apiEndpoint, entry } = request.params;

  if (apiEndpoint === "movies") {
    schema = moviesSchema;
    dataSet = movies;
    searchType = "title";
  }
  if (apiEndpoint === "genres") {
    schema = genresSchema;
    dataSet = genres;
    searchType = "name";
  }

  // if data set is not found
  if (!apiEndpoint || !dataSet || !searchType || !schema)
    response.status(404).send(`Error 404: ${apiEndpoint}/${entry} Not Found`);

  // find data in dataset
  const data = dataSet.find((data) => {
    return data[searchType] === entry;
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
app.delete("/api/:apiEndpoint", (request, response) => {
  return response
    .status(404)
    .send(`Error 404: Data Set Found, But Entry Is Missing`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
