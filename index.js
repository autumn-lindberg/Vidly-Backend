// TODO:
// ADD QUERY PARAMETERS FOR EACH ENDPOINT
// that way API users aren't bound to searching by
// one type, just by a default that can be changed

// import mongoose and connect to DB
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/vidly")
  .then(() => {
    console.log("Connected to DB...");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

// 3rd party middleware
const helmet = require("helmet");
const morgan = require("morgan");
// custom middleware
const test = require("./middleware/middle");
// get routes
const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");

// set up express
const express = require("express");
const app = express();

// set up configuration
const config = require("config");

// set up debug types
const debugAll = require("debug")("app:all");
const debugSmall = require("debug")("app:small");
const debugDB = require("debug")("app:db");

// set view engine to pug
app.set("view engine", "pug");
app.set("views", "./views");
// enable JSON parsing in body of request
app.use(express.json());
// routes (good ones)
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
// routes (bad ones are handled here)
app.use("/api", home);
// set static assets to inside public folder
app.use(express.static("public"));
// secure with helmet
app.use(helmet());
// log HTTP requests
app.use(morgan("tiny"));
// test custom middleware (prints out test text on every request)
app.use(test);

// test debugging types on startup
debugAll(config.get("name"));
debugDB("Debugging Database Turned On");
debugSmall("Debugging With Small Output");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
