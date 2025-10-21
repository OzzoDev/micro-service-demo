const request = require("supertest");
const { Hono } = require("hono");

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono API! 🚀"));

describe("API root endpoint", () => {
  it("should respond with 200 and Hello message", async () => {
    const response = await request(app.fetch).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello Hono API! 🚀");
  });
});
