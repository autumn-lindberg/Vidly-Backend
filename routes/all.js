const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", function (request, response) {
  response.sendFile(path.join(process.cwd(), "build", "index.html"));
});

module.exports = router;
