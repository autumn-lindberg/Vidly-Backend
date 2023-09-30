const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genresSearchType = "name";

// validate search type
function evaluateSearchType(queryString) {
  switch (queryString) {
    case "id":
      return "_id";
    case "name":
      return "name";
    default:
      return "name";
  }
}

// define validation schema for database
const genresDBschema = new mongoose.Schema({
  genreId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// define schema for API validation
const genresSchema = Joi.object({
  genreId: Joi.objectId().required(),
  name: Joi.string().required(),
});

module.exports.genresSchema = genresSchema;
module.exports.genresDBschema = genresDBschema;
module.exports.genresSearchType = genresSearchType;
module.exports.evaluateSearchType = evaluateSearchType;
