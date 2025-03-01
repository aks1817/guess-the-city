import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
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
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
