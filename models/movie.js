const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { genresSchema } = require("./genre");

// define validation schema for database
// schema is separate so that it can be embedded
const moviesSchema = new mongoose.Schema({
  _id: String,
  title: {
    type: String,
    required: true,
  },
  // embed the genres schema (updates to genre not preserved)
  // genre name will never change, so it doesn't need to be referenced
  genre: {
    type: genresSchema,
    required: true,
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
    type: Date,
  },
  liked: {
    type: Boolean,
    required: true,
  },
});

// model so class can be exported
const Movie = mongoose.model("Movies", moviesSchema);

// Define Schema for API validation
function validateMovie(movie) {
  const schema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required().min(3),
    // this validation works for both references and embedding
    genre: Joi.object().keys({
      _id: Joi.string(),
      name: Joi.string(),
    }),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
    publishDate: Joi.string(),
    liked: Joi.boolean(),
  });
  return schema.validate(movie);
}

module.exports.validateMovie = validateMovie;
module.exports.moviesSchema = moviesSchema;
module.exports.Movie = Movie;
