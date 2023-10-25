const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

////// CONFIGURATION SETTINGS ////////
const Data = Genre;
const searchType = "_id";
/////////////////////////////////////

let app;
let index;
let token;
let data;
let name;

describe("/api/genres", () => {
  beforeEach(async () => {
    index = require("../../../index");
    app = index.app;
    token = new User({
      isAdmin: true,
    }).generateToken();
    name = "test genre";
    data = new Data({
      _id: new mongoose.Types.ObjectId(),
      name: name,
    });
    await data.save();
  });
  afterEach(async () => {
    await Data.collection.deleteMany({});
  });

  describe("GET /", () => {
    const exec = async () => {
      return request(app).get("/api/genres");
    };
    it("should return all genres", async () => {
      name = "test genre";
      const response = await exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body.some((g) => g.name === "test genre")).toBeTruthy();
    });
  });
  describe("GET /:entry", () => {
    let genreId;
    const exec = async () => {
      return await request(app).get("/api/genres/" + genreId);
    };
    it("should return 404 if entry is not found", async () => {
      // set a valid object id, but not one that will be found
      genreId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should send data to client if id is valid", async () => {
      const data = await Data.findOne({
        name: name,
      });
      genreId = data._id;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
  describe("POST /", () => {
    const exec = async () => {
      // send raw object because POST api implementation takes
      // care of creating genre object
      return await request(app)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ _id: new mongoose.Types.ObjectId(), name: name });
    };
    it("should return 400 error if the invalid data is passed to body", async () => {
      name = "x";
      const response = await exec();
      expect(response.status).toBe(400);
    });
    it("should save the data to DB if body is valid", async () => {
      name = "new genre";
      const response = await exec();
      const genreInDB = await Data.findOne({
        name: "new genre",
      });
      expect(genreInDB).not.toBeNull();
    });
    it("should send the data back to client if body is valid", async () => {
      name: "new genre";
      const response = await exec();
      expect(response.body).not.toBeNull();
    });
  });
  describe("PUT /:entry", () => {
    let genreId;
    const exec = async () => {
      return await request(app)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name: name });
    };
    it("return 404 if genre is not found", async () => {
      // set a valid object id, but not one that will be found
      genreId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("saves data to DB if data is found and returns it in response", async () => {
      name = "test genre";
      const data = await Data.findOne({
        name: name,
      });
      genreId = data._id;
      name = "updated genre";
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "updated genre");
    });
  });
  describe("PUT /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await request(app).put("/api/genres");
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await request(app).delete("/api/genres");
      expect(response.status).toBe(400);
    });
  });
  describe("POST /:entry", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      name: "test genre";
      // get a valid objectId from DB
      const data = await Data.find({
        name: name,
      });
      const objectId = data._id;
      const response = await request(app).post("/api/genres/" + objectId);
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /:entry", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      name: "test genre";
      // get a valid objectId from DB
      const data = await Data.find({
        name: name,
      });
      const objectId = data._id;
      const response = await request(app).delete("/api/genres/" + objectId);
      expect(response.status).toBe(400);
    });
  });
});
