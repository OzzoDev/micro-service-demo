import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import pkg from "pg";

const { Pool } = pkg;

const port = 3001;
const app = new Hono();

app.use("*", cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", (c) => c.text("Hello Hono auth! 🚀"));

app.get("/auth/sign-in", async (c) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users LIMIT 1");

    if (result.rows.length === 0) {
      return c.json({ message: "No user found" }, 404);
    }

    const user = result.rows[0];
    return c.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Database query error:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
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
