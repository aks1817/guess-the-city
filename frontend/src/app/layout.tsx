import type React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "../components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";
import { GameProvider } from "@/contexts/GameContext";
import "../app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Globetrotter Challenge",
  description: "The Ultimate Travel Guessing Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <GameProvider>
            {children}
            <Toaster />
          </GameProvider>
        </UserProvider>
      </body>
    </html>
  );
}
