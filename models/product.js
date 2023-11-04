const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// define validation schema for database
// schema defined separately so it can be embedded
const productsSchema = new mongoose.Schema({
  _id: String,
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
  },
  imageSrc: {
    type: String,
  },
});
// model so that you can export a class
const Product = mongoose.model("Products", productsSchema);

// define validation function for schema
function validateProduct(product) {
  const schema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required().min(3),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    description: Joi.string().required().min(5),
    imageSrc: Joi.string(),
  });
  return schema.validate(product);
}

exports.validateProduct = validateProduct;
module.exports.Product = Product;
module.exports.productsSchema = productsSchema;
