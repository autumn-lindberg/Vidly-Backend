const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const { moviesSchema } = require("./movie");
const { customersSchema } = require("./customer");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  _id: String,
  dateOut: {
    type: Date,
    required: true,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
  },
  // reference the customer, because info on the customer should
  // be current when the rental comes back (isGold, phone number change, etc.)
  customer: {
    type: customersSchema,
    required: true,
  },
  // embed the movie, because price changes while rental is out
  // should not change the price charged to the customer
  movie: {
    type: moviesSchema,
    required: true,
  },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.find({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function (rental) {
  // adjust date returned
  this.dateReturned = new Date();
  // adjust rental fee
  const diffInDays = moment().diff(this.dateOut, "days");
  this.rentalFee = this.movie.dailyRentalRate * diffInDays;
};

const Rental = mongoose.model("Rentals", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    _id: Joi.string(),
    dateOut: Joi.date(),
    dateReturned: Joi.date(),
    rentalFee: Joi.number(),
    customerId: Joi.ObjectId.required(),
    movieId: Joi.ObjectId.required(),
  });
  return schema.validate(rental);
}

module.exports.validateRental = validateRental;
module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
