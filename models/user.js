const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

// define validation schema for database
// model separately not so that it can be embedded, but so that it can have a method
const usersSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 5,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: Boolean,
});

usersSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("JWT-private-key")
  );
  return token;
};
const User = mongoose.model("Users", usersSchema);

function validateUser(user) {
  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().required().min(5),
    password: Joi.string().required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.usersSchema = usersSchema;
module.exports.validateUser = validateUser;
