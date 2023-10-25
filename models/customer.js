const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// define validation schema for database
// schema is separate so it can be embedded
const customersSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  dateJoined: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
});

// model it so you can export class
const Customer = mongoose.model("Customers", customersSchema);

// define validation function for schema
function validateCustomer(customer) {
  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required().min(3),
    dateJoined: Joi.number().required(),
    phone: Joi.string().required().min(10).max(10),
    email: Joi.string().required().min(5),
    isGold: Joi.boolean().required(),
    points: Joi.number().required(),
  });
  return schema.validate(customer);
}

module.exports.validateCustomer = validateCustomer;
module.exports.Customer = Customer;
module.exports.customersSchema = customersSchema;
