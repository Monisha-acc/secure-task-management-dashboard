import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests only from the frontend origin
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Catch-all for undefined routes — must be placed after all valid routes
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
