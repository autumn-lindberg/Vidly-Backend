const mongoose = require("mongoose");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const trycatch = require("../middleware/try-catch");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");

// config settings
const searchType = "email";
const Data = User;
//

const validateLogin = function (body) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(body);
};

router.post(
  "/",
  validate(validateLogin),
  trycatch(async (request, response) => {
    let data = request.body;

    let user = await Data.findOne({
      [searchType]: data[searchType],
    });

    if (!user) return response.status(400).send("Error 400: Bad Data");

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return response.status(400).send("Error 400: Bad Data");

    // create a new user so that it has access to generateToken() ?
    const token = user.generateToken();
    const userWithoutPW = _.pick(user, ["_id", "name", "email", "isAdmin"]);

    response.header("x-auth-token", token).send(userWithoutPW);
  })
);

module.exports = router;
