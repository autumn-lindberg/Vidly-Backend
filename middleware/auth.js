const jwt = require("jsonwebtoken");

// get JWT and set headers if appropriate
module.exports = function (request, response, next) {
  // grab token
  const token = request.header("x-auth-token");
  if (!token)
    return response.status(401).send("Access Denied, No Token Provided");

  try {
    // decode token
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    // set request.user to payload
    request.user = payload;
    next();
  } catch (exception) {
    response.status(403).send("Invalid Token");
  }
};
