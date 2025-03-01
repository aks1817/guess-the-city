"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "../../contexts/GameContext";
import { useUser } from "../../contexts/UserContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../components/ui/use-toast";
import { ShareDialog } from "../../components/ShareDialog";
import { FrownIcon, SmileIcon, ShareIcon, RefreshCwIcon } from "lucide-react";
import confetti from "canvas-confetti";

export default function GamePage() {
  const {
    currentDestination,
    options,
    isLoading,
    error,
    selectedClues,
    loadNewGame,
    checkAnswer,
    getRandomFact,
  } = useGame();

  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [fact, setFact] = useState<string>("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleAnswer = (city: string) => {
    if (isCorrect !== null) return;

    const correct = checkAnswer(city);
    setSelectedAnswer(city);
    setIsCorrect(correct);
    setFact(getRandomFact(correct));

    if (correct) {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFact("");
    loadNewGame();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => loadNewGame()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Globetrotter Challenge</h1>
            <p className="text-muted-foreground">
              Guess the destination from the clues!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              Correct: {user?.score.correct || 0}
            </Badge>
            <Badge variant="outline" className="text-red-600">
              Incorrect: {user?.score.incorrect || 0}
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Where am I?</CardTitle>
            <CardDescription>
              Read the clues and guess the destination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              {selectedClues.map((clue, index) => (
                <p key={index} className="mb-2 text-lg">
                  🔍 {clue}
                </p>
              ))}
            </div>

            {isCorrect === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="h-auto py-3 justify-start"
                    onClick={() => handleAnswer(option.city)}
                  >
                    <span className="text-left">
                      {option.city}, {option.country}
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <div
                className={`p-4 rounded-lg ${
                  isCorrect ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <SmileIcon className="text-green-600" />
                      <span className="font-bold text-green-600">Correct!</span>
                    </>
                  ) : (
                    <>
                      <FrownIcon className="text-red-600" />
                      <span className="font-bold text-red-600">
                        Incorrect! The answer was {currentDestination?.city},{" "}
                        {currentDestination?.country}.
                      </span>
                    </>
                  )}
                </div>
                <p className="text-lg">{fact}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {isCorrect !== null && (
              <Button onClick={handleNextQuestion} className="gap-2">
                <RefreshCwIcon className="h-4 w-4" />
                Next Question
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2 ml-auto"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <ShareIcon className="h-4 w-4" />
              Challenge a Friend
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        username={user?.username || ""}
        score={user?.score || { correct: 0, incorrect: 0 }}
      />
    </div>
  );
}
