import express from "express";
import cors from "cors";

import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorMiddleware);

export default app;