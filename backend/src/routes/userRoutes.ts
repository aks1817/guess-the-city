import express from "express";
import {
  loginUser,
  getUserByUsername,
  updateUserScore,
} from "../controllers/userController";

const router = express.Router();

router.post("/login", loginUser);

router.get("/:username", getUserByUsername);

router.put("/:id/score", updateUserScore);

export default router;
