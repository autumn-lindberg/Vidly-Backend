const express = require("express");
const router = express.Router();

// YOU DON'T NEED TO HANDLE BAD ENDPOINTS - ITS DONE AUTOMATICALLY
router.get("/", function (request, response) {
  return response.send(`${process.env.CLIENT_ID}`);
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
