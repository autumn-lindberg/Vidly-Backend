function test(request, response, next) {
  console.log("Testing Middleware...");
  next();
}

module.exports = test;
