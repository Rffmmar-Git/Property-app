import "dotenv/config";

import cors from "cors";
import express from "express";

import routes from "./routes";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

export default app;