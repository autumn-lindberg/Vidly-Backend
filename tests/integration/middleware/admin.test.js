const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("admin middleware integration test", () => {
  let index;
  let app;
  let genre;
  let dataId;

  // set up clean slate with good values
  beforeEach(() => {
    token = new User({
      isAdmin: false,
    }).generateToken();
    index = require("../../../index");
    app = index.app;
    genre = new Genre({
      _id: new mongoose.Types.ObjectId(),
      name: "test genre",
    });
  });
  // clean up slate for next test
  afterEach(async () => {
    await Genre.collection.deleteMany({});
  });
  const exec = async () => {
    // call an admin-only endpoint
    return await request(app)
      .put(`/api/genres/${dataId}`)
      .set("x-auth-token", token)
      .send(genre);
  };
  it("should return 403 if user is not an admin", async () => {
    const data = await Genre.find({
      name: "test genre",
    });
    dataId = data._id;
    const response = await exec();
    expect(response.status).toBe(403);
  });
});
