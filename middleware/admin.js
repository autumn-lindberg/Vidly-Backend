// check JWT in request.user to see if user is admin
module.exports = function (request, response, next) {
  if (!request.user.isAdmin) {
    return response.status(403).send("Error 403: Unauthorized");
  }
  next();
};
