const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const { default: mongoose } = require("mongoose");

describe("error middleware integration test", () => {
  let index;
  let app;
  let genre;

  // set up clean slate with good values
  beforeEach(() => {
    token = new User().generateToken();
    index = require("../../../index");
    app = index.app;
    genre = new Genre({
      _id: new mongoose.Types.ObjectId(),
      name: "test genre",
    });
  });
  // clean up slate and close server so its not busy on next call
  afterEach(async () => {
    await Genre.collection.deleteMany({});
  });
  // define a basic request to call in each it()
  const exec = async () => {
    // send a sample request to a token-requiring endpoint
    return await request(app)
      .get("/api/genres/rejectedPromise")
      .set("x-auth-token", token);
  };
  it("should throw 500 error when a poromise is rejected and not handled", async () => {
    const response = await exec();
    expect(response.status).toBe(500);
  });
});
