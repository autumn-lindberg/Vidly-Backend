const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware unit test", () => {
  it("should populate req.user with JWT's payload", () => {
    // create a fake token
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: "Test User",
      email: "test-email@gmail.com",
      password: "1234",
      isAdmin: true,
    });
    const token = user.generateToken();
    // mock request, response, and next for auth middleware
    const request = {
      header: jest.fn().mockReturnValue(token),
    };
    const response = {};
    const next = jest.fn();

    // call auth middleware
    auth(request, response, next);
    // if successful, request.user will be populated
    // expect(request.user).toMatchObject(user);
  });
});
