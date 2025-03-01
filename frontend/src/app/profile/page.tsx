"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { UserIcon, LogOutIcon, ArrowLeftIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const totalGames = user.score.correct + user.score.incorrect;
  const accuracy =
    totalGames > 0 ? Math.round((user.score.correct / totalGames) * 100) : 0;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <UserIcon className="text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {user.username}
            </CardTitle>
            <CardDescription>Your Globetrotter Profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-2xl font-bold">{totalGames}</p>
                <p className="text-sm text-muted-foreground">Games</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {user.score.correct}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {user.score.incorrect}
                </p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <p className="text-right text-sm mt-1">{accuracy}%</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full gap-2" onClick={logout}>
              <LogOutIcon className="h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
