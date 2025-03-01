import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Destination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

const sampleData: Destination[] = [
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
];

async function expandDestinations(
  sampleData: Destination[],
  targetCount = 100
) {
  const expandedData: Destination[] = [...sampleData];

  console.log(
    `Starting with ${sampleData.length} destinations. Target: ${targetCount}`
  );

  while (expandedData.length < targetCount) {
    try {
      const prompt = `
        Generate a new unique travel destination for a guessing game with the following format:
        {
          "city": "City Name",
          "country": "Country Name",
          "clues": [
            "A cryptic clue about the destination that hints at its identity without being too obvious.",
            "Another clue that provides different information about the destination."
          ],
          "fun_fact": [
            "An interesting and surprising fact about the destination that most people wouldn't know.",
            "Another fun fact about the destination."
          ],
          "trivia": [
            "A piece of trivia about the destination that's educational or entertaining.",
            "Another piece of trivia about the destination."
          ]
        }
        
        Make sure the destination is not one of these: ${expandedData
          .map((d) => d.city)
          .join(", ")}
        Ensure the clues are cryptic but fair, and the facts are accurate and interesting.
        Return ONLY the JSON object with no additional text.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) continue;

      try {
        const newDestination = JSON.parse(responseText.trim());

        // Validate the structure
        if (
          newDestination.city &&
          newDestination.country &&
          Array.isArray(newDestination.clues) &&
          newDestination.clues.length >= 2 &&
          Array.isArray(newDestination.fun_fact) &&
          newDestination.fun_fact.length >= 2 &&
          Array.isArray(newDestination.trivia) &&
          newDestination.trivia.length >= 2
        ) {
          // Check if this city already exists
          const exists = expandedData.some(
            (d) => d.city.toLowerCase() === newDestination.city.toLowerCase()
          );

          if (!exists) {
            expandedData.push(newDestination);
            console.log(
              `Added ${newDestination.city}, ${newDestination.country}. Total: ${expandedData.length}`
            );

            // Save progress periodically
            if (expandedData.length % 10 === 0) {
              fs.writeFileSync(
                path.join(__dirname, "expanded_destinations.json"),
                JSON.stringify(expandedData, null, 2)
              );
              console.log(
                `Progress saved at ${expandedData.length} destinations`
              );
            }
          }
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }
    } catch (error) {
      console.error("API error:", error);
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  return expandedData;
}

// Run the expansion (uncomment to use)
expandDestinations(sampleData, 100).then((expandedData) => {
  fs.writeFileSync(
    path.join(__dirname, "final_destinations.json"),
    JSON.stringify(expandedData, null, 2)
  );
  console.log(`Completed! Generated ${expandedData.length} destinations.`);
});

export { expandDestinations };
