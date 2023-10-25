const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// define validation schema for database
// schema defined separately so it can be embedded
const genresSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
});
// model so that you can export a class
const Genre = mongoose.model("Genres", genresSchema);

// define validation function for schema
function validateGenre(genre) {
  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required().min(3),
  });
  return schema.validate(genre);
}

exports.validateGenre = validateGenre;
module.exports.Genre = Genre;
module.exports.genresSchema = genresSchema;
