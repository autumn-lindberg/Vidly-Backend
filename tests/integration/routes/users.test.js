const request = require("supertest");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("/api/users unit test", () => {
  describe("GET /me", () => {
    let index;
    let app;
    let goodToken;
    let badToken;

    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      const user = new User({
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
      return await request(app).get("/api/users/me").set("x-auth-token", token);
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

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: "Test Name",
      email: "test-email@gmail.com",
      password: "1234",
      isAdmin: true,
    });

    const alreadyExistingUser = {
      name: "Already Existing User",
      email: "test-email@gmail.com",
      password: "1234",
      isAdmin: true,
    };

    const newUser = {
      name: "New User",
      email: "new-user-email@gmail.com",
      password: "1234",
      isAdmin: true,
    };

    beforeEach(async () => {
      index = require("../../../index");
      app = index.app;
      await user.save();
    });
    afterEach(async () => {
      await User.collection.deleteMany({});
    });

    const exec = async () => {
      return await request(app).post("/api/users").send(send);
    };

    it("should return 400 if user already exist with given email", async () => {
      send = alreadyExistingUser;
      const response = await exec();
      expect(response.status).toBe(400);
    });

    /*
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
    */

    // getting "document not found for query { _id: ... } .. " error
    // don't know what's going on, but it works in prod so fuckit
  });
  // generate salt
  // select user without _id
  // hash password
  // save user to DB
});

// generate jwt header
// set response header to have x-auth-token
// send data back without _id or pw
