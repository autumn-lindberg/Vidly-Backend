const request = require("supertest");

describe("/api", () => {
  let app;
  let index;
  beforeEach(async () => {
    index = require("../../../index");
    app = index.app;
  });
  describe("GET /", () => {
    it("should return 200 if view model is properly rendered", async () => {
      const response = await request(app).get("/api");
      expect(response.status).toBe(200);
    });
  });
  describe("PUT /", () => {
    it("should return 400 if this endpoint is called", async () => {
      const response = await request(app).put("/api");
      expect(response.status).toBe(400);
    });
  });
  describe("POST /", () => {
    it("should return 400 if this endpoint is called", async () => {
      const response = await request(app).post("/api").set({});
      expect(response.status).toBe(400);
    });
    describe("DELETE /", () => {
      it("should return 400 if this endpoint is called", async () => {
        const response = await request(app).delete("/api");
        expect(response.status).toBe(400);
      });
    });
  });
});
