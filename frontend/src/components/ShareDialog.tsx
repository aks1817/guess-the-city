"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneIcon as WhatsappIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

export function ShareDialog({
  open,
  onOpenChange,
  username,
  score,
}: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const url = `${window.location.origin}/challenge/${username}`;
      setShareUrl(url);
      generateShareImage();
    }
  }, [open, username]);

  const generateShareImage = async () => {
    const shareCard = document.createElement("div");
    shareCard.style.width = "600px";
    shareCard.style.height = "315px";
    shareCard.style.padding = "30px";
    shareCard.style.background =
      "linear-gradient(to bottom right, #c7d2fe, #e0e7ff)";
    shareCard.style.borderRadius = "12px";
    shareCard.style.display = "flex";
    shareCard.style.flexDirection = "column";
    shareCard.style.justifyContent = "center";
    shareCard.style.alignItems = "center";
    shareCard.style.fontFamily = "Arial, sans-serif";

    shareCard.innerHTML = `
      <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">Globetrotter Challenge</h1>
      <p style="font-size: 18px; margin-bottom: 24px;">I challenge you to beat my score!</p>
      <div style="display: flex; gap: 20px; margin-bottom: 24px;">
        <div style="background: white; padding: 16px; border-radius: 8px; text-align: center;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Correct</p>
          <p style="font-size: 24px; font-weight: bold; color: #10b981;">${score.correct}</p>
        </div>
        <div style="background: white; padding: 16px; border-radius: 8px; text-align: center;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Incorrect</p>
          <p style="font-size: 24px; font-weight: bold; color: #ef4444;">${score.incorrect}</p>
        </div>
      </div>
      <p style="font-size: 16px; font-weight: bold;">@${username}</p>
    `;

    document.body.appendChild(shareCard);

    try {
      const canvas = await html2canvas(shareCard);
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
    } catch (error) {
      console.error("Error generating share image:", error);
    }

    document.body.removeChild(shareCard);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends to challenge them.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `I challenge you to beat my score in the Globetrotter Challenge! Play now: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Challenge a Friend</DialogTitle>
          <DialogDescription>
            Share this link with your friends to challenge them to beat your
            score!
          </DialogDescription>
        </DialogHeader>

        {imageUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Challenge card"
              className="rounded-lg border shadow-sm max-w-full h-auto"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" readOnly value={shareUrl} className="w-full" />
          </div>
          <Button size="sm" className="px-3" onClick={copyToClipboard}>
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={shareOnWhatsApp}
          >
            <WhatsappIcon className="h-4 w-4" />
            Share on WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
