module.exports = function (handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response);
    } catch (exception) {
      console.log(exception);
      return next(exception);
    }
  };
};
