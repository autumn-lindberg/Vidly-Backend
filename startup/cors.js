const cors = require("cors");

module.exports = function (app) {
  const corsOptions = {
    exposedHeaders: "x-auth-token",
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  // cors for allowing cross-origin requests
  app.use(cors(corsOptions));
};
