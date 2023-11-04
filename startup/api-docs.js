const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

module.exports = function (app) {
  // convert yaml files to JSON
  const customers = YAML.load("./static/yaml/customers.yaml");
  const genres = YAML.load("./static/yaml/genres.yaml");
  const movies = YAML.load("./static/yaml/movies.yaml");
  const products = YAML.load("./static/yaml/products.yaml");
  const rentals = YAML.load("./static/yaml/rentals.yaml");
  const returns = YAML.load("./static/yaml/returns.yaml");

  // load JSON OpenAPI specs to swaggerUI
  app.use("/api/docs/customers", swaggerUI.serve, swaggerUI.setup(customers));
  app.use("/api/docs/genres", swaggerUI.serve, swaggerUI.setup(genres));
  app.use("/api/docs/movies", swaggerUI.serve, swaggerUI.setup(movies));
  app.use("/api/docs/products", swaggerUI.serve, swaggerUI.setup(products));
  app.use("/api/docs/rentals", swaggerUI.serve, swaggerUI.setup(rentals));
  app.use("/api/docs/returns", swaggerUI.serve, swaggerUI.setup(returns));
};
