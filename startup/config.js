module.exports = function (app) {
  // set up configuration
  if (!process.env.JWT_PRIVATE_KEY)
    throw new Error("JWT Private Key Is Missing!");
};
