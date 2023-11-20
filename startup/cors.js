const cors = require("cors");

module.exports = function (app) {
  const corsOptions = {
    // list of custom headers to give back (expose) to client that sent request
    exposedHeaders: "x-auth-token",
    // allow anywhere to make requests to API (wildcard) = "*"
    // true sets this to request.header("Origin")
    // this setting allows both the front and backend to make requests
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "accounts.google.com",
      "oauth2.googleapis.com",
      "play.googe.com",
    ],
    // allow these request methods to API
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    // pass the preflight response to the next middleware if necessary
    preflightContinue: false,
    // default success status for OPTIONS request (legacy browsers don't like 204 sometimes?)
    optionsSuccessStatus: 200,
    // allow auth to be sent with all requests to API
    // credentials: true
  };
  // cors for allowing cross-origin requests
  app.use(cors(corsOptions));
};
