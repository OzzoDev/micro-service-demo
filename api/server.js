import { Hono } from "hono";
import { serve } from "@hono/node-server";

const port = 3002;
const app = new Hono();

app.get("/", (c) => c.text("Hello Hono API! 🚀"));

app.get("/api/me", async (c) => {
  try {
    const res = await fetch("http://auth:3001/auth/sign-in");

    const authData = await res.json();

    return c.json({
      user: authData.user,
    });
  } catch (error) {
    return c.json({ error: "Auth service unavailable" }, 500);
  }
});

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`🚀 Hono API is running on http://localhost:${port}`);
  }
);
