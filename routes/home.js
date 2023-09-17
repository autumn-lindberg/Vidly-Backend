const express = require("express");
const router = express.Router();
const fs = require("fs");

let fileList = [];
// get files in route to see if requested route is not found
fs.readdir("./routes", (error, files) => {
  if (error) console.log("Error: ", error);
  else {
    files.forEach((file, index) => {
      file.replace(".js", "");
      fileList.push(file);
    });
  }
});

router.get("/", (request, response) => {
  // render index.pug using placeholders title and message
  response.render("index", {
    title: "API Home",
    message: "Welcome to my API!",
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

// find bad endpoints using file system
router.get("/:endpoint", (request, response) => {
  const { endpoint } = request.params;
  let bad = true;
  fileList.forEach((file) => {
    file = file.replace(".js", "");
    console.log(file);

    if (endpoint === file) bad = false;
  });
  if (bad) return response.status(404).send(`Endpoint ${endpoint} Not Found`);
  else return;
});

// find bad endpoints using file system
router.post("/:endpoint", (request, response) => {
  const { endpoint } = request.params;
  let bad = true;
  fileList.forEach((file) => {
    file = file.replace(".js", "");
    console.log(file);

    if (endpoint === file) bad = false;
  });
  if (bad) return response.status(404).send(`Endpoint ${endpoint} Not Found`);
  else return;
});

module.exports = router;
