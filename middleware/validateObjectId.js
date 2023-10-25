const mongoose = require("mongoose");

// ensure that a valid object id is passed in request params
module.exports = function (request, response, next) {
  if (!mongoose.Types.ObjectId.isValid(request.params)) {
    return response.status(404).send("Invalid ID");
  }
  next();
};
