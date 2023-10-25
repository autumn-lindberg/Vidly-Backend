const request = require("supertest");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

describe("auth middleware integration test", () => {
  let index;
  let app;
  let genre;

  // set up clean slate with good values
  beforeEach(() => {
    token = new User().generateToken();
    index = require("../../../index");
    app = index.app;
    genre = new Genre({
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
      .post("/api/genres")
      .set("x-auth-token", token)
      .send(genre);
  };
  it("should return 401 if no token is provided", async () => {
    // set token to blank - supertest uses strings so "null" is not blank
    token = "";
    const response = await exec();
    expect(response.status).toBe(401);
  });
  it("should return 403 if token is provided but invalid", async () => {
    // set token to something bad
    token = "x";
    const response = await exec();
    expect(response.status).toBe(403);
  });
});
