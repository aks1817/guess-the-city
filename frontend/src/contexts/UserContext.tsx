"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/app/lib/api";

interface User {
  id: string;
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateScore: (correct: boolean) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("/users/login", { username });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setError(null);
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateScore = async (correct: boolean) => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        score: {
          correct: correct ? user.score.correct + 1 : user.score.correct,
          incorrect: correct ? user.score.incorrect : user.score.incorrect + 1,
        },
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      await api.put(`/users/${user.id}/score`, {
        correct: updatedUser.score.correct,
        incorrect: updatedUser.score.incorrect,
      });
    } catch (err) {
      console.error("Failed to update score:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, login, logout, updateScore }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
