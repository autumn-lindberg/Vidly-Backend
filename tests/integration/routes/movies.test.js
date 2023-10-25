const request = require("supertest");
const { Movie } = require("../../../models/movie");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

////// CONFIGURATION SETTINGS ////////
const Data = Movie;
let endpoint = "movies";
let validData = {
  _id: new mongoose.Types.ObjectId(),
  title: "test movie",
  genre: new Genre({
    name: "test genre",
  }),
  numberInStock: 5,
  dailyRentalRate: 3,
  liked: true,
};
// new data for post request
let newData = {
  _id: new mongoose.Types.ObjectId(),
  title: "new movie",
  genre: new Genre({
    name: "test genre",
  }),
  numberInStock: 5,
  dailyRentalRate: 3,
  liked: true,
};
// current implementation requires sampleprop
// to have a min length as validation
let sampleProp = "title";
let preservedValue = newData[sampleProp];
/////////////////////////////////////

let app;
let index;
let token;
let data;

describe(`/api/${endpoint}`, () => {
  beforeEach(async () => {
    index = require("../../../index");
    app = index.app;
    token = new User({
      isAdmin: true,
    }).generateToken();
    data = new Data(validData);
    await data.save();
  });
  afterEach(async () => {
    await Data.collection.deleteMany({});
  });

  describe("GET /", () => {
    const exec = async () => {
      return request(app).get(`/api/${endpoint}`);
    };
    it("should return all data", async () => {
      const response = await exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
  describe("GET /:entry", () => {
    let dataId;
    const exec = async () => {
      return await request(app).get(`/api/${endpoint}/${dataId}`);
    };
    it("should return 404 if entry is not found", async () => {
      // set a valid object id, but not one that will be found
      dataId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should send data to client if id is valid", async () => {
      const data = await Data.findOne({
        [sampleProp]: validData[sampleProp],
      });
      dataId = data._id;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
  describe("POST /", () => {
    const exec = async () => {
      // send raw object because POST api implementation takes
      // care of creating object
      return await request(app)
        .post(`/api/${endpoint}`)
        .set("x-auth-token", token)
        .send(newData);
    };
    it("should return 400 error if the invalid data is passed to body", async () => {
      newData[sampleProp] = "x";
      const response = await exec();
      // reset sampleProp (?)
      newData[sampleProp] = preservedValue;
      expect(response.status).toBe(400);
    });
    it("should save the data to DB if body is valid", async () => {
      const response = await exec();
      const dataInDB = await Data.findOne({
        [sampleProp]: newData[sampleProp],
      });
      expect(dataInDB).not.toBeNull();
    });
    it("should send the data back to client if body is valid", async () => {
      const response = await exec();
      expect(response.body).not.toBeNull();
    });
  });
  describe("DELETE /:entry", () => {
    let dataId;
    const exec = async () => {
      return await request(app)
        .delete(`/api/${endpoint}/${dataId}`)
        .set("x-auth-token", token);
    };
    it("should return 404 if entry is not found", async () => {
      dataId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should successfully delete entry and return it to client", async () => {
      const data = await Data.findOne({
        [sampleProp]: validData[sampleProp],
      });
      dataId = data._id;
      const response = await exec();
      const notFound = await Data.findOne({
        [sampleProp]: validData[sampleProp],
      });
      expect(notFound).toBeNull();
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
  describe("PUT /:entry", () => {
    let dataId;
    const exec = async () => {
      return await request(app)
        .put(`/api/${endpoint}/${dataId}`)
        .set("x-auth-token", token)
        .send(validData);
    };
    it("should return 404 if entry is not found", async () => {
      dataId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should return 200 and return entry to client if data is valid", async () => {
      const data = await Data.findOne({
        [sampleProp]: validData[sampleProp],
      });
      dataId = data._id;
      validData[sampleProp] = "updated prop";
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(sampleProp, "updated prop");
    });
  });
  // test bad endpoints
  describe("PUT /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await request(app).put(`/api/${endpoint}`);
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await request(app).delete(`/api/${endpoint}`);
      expect(response.status).toBe(400);
    });
  });
  describe("POST /:entry", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      // get a valid objectId from DB
      const data = await Data.find(validData);
      dataId = data._id;
      const response = await request(app).post(`/api/${endpoint}/${dataId}`);
      expect(response.status).toBe(400);
    });
  });
});
