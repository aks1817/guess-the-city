import type { Request, Response } from "express";
import User from "../models/User";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }

    let user = await User.findOne({ username });

    if (!user) {
      user = new User({
        username,
        score: { correct: 0, incorrect: 0 },
      });
      await user.save();
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      score: user.score,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      score: user.score,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserScore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { correct, incorrect } = req.body;

    if (typeof correct !== "number" || typeof incorrect !== "number") {
      return res.status(400).json({ message: "Invalid score values" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "score.correct": correct,
          "score.incorrect": incorrect,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      score: user.score,
    });
  } catch (error) {
    console.error("Update score error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
