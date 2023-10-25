require("express-async-errors");
require("winston-mongodb");
const winston = require("winston");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
    }),
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
    })
  );

  // winston doesn't natively handle rejected promises
  // throw exception so that winston will catch them
  // then put them in uncaughtExceptions.log
  process.on("unhandledRejection", (exception) => {
    throw exception;
  });

  // add a logfile for winston (middleware errors)
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
    })
  );

  // log errors, warnings, and info to mongodb
  /*
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info",
    })
  );
  */
};
