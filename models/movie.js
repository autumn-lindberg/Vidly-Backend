const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { genresDBschema } = require("./genre");
const moviesSearchType = "title";

// validate search type
function evaluateSearchType(queryString) {
  switch (queryString) {
    case "id":
      return "_id";
    case "title":
      return "title";
    case "stock":
      return "numberInStock";
    case "rate":
      return "dailyRentalRate";
    case "liked":
      return "liked";
    default:
      return "title";
  }
}

// define validation schema for database
const moviesDBschema = new mongoose.Schema({
  movieId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // genre belongs to collection Genres
  // reference this collection
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genres",
  },
  numberInStock: {
    type: Number,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
  publishDate: {
    type: String,
    required: true,
  },
  liked: {
    type: Boolean,
    required: true,
  },
});

// Define Schema for API validation
const moviesSchema = Joi.object({
  movieId: Joi.objectId().required(),
  title: Joi.string().required(),
  // reference to genre id (valid genre id must be passed)
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().required(),
  dailyRentalRate: Joi.number().required(),
  publishDate: Joi.string().required(),
  liked: Joi.boolean(),
});

module.exports.moviesSchema = moviesSchema;
module.exports.moviesDBschema = moviesDBschema;
module.exports.moviesSearchType = moviesSearchType;
module.exports.evaluateSearchType = evaluateSearchType;
