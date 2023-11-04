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
const moment = require("moment");

// RETURNS AREN'T STORED, THEY JUST UPDATE A RENTAL
router.post(
  "/",
  [auth, validate(validateRental)],
  async (request, response) => {
    let rental = request.body;
    if (!rental.customer || !rental.movie)
      return response.status(400).send("Data Missing From Request");

    // 404 if combo not found
    let data = await Rental.find({
      "customer._id": rental.customer._id,
      "movie._id": rental.movie._id,
    });
    if (data.length === 0) return response.status(404).send("Rental Not Found");

    // change data from array to object
    rental = data[0];

    if (rental.dateReturned)
      return response.status(400).send("Return already processed");

    // adjust date returned
    rental.dateReturned = new Date();

    // adjust rental fee
    const diffInDays = moment().diff(rental.dateOut, "days");
    rental.rentalFee = rental.movie.dailyRentalRate * diffInDays;
    await rental.save();

    // increase stock
    const movie = await Movie.findOneAndUpdate(
      {
        _id: rental.movie._id,
      },
      {
        numberInStock: rental.movie.numberInStock + 1,
      },
      {
        new: true,
      }
    );

    return response.send(rental);
  }
);

router.get("/", async (request, response) => {
  return response.status(400).send("Error 400: Bad Request");
});
router.put("/", async (request, response) => {
  return response.status(400).send("Error 400: Bad Request");
});
router.delete("/", async (request, response) => {
  return response.status(400).send("Error 400: Bad Request");
});
router.get("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Bad Request");
});
router.post("/:entry", async (request, response) => {
  return response.status(400).send("Error 400 Bad Request");
});
router.put("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Bad Request");
});
router.delete("/:entry", async (request, response) => {
  return response.status(400).send("Error 400: Bad Request");
});

module.exports = router;
