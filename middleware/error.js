const winston = require("winston");

// log error message to the logfile
module.exports = function (error, request, response, next) {
  // console.log(error.message);
  winston.error(error.message, error);
  response.status(500).send("Failed: " + error.message);
};
