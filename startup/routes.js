const express = require("express");
const movies = require("../routes/movies");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const home = require("../routes/home");
const users = require("../routes/users");
const login = require("../routes/login");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const google_oauth = require("../routes/google-oauth");
const error = require("../middleware/error");

module.exports = function (app) {
  // enable JSON parsing in body of request
  app.use(express.json());

  app.use("/api", home);
  // routes (good ones)
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/customers", customers);
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/google-oauth", google_oauth);
  app.use(error);
};
