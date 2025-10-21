import request from "supertest";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono auth! 🚀"));

describe("Auth root endpoint", () => {
  it("should respond with 200 and Hello message", async () => {
    const response = await request(app.fetch).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello Hono auth! 🚀");
  });
});
