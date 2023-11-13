const express = require("express");
const router = express.Router();

// YOU DON'T NEED TO HANDLE BAD ENDPOINTS - ITS DONE AUTOMATICALLY
router.get("/", (request, response) => {
  // render index.pug using placeholders title and message
  response.status(200).render("index", {
    title: "API Home",
    message: "Welcome to my API!!",
  });
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
