const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

module.exports = function (app) {
  // convert yaml files to JSON
  const customers = YAML.load("./static/customers.yaml");
  const genres = YAML.load("./static/genres.yaml");
  const movies = YAML.load("./static/movies.yaml");

  // load JSON OpenAPI specs to swaggerUI
  app.use("/api/docs/customers", swaggerUI.serve, swaggerUI.setup(customers));
  app.use("/api/docs/genres", swaggerUI.serve, swaggerUI.setup(genres));
  app.use("/api/docs/movies", swaggerUI.serve, swaggerUI.setup(movies));
};
