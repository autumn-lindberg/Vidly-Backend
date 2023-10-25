const cors = require("cors");

module.exports = function (app) {
  // cors for allowing cross-origin requests
  app.use(cors());
};
