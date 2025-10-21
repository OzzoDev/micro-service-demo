const { Hono } = require("hono");

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono auth! 🚀"));

describe("Auth root endpoint", () => {
  it("should respond with 200 and Hello message", async () => {
    const response = await app.fetch(new Request("http://localhost/"));
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("Hello Hono auth! 🚀");
  });
});
