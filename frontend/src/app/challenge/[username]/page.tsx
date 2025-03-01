"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { TrophyIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ChallengerInfo {
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

export default function ChallengeRedirectPage() {
  const { username } = useParams<{ username: string }>();
  const [challenger, setChallenger] = useState<ChallengerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, login } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchChallengerInfo = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/users/${username}`);
        setChallenger(response.data);
      } catch (err) {
        setError("Could not find the challenger. The link might be invalid.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchChallengerInfo();
    }
  }, [username]);

  const handleAcceptChallenge = () => {
    router.push("/game");
  };

  const handleLogin = async (newUsername: string) => {
    await login(newUsername);
    router.push("/game");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !challenger) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Something went wrong. Please try again."}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
            <TrophyIcon className="text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Challenge from {challenger.username}
          </CardTitle>
          <CardDescription>Can you beat their score?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <Badge
                variant="outline"
                className="text-green-600 text-lg px-3 py-1"
              >
                {challenger.score.correct}
              </Badge>
              <p className="text-sm mt-1">Correct</p>
            </div>
            <div className="text-center">
              <Badge
                variant="outline"
                className="text-red-600 text-lg px-3 py-1"
              >
                {challenger.score.incorrect}
              </Badge>
              <p className="text-sm mt-1">Incorrect</p>
            </div>
          </div>

          {user ? (
            <div className="bg-muted p-4 rounded-lg text-center">
              <p>
                You're logged in as{" "}
                <span className="font-bold">{user.username}</span>
              </p>
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-lg text-center">
              <p>You need to create a username to play</p>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full p-2 rounded border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin((e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={user ? handleAcceptChallenge : () => {}}
            disabled={!user}
          >
            Accept Challenge
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
