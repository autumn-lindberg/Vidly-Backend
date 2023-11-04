const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");
const { Rental } = require("../../../models/rental");
const { Movie } = require("../../../models/movie");
const { User } = require("../../../models/user");

describe("/api/returns", () => {
  let rental;
  let movie;
  let token;
  let index;
  let app;
  let data;
  describe("POST /", () => {
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      token = new User().generateToken();
      movie = {
        _id: new mongoose.Types.ObjectId(),
        title: "test movie",
        genre: {
          name: "test genre",
        },
        numberInStock: 5,
        dailyRentalRate: 3,
        liked: true,
      };
      rental = {
        _id: new mongoose.Types.ObjectId(),
        dateOut: Date.now(),
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: "Test McGee",
          dateJoined: Date.now(),
          phone: "1234567890",
          email: "test-email@gmail.com",
          isGold: true,
          points: 50,
        },
        movie: movie,
      };
      data = new Rental(rental);
      // save the movie from rental in DB so it can be found
      await new Movie(movie).save();
      await data.save();
    });
    afterEach(async () => {
      await Movie.collection.deleteMany({});
      await Rental.collection.deleteMany({});
    });
    const exec = async () => {
      return request(app)
        .post("/api/returns")
        .set("x-auth-token", token)
        .send(rental);
    };
    it("should return 401 if not logged in", async () => {
      token = "";
      const response = await exec();
      expect(response.status).toBe(401);
    });
    it("should return 400 if data is not valid", async () => {
      delete rental.movie;
      const response = await exec();
      expect(response.status).toBe(400);
    });
    it("should return 404 if no rental found for that customer/movie", async () => {
      rental.movie._id = new mongoose.Types.ObjectId();
      rental.customer._id = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should return 400 if rental already processed", async () => {
      const test = await Rental.findOneAndUpdate(
        {
          _id: rental._id,
        },
        {
          dateReturned: Date.now(),
        },
        {
          new: true,
        }
      );
      const response = await exec();
      expect(response.status).toBe(400);
    });
    it("should return 200 if request is valid", async () => {
      const response = await exec();
      expect(response.status).toBe(200);
    });
    it("should set rental fee if valid data", async () => {
      // simulate the rental being out for 7 days
      data.dateOut = moment().add(-7, "days").toDate();
      await data.save();
      const response = await exec();
      const rentalInDB = await Rental.findById(rental._id);
      // calculate 7 days x rental fee
      expect(rentalInDB.rentalFee).toBe(rentalInDB.movie.dailyRentalRate * 7);
    });
    it("should increase the stock if input is valid", async () => {
      const response = await exec();
      const movieInDB = await Movie.findById(rental.movie._id);
      expect(movieInDB.numberInStock).toBe(rental.movie.numberInStock + 1);
    });
    it("should return the rental if data is valid", async () => {
      const response = await exec();
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining([
          "dateOut",
          "dateReturned",
          "rentalFee",
          "customer",
          "movie",
        ])
      );
    });
  });
  describe("GET /", () => {
    const exec = () => {
      return request(app).get("/api/returns");
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("PUT /", () => {
    const exec = () => {
      return request(app).put("/api/returns");
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /", () => {
    const exec = () => {
      return request(app).delete("/api/returns");
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("GET /:entry", () => {
    const endpoint = new mongoose.Types.ObjectId();
    const exec = () => {
      return request(app).get(`/api/returns/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("POST /:entry", () => {
    const endpoint = new mongoose.Types.ObjectId();
    const exec = () => {
      return request(app).post(`/api/returns/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("PUT /:entry", () => {
    const endpoint = new mongoose.Types.ObjectId();
    const exec = () => {
      return request(app).put(`/api/returns/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /:entry", () => {
    const endpoint = new mongoose.Types.ObjectId();
    const exec = () => {
      return request(app).delete(`/api/returns/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
});
