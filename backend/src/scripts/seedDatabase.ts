import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Destination from "../models/Destination";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

const sampleData = [
  {
    city: "Paris",
    country: "France",
    clues: [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art.",
    ],
    fun_fact: [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules.",
    ],
    trivia: [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia.",
    ],
  },
  {
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming.",
    ],
    fun_fact: [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world.",
    ],
    trivia: [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies.",
    ],
  },
  {
    city: "New York",
    country: "USA",
    clues: [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters.",
    ],
    fun_fact: [
      "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
      "Times Square was once called Longacre Square before being renamed in 1904.",
    ],
    trivia: [
      "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
      "The Empire State Building has its own zip code: 10118.",
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Destination.deleteMany({});
    console.log("Cleared existing destinations");

    const expandedDataPath = path.join(__dirname, "expanded_destinations.json");
    let dataToSeed = sampleData;

    if (fs.existsSync(expandedDataPath)) {
      try {
        const expandedData = JSON.parse(
          fs.readFileSync(expandedDataPath, "utf8")
        );
        if (Array.isArray(expandedData) && expandedData.length > 0) {
          dataToSeed = expandedData;
          console.log(
            `Using expanded dataset with ${expandedData.length} destinations`
          );
        }
      } catch (error) {
        console.error("Error reading expanded data file:", error);
      }
    } else {
      console.log("No expanded data found, using sample data");
    }

    const result = await Destination.insertMany(dataToSeed);
    console.log(`Successfully seeded ${result.length} destinations`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

seedDatabase();
