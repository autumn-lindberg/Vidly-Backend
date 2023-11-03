module.exports = function (handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response);
      next();
    } catch (exception) {
      console.log(exception);
      return response.status(500).send(exception);
    }
  };
};
