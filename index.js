import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import buildingRoutes from "./src/routes/buildingRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});
app.use("/api/bookings", bookingRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/rooms", roomRoutes);

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3000;

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});
