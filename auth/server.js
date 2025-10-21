import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import fs from "fs";
import pkg from "pg";
import yaml from "yaml";

const { Pool } = pkg;
const port = 3001;
const app = new Hono();

app.use("*", cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🔹 Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Service API",
      version: "1.0.0",
      description: "Handles authentication and user sign-in operations",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
fs.writeFileSync("./swagger.yaml", yaml.stringify(swaggerSpec));

const expressApp = express();
expressApp.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
expressApp.listen(3004, () => {
  console.log("📘 Swagger UI available at http://localhost:3004/docs");
});

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a basic message confirming the service is live
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello Hono auth! 🚀"
 */
app.get("/", (c) => c.text("Hello Hono auth! 🚀"));

/**
 * @openapi
 * /auth/sign-in:
 *   get:
 *     summary: Sign in endpoint
 *     description: Fetches the first user in the database (mock login)
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: No user found
 *       500:
 *         description: Internal server error
 */
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

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Hono auth is running on http://localhost:${port}`);
  console.log(`📚 Swagger JSON generated at ./swagger.json`);
});
