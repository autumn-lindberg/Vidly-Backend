const path = require("path");
const express = require("express");
const router = express.Router();

// handle all endpoints that react app touches
router.get("/", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/login", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/register", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/movies", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/movies/:id", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/products", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/products/:id", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/customers", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/customers/:id", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/genres", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/genres/:id", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/rentals", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});
router.get("/rent/:id", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});

router.post("/", (request, response) => {
  return response.status(400).send("Error 400: Path Requested is Too Short");
});

router.put("/", (request, response) => {
  return response.status(400).send("Error 400: Path Requested is Too Short");
});

router.delete("/", (request, response) => {
  return response.status(400).send("Error 400: Path Requested is Too Short");
});

module.exports = router;
