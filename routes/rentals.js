const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { validateRental, Rental } = require("../models/rental");
const { validateCustomer, Customer } = require("../models/customer");
const { validateMovie, Movie } = require("../models/movie");
const Fawn = require("fawn");
// wrapper function to wrap whole callback in a try/catch block
const trycatch = require("../middleware/try-catch");
// get JWT and set headers appropriately
const auth = require("../middleware/auth");
// validate request body
const validate = require("../middleware/validate");
// check if user is admin
const admin = require("../middleware/admin");
Fawn.init(mongoose);

////// CONFIGURATION SETTINGS ////////
const validateData = validateRental;
const Data = Rental;
const searchType = "_id";
/////////////////////////////////////

// GOOD ENDPOINTS
//    GET    /
//    POST   /
//    GET    /:entry
// BAD ENDPOINTS
//    PUT    /
//    DELETE /
//    POST   /:entry
//    PUT    /:entry
//    DELETE /:entry

// get entire dataset
router.get(
  "/",
  trycatch(async (request, response, next) => {
    // contact database
    const dataset = await Data.find().select("-__v").sort("-dateOut");

    // send data back to client
    return response.send(dataset);
  })
);

// generic post to dataset (token required, validate body)
router.post(
  "/",
  [auth, validate(validateData)],
  trycatch(async (request, response) => {
    let body = request.body;

    // find customer and movie in DB
    const movie = await Movie.find({
      [searchType]: body.movieId[searchType],
    });
    const customer = await Customer.find({
      [searchType]: body.customerId[searchType],
    });

    if (!movie || !customer)
      return response.status(404).send("Customer Or Movie Not Found");

    // check if movie is in stock
    if (movie.numberInStock === 0)
      return response.status(400).send("Movie Not In Stock");

    //set date out to now
    data.dateOut = Date.now;

    // create new object to send to DB
    let data = new Data(body);

    // send data to DB, record the response to send back to client
    new Fawn.Task()
      .save("Rentals", data)
      .update(
        "Movies",
        { _id: data._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    // send data back
    response.send(data);
  })
);

// get individual entry
router.get(
  "/:entry",
  trycatch(async (request, response) => {
    let { entry } = request.params;

    // contact datbase and look for entry
    const data = await Data.findOne({
      [searchType]: entry,
    });

    // if entry is not found
    if (!data || data.length === 0)
      return response.status(404).send(`Error 404: Entry Not Found`);
    // send data!
    else response.send(data);
  })
);

// BAD API CALLS
router.put("/", (request, response) => {
  return response.status(400).send("Error 400: Cannot Update Entire Dataset");
});
router.delete("/", (request, response) => {
  return response.status(400).send("Error 400: Cannot Delete Entire Dataset");
});
router.post("/:entry", (request, response) => {
  return response.status(400).send("Error 400: Cannot Post A Movie To A Movie");
});
router.put("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Updates Not Allowed");
});
router.delete("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Updates Not Allowed");
});

module.exports = router;
