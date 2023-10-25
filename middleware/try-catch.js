module.exports = function (handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response);
      next();
    } catch (exception) {
      return response.status(500).send(exception);
    }
  };
};
