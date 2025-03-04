import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";

dotenv.config();

const app = express();
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/globetrotter";

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

export default app;
