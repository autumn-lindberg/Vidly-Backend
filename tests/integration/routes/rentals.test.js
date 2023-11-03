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
    rental = {
      customer: {
        _id: new mongoose.Types.ObjectId(),
        name: "Test McGee",
        dateJoined: Date.now(),
        phone: "1234567890",
        email: "test-email@gmail.com",
        isGold: true,
        points: 50,
      },
      movie: {
        _id: new mongoose.Types.ObjectId(),
        title: "test movie",
        genre: {
          name: "test genre",
        },
        numberInStock: 5,
        dailyRentalRate: 3,
        liked: true,
      },
    };
    data = new Rental({
      ...rental,
      _id: new mongoose.Types.ObjectId(),
      dateOut: Date.now(),
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
      return request(app).get("/api/rentals");
    };
    it("should return all data", async () => {
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
  describe("GET /:entry", () => {
    const exec = async () => {};
    it("should return 404 if entry is not found", async () => {
      //
    });
    it("should send data to client if id is valid", async () => {
      //
    });
  });
  describe("POST /", () => {
    const exec = async () => {
      return request(app)
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send(rental);
    };
    it("should return 404 if movie is not found", async () => {
      rental.movie = {
        _id: new mongoose.Types.ObjectId(),
        title: "test movie",
        genre: {
          name: "test genre",
        },
        numberInStock: 5,
        dailyRentalRate: 3,
        liked: true,
      };
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should return 404 error if the customer is not found", async () => {
      rental.customer = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test McGee",
        dateJoined: Date.now(),
        phone: "1234567890",
        email: "test-email@gmail.com",
        isGold: true,
        points: 50,
      };
      const response = await exec();
      expect(response.status).toBe(404);
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
