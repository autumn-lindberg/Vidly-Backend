const request = require("supertest");
const { Product } = require("../../../models/product");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

////// CONFIGURATION SETTINGS ////////
const Data = Product;
const searchType = "_id";
const endpoint = "products";
// current implementation requires sampleprop
// to have a min length as validation
let sampleProp = "title";
/////////////////////////////////////

let app;
let index;
let token;
let data;
let title;

describe("/api/products", () => {
  beforeEach(async () => {
    index = require("../../../index");
    app = index.app;
    token = new User({
      isAdmin: true,
    }).generateToken();
    title = "test product";
    data = {
      _id: new mongoose.Types.ObjectId(),
      title: title,
      price: 5,
      stock: 10,
      description: "test description",
    };
    validData = data;
    await new Data(data).save();
  });
  afterEach(async () => {
    await Data.collection.deleteMany({});
  });

  describe("GET /", () => {
    const exec = async () => {
      return request(app).get("/api/products");
    };
    it("should return all products", async () => {
      const response = await exec();

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(
        response.body.some((p) => p.title === "test product")
      ).toBeTruthy();
    });
  });
  describe("GET /:entry", () => {
    let productId;
    const exec = async () => {
      return request(app).get("/api/products/" + productId);
    };
    it("should return 404 if entry is not found", async () => {
      // set a valid object id, but not one that will be found
      productId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("should send data to client if id is valid", async () => {
      const data = await Data.findOne({
        title: title,
      });
      productId = data._id;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
  describe("POST /", () => {
    const exec = async () => {
      // send raw object because POST api implementation takes
      // care of creating product object
      return request(app)
        .post("/api/products")
        .set("x-auth-token", token)
        .send({
          _id: new mongoose.Types.ObjectId(),
          title: title,
          price: 5,
          stock: 10,
          description: "test description",
        });
    };
    it("should return 400 error if the invalid data is passed to body", async () => {
      title = "x";
      const response = await exec();
      expect(response.status).toBe(400);
    });
    it("should save the data to DB if body is valid", async () => {
      title = "new product";
      const response = await exec();
      const productInDB = await Data.findOne({
        title: "new product",
      });
      expect(productInDB).not.toBeNull();
    });
    it("should send the data back to client if body is valid", async () => {
      title: "new product";
      const response = await exec();
      expect(response.body).not.toBeNull();
    });
  });
  describe("PUT /:entry", () => {
    let productId;
    const exec = async () => {
      return request(app)
        .put("/api/products/" + productId)
        .set("x-auth-token", token)
        .send({
          title: title,
          price: 5,
          stock: 10,
          description: "test description",
        });
    };
    it("return 404 if product is not found", async () => {
      // set a valid object id, but not one that will be found
      productId = new mongoose.Types.ObjectId();
      const response = await exec();
      expect(response.status).toBe(404);
    });
    it("saves data to DB if data is found and returns it in response", async () => {
      title = "test product";
      const data = await Data.findOne({
        title: title,
      });
      productId = data._id;
      title = "updated product";
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", "updated product");
    });
  });
  describe("DELETE /:entry", () => {
    let dataId;
    const exec = async () => {
      return request(app)
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
        [sampleProp]: data[sampleProp],
      });
      expect(notFound).toBeNull();
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
    });
  });
  describe("PUT /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await request(app).put("/api/products");
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      const response = await request(app).delete("/api/products");
      expect(response.status).toBe(400);
    });
  });
  describe("POST /:entry", () => {
    it("should respond with 400 error if this endpoint is called", async () => {
      title = "test product";
      // get a valid objectId from DB
      const data = await Data.find({
        title: title,
      });
      const objectId = data._id;
      const response = await request(app).post("/api/products/" + objectId);
      expect(response.status).toBe(400);
    });
  });
});
