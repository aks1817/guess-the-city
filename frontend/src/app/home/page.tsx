"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { GlobeIcon } from "lucide-react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const { login, isLoading, error } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    await login(username);
    router.push("/game");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
            <GlobeIcon className="text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Globetrotter Challenge
          </CardTitle>
          <CardDescription>The Ultimate Travel Guessing Game</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? "Loading..." : "Start Playing"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
