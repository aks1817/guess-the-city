import type { Request, Response } from "express";
import Destination from "../models/Destination";

// Get a new game with random destination and options
export const getNewGame = async (req: Request, res: Response) => {
  try {
    // Get random destination
    const count = await Destination.countDocuments();
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);

    if (!destination) {
      return res.status(404).json({ message: "No destinations found" });
    }

    // Get 3 more random destinations for options
    const otherDestinations = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } },
    ]);

    // Combine and shuffle options
    const allOptions = [destination, ...otherDestinations];
    const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

    res.status(200).json({
      destination: {
        id: destination._id,
        city: destination.city,
        country: destination.country,
        clues: destination.clues,
        fun_fact: destination.fun_fact,
        trivia: destination.trivia,
      },
      options: shuffledOptions.map((option) => ({
        id: option._id,
        city: option.city,
        country: option.country,
      })),
    });
  } catch (error) {
    console.error("Get new game error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const seedDestinations = async (req: Request, res: Response) => {
  try {
    const { destinations } = req.body;

    if (!Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({ message: "Invalid destinations data" });
    }

    await Destination.deleteMany({});

    const result = await Destination.insertMany(destinations);

    res.status(201).json({
      message: `Successfully seeded ${result.length} destinations`,
    });
  } catch (error) {
    console.error("Seed destinations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
