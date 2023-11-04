// take request body and validate it using validator function
module.exports = function (validator) {
  return (request, response, next) => {
    const { error } = validator(request.body);
    if (error) {
      // console.log(error);
      return response.status(400).send(error.details[0].message);
    }
    next();
  };
};
