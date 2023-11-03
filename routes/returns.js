const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { validateRental, Rental } = require("../models/rental");
const { validateCustomer, Customer } = require("../models/customer");
const { validateMovie, Movie } = require("../models/movie");
const Fawn = require("fawn");
// wrapper function to wrap whole callback in a try/catch block
const trycatch = require("../middleware/try-catch");
// get JWT and set headers appropriately
const auth = require("../middleware/auth");
// validate request body
const validate = require("../middleware/validate");
// check if user is admin
const admin = require("../middleware/admin");

module.exports = router;
