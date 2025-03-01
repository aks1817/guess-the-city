"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/app/lib/api";
import { useUser } from "@/contexts/UserContext";

interface Destination {
  id: string;
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

interface GameContextType {
  currentDestination: Destination | null;
  options: Destination[];
  isLoading: boolean;
  error: string | null;
  selectedClues: string[];
  loadNewGame: () => Promise<void>;
  checkAnswer: (selectedCity: string) => boolean;
  getRandomFact: (isCorrect: boolean) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentDestination, setCurrentDestination] =
    useState<Destination | null>(null);
  const [options, setOptions] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClues, setSelectedClues] = useState<string[]>([]);
  const { updateScore } = useUser();

  const loadNewGame = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/game/new");
      const { destination, options } = response.data;

      setCurrentDestination(destination);
      setOptions(options);

      // Select 1-2 random clues
      const numClues = Math.floor(Math.random() * 2) + 1;
      const shuffledClues = [...destination.clues].sort(
        () => 0.5 - Math.random()
      );
      setSelectedClues(shuffledClues.slice(0, numClues));

      setError(null);
    } catch (err) {
      setError("Failed to load game. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = (selectedCity: string) => {
    if (!currentDestination) return false;

    const isCorrect = selectedCity === currentDestination.city;
    updateScore(isCorrect);
    return isCorrect;
  };

  const getRandomFact = (isCorrect: boolean) => {
    if (!currentDestination) return "";

    const factArray = isCorrect
      ? currentDestination.fun_fact
      : currentDestination.trivia;
    const randomIndex = Math.floor(Math.random() * factArray.length);
    return factArray[randomIndex];
  };

  useEffect(() => {
    loadNewGame();
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentDestination,
        options,
        isLoading,
        error,
        selectedClues,
        loadNewGame,
        checkAnswer,
        getRandomFact,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
