module.exports = function (app) {
  // set up configuration
  const config = require("config");
  if (!config.get("JWT-private-key"))
    throw new Error("JWT Private Key Is Missing!");
};
