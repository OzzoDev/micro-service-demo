import { Hono } from "hono";
import { serve } from "@hono/node-server";

const port = 3001;
const app = new Hono();

const user = {
  name: "User",
  email: "user@gmail.com",
};

app.get("/", (c) => c.text("Hello Hono auth! 🚀"));

app.get("/auth/sign-in", (c) => {
  return c.json({ message: `Login successful`, user });
});

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`🚀 Hono auth is running on http://localhost:${port}`);
  }
);
