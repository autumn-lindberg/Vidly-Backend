require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const app = express();
require("./startup/logging")();
// FUCK YOU CORS YOU APP BREAKING PIECE OF SHITTTTT
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/pug")(app);
require("./startup/api-docs")(app);
//require("./seed/seedProducts")();

const path = require("path");

// use frontent build folder
app.use(express.static(path.join(__dirname, "build")));

// secure with helmet
app.use(helmet());

// log HTTP requests
app.use(morgan("tiny"));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

module.exports.app = app;
