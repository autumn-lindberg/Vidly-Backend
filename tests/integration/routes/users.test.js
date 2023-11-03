const request = require("supertest");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("/api/users integration test", () => {
  describe("GET /me", () => {
    let index;
    let app;
    let goodToken;
    let badToken;
    let user;

    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "Test Name",
        email: "test-email@gmail.com",
        password: "1234",
        isAdmin: true,
      });
      goodToken = user.generateToken();

      badToken = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "Bad Test",
        email: "bad-test@gmail.com",
        password: "1234",
        isAdmin: false,
      }).generateToken();

      await user.save();
    });
    afterEach(async () => {
      await User.collection.deleteMany({});
    });

    const exec = async () => {
      return request(app).get("/api/users/me").set("x-auth-token", token);
    };

    it("should return 404 if user is not found in DB", async () => {
      token = badToken;
      const response = await exec();
      expect(response.status).toBe(404);
    });

    it("should return user data", async () => {
      token = goodToken;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name", "Test Name");
      expect(response.body).toHaveProperty("isAdmin", true);
      expect(response.body).toHaveProperty("email", "test-email@gmail.com");
      expect(response.body).not.toHaveProperty("password");
    });
  });

  // POST /
  describe("POST /", () => {
    let send;
    let index;
    let app;
    let user;
    let alreadyExistingUser;
    let newUser;

    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "Test Name",
        email: "test-email@gmail.com",
        password: "1234",
        isAdmin: true,
      });

      alreadyExistingUser = {
        name: "Already Existing User",
        email: "test-email@gmail.com",
        password: "1234",
        isAdmin: true,
      };

      newUser = {
        name: "New User",
        email: "new-user-email@gmail.com",
        password: "1234",
        isAdmin: true,
      };
      await user.save();
    });
    afterEach(async () => {
      await User.collection.deleteMany({});
    });

    const exec = async () => {
      return request(app).post("/api/users").send(send);
    };

    it("should return 400 if user already exist with given email", async () => {
      send = alreadyExistingUser;
      const response = await exec();
      expect(response.status).toBe(400);
    });

    it("should save new user to DB if user does not exist", async () => {
      send = newUser;
      const response = await exec();
      const data = await User.findOne({
        email: newUser.email,
      });
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("_id");
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("email");
      expect(data).toHaveProperty("password");
      expect(data).toHaveProperty("isAdmin");
    });
    it("should give data back to client if successful, including _id an without password", async () => {
      send = newUser;
      const response = await exec();
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("isAdmin");
      expect(response.body).not.toHaveProperty("password");
    });
  });
  describe("GET /", () => {
    let index;
    let app;
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
    });
    const exec = async () => {
      return request(app).get("/api/users");
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("PUT /", () => {
    let index;
    let app;
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
    });
    const exec = async () => {
      return request(app).put("/api/users");
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /", () => {
    let index;
    let app;
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
    });
    const exec = async () => {
      return request(app).delete("/api/users");
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("PUT /:entry", () => {
    let index;
    let app;
    let endpoint;
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      endpoint = new mongoose.Types.ObjectId();
    });
    const exec = async () => {
      return request(app).put(`/api/users/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /:entry", () => {
    let index;
    let app;
    let endpoint;
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      endpoint = new mongoose.Types.ObjectId();
    });
    const exec = async () => {
      return request(app).delete(`/api/users/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
  describe("POST /:entry", () => {
    let index;
    let app;
    let endpoint;
    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      endpoint = new mongoose.Types.ObjectId();
    });
    const exec = async () => {
      return request(app).post(`/api/users/${endpoint}`);
    };
    it("should return 400 if this endpoint is called", async () => {
      const response = await exec();
      expect(response.status).toBe(400);
    });
  });
});
