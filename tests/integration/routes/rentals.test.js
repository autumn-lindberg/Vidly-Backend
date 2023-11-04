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
let outOfStockMovie;
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
    // define an out of stock movie to save to DB
    outOfStockMovie = {
      _id: new mongoose.Types.ObjectId(),
      title: "test movie",
      genre: {
        name: "test genre",
      },
      numberInStock: 0,
      dailyRentalRate: 3,
      liked: true,
    };
    newMovie = {
      _id: new mongoose.Types.ObjectId(),
      title: "new movie",
      genre: {
        name: "test genre",
      },
      numberInStock: 5,
      dailyRentalRate: 3,
      liked: true,
    };
    data = new Rental({
      ...rental,
      _id: new mongoose.Types.ObjectId(),
      dateOut: Date.now(),
    });
    // save movie in database
    movie = new Movie(rental.movie);
    customer = new Customer(rental.customer);
    index = require("../../../index");
    app = index.app;
    token = new User({
      isAdmin: true,
    }).generateToken();
    await data.save();
    await movie.save();
    await new Movie(outOfStockMovie).save();
    await new Movie(newMovie).save();
    await customer.save();
  });
  afterEach(async () => {
    await Data.collection.deleteMany({});
    await Movie.collection.deleteMany({});
    await Customer.collection.deleteMany({});
    await Rental.collection.deleteMany({});
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
    let entry;
    const exec = async () => {
      return request(app).get(`/api/rentals/${entry}`);
    };
    it("should return 404 if entry is not found", async () => {
      entry = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should send data to client if id is valid", async () => {
      entry = data._id;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body).toHaveProperty("_id");
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
      rental.movie = outOfStockMovie;
      const response = await exec();
      expect(response.status).toBe(400);
    });
    it("should save the data to DB if body is valid", async () => {
      rental.movie = newMovie;
      const response = await exec();
      const rentalInDB = await Rental.findOne({
        "movie._id": newMovie._id,
      });
      expect(rentalInDB).not.toBeNull();
      expect(rentalInDB).toHaveProperty("_id");
    });
    it("should decrement the stock of the movie", async () => {
      rental.movie = newMovie;
      let stock = rental.movie.numberInStock;
      const response = await exec();
      const movieInDB = await Movie.findOne({
        _id: newMovie._id,
      });
      expect(movieInDB.numberInStock).toBe(stock - 1);
    });
    it("should send the data back to client if body is valid", async () => {
      rental.movie = newMovie;
      let stock = rental.movie.numberInStock;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
    });
  });

  // test bad endpoints
  describe("DELETE /:entry", () => {
    let endpoint = new mongoose.Types.ObjectId();
    const exec = async () => {
      return request(app).delete(`/api/rentals/${endpoint}`);
    };
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("PUT /:entry", () => {
    let endpoint = new mongoose.Types.ObjectId();
    const exec = async () => {
      return request(app).put(`/api/rentals/${endpoint}`);
    };
    it("should response with 400 error if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("PUT /", () => {
    const exec = async () => {
      return request(app).put(`/api/rentals`);
    };
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /", () => {
    const exec = async () => {
      return request(app).delete(`/api/rentals`);
    };
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("POST /:entry", () => {
    let endpoint = new mongoose.Types.ObjectId();
    const exec = async () => {
      return request(app).post(`/api/rentals/${endpoint}`);
    };
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
});
