import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import fs from "fs";
import yaml from "yaml";

const port = 3002;
const app = new Hono();

app.use("*", cors());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Service",
      version: "1.0.0",
      description: "API service for user management",
    },
    servers: [
      {
        url: "http://localhost:3002",
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
expressApp.listen(3003, () => {
  console.log("📘 Swagger UI available at http://localhost:3003/docs");
});

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple greeting message
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello Hono API! 🚀"
 */
app.get("/", (c) => c.text("Hello Hono API! 🚀"));

/**
 * @openapi
 * /api/me:
 *   get:
 *     summary: Get current user information
 *     description: Fetches user info from auth service
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       500:
 *         description: Error
 */
app.get("/api/me", async (c) => {
  try {
    const res = await fetch("http://auth:3001/auth/sign-in");
    const authData = await res.json();

    return c.json({ user: authData.user });
  } catch (error) {
    return c.json({ error: "Auth service unavailable" }, 500);
  }
});

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Hono API running at http://localhost:${port}`);
  console.log(`📚 Swagger JSON written to ./swagger.json`);
});
