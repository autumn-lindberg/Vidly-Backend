const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const customersSearchType = "name";

// validate search type
function evaluateSearchType(queryString) {
  switch (queryString) {
    case "id":
      return "_id";
    case "name":
      return "name";
    case "joined":
      return "dateJoined";
    default:
      return "name";
  }
}

// define validation schema for database
const customersDBschema = new mongoose.Schema({
  customerId: {
    type: mongoose.Types.ObjectId,
    requird: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    required: true,
  },
});

// define schema for API validation
const customersSchema = Joi.object({
  customerId: Joi.objectId().required(),
  name: Joi.string().required(),
  dateJoined: Joi.date().required(),
});

module.exports.customersSchema = customersSchema;
module.exports.customersDBschema = customersDBschema;
module.exports.customersSearchType = customersSearchType;
module.exports.evaluateSearchType = evaluateSearchType;
