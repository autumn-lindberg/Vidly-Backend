const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { validateUser, User } = require("../models/user");
// wrapper function to wrap whole callback in a try/catch block
const trycatch = require("../middleware/try-catch");
// get JWT and set headers appropriately
const auth = require("../middleware/auth");
// validate request body
const validate = require("../middleware/validate");
// check if user is admin
const admin = require("../middleware/admin");

////// CONFIGURATION SETTINGS ////////
const validateData = validateUser;
const Data = User;
const searchType = "_id";
/////////////////////////////////////

// GOOD ENDPOINTS
//    GET    /me
//    POST   /
// BAD ENDPOINTS
//    GET    /
//    PUT    /
//    DELETE /
//    GET    /:movieId
//    PUT    /:movieId
//    DELETE /:movieId
//    POST   /:movieId

router.get(
  "/me",
  auth,
  trycatch(async (request, response) => {
    // search for user in db
    const user = await Data.findOne({
      [searchType]: request.user[searchType],
    }).select("-password");
    if (!user) return response.status(404).send("Error 404: Not Found");
    // send user back without password
    return response.send(user);
  })
);

router.post("/", validate(validateUser), async (request, response) => {
  let user = request.body;

  // search for user in db
  const userInDB = await Data.findOne({
    email: user.email,
  });
  if (userInDB) return response.status(400).send("User Already Exists");

  // hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  // give them a user ID
  user._id = new mongoose.Types.ObjectId();

  const newUser = new Data(user);

  // save new user to db
  await newUser.save();

  // create token for user
  const token = newUser.generateToken();

  const userWithoutPW = _.pick(user, ["_id", "name", "email", "isAdmin"]);
  response.header("x-auth-token", token).send(userWithoutPW);
});

router.get("/", async (request, response) => {
  return response.status(400).send("Error 400: Bad Endpoint");
});
router.put("/", async (request, response) => {
  return response.status(400).send("Error 400: Bad Endpoint");
});
router.delete("/", async (request, response) => {
  return response.status(400).send("Error 400: Bad Endpoint");
});
router.put("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Bad Endpoint");
});
router.delete("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Bad Endpoint");
});
router.post("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Bad Endpoint");
});
//    GET    /
//    PUT    /
//    DELETE /
//    GET    /:movieId
//    PUT    /:movieId
//    DELETE /:movieId
//    POST   /:movieId

module.exports = router;
