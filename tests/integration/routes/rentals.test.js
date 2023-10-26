const request = require("supertest");
const { Movie } = require("../../../models/movie");
const { Rental } = require("../../../models/rental");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const { Customer } = require("../../../models/customer");
const mongoose = require("mongoose");

// config settings
const endpoint = "rentals";
const Data = Rental;

let app;
let index;
let token;
let data;
let rental;
let movie;
let customer;

describe(`/api/${endpoint}`, () => {
  beforeEach(async () => {
    // sample rental to save initially
    data = new Data({
      _id: new mongoose.Types.ObjectId(),
      dateOut: Date.now(),
      customer: new Customer({
        _id: new mongoose.Types.ObjectId(),
        name: "Test McGee",
        dateJoined: Date.now(),
        phone: "1234567890",
        email: "test-email@gmail.com",
        isGold: true,
        points: 50,
      }),
      movie: new Movie({
        _id: new mongoose.Types.ObjectId(),
        title: "test movie",
        genre: new Genre({
          name: "test genre",
        }),
        numberInStock: 5,
        dailyRentalRate: 3,
        liked: true,
      }),
    });
    index = require("../../../index");
    app = index.app;
    token = new User({
      isAdmin: true,
    }).generateToken();
    await data.save();
  });
  afterEach(async () => {
    await Data.collection.deleteMany({});
  });

  describe("GET /", () => {
    const exec = async () => {
      //
    };
    it("should return all data", async () => {
      //
    });
  });
  describe("GET /:entry", () => {
    const exec = async () => {
      //
    };
    it("should return 404 if entry is not found", async () => {
      //
    });
    it("should send data to client if id is valid", async () => {
      //
    });
  });
  describe("POST /", () => {
    const exec = async () => {
      //
    };
    it("should return 404 error if the customer or movie is not found", async () => {
      //
    });
    it("should send 400 error if movie is not in stock", async () => {
      //
    });
    it("should save the data to DB if body is valid", async () => {
      //
    });
    it("should decrement the stock of the movie", async () => {
      //
    });
    it("should send the data back to client if body is valid", async () => {
      //
    });
  });

  // test bad endpoints
  describe("DELETE /:entry", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      //
    });
  });
  describe("PUT /:entry", () => {
    it("should response with 400 error if this endpoint is called", async () => {
      //
    });
  });
  describe("PUT /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      //
    });
  });
  describe("DELETE /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      //
    });
  });
  describe("POST /:entry", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      //
    });
  });
});
