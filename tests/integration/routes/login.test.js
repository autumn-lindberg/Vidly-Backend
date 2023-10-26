const request = require("supertest");
const { User } = require("../../../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("config");

describe("/api/login", () => {
  let token;
  let index;
  let app;
  let user;
  let login;
  let password;
  let badPassword;
  let salt;
  beforeEach(async () => {
    index = require("../../../index");
    app = index.app;
    salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash("password", salt);
    user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: "Test Name",
      email: "test-email@gmail.com",
      password: password,
      isAdmin: true,
    });
    // start with good data and set bad data in each test
    login = {
      email: "test-email@gmail.com",
      password: "password",
    };
    await user.save();
  });
  afterEach(async () => {
    await User.collection.deleteMany({});
  });
  const exec = async () => {
    return request(app).post("/api/login").send(login);
  };
  it("should return 400 if email is not found", async () => {
    login.email = "bad-email@gmail.com";
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 400 if password is bad", async () => {
    login.password = "bad-password";
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 200 and send JWT back if user info is good", async () => {
    const response = await exec();
    const data = JWT.verify(
      response.header["x-auth-token"],
      config.get("JWT-private-key")
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("password");
    expect(data).toHaveProperty("_id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("email");
    expect(data).toHaveProperty("isAdmin");
  });
});
