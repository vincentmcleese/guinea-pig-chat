"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Carrot, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GuineaPig {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
}

interface GuineaPigGroupProps {
  onHappinessChange: (happiness: number) => void;
  onFeedVeggies?: () => void;
}

export default function GuineaPigGroup({
  onHappinessChange,
  onFeedVeggies,
}: GuineaPigGroupProps) {
  const [happiness, setHappiness] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [veggiePos, setVeggiePos] = useState({ x: 0, y: 0 });
  const [showVeggie, setShowVeggie] = useState(false);
  const [activePigs, setActivePigs] = useState<GuineaPig[]>([
    {
      id: "nimbus",
      name: "Nimbus",
      avatar: "/nimbus.png",
      isSpeaking: false,
    },
    {
      id: "stoffels",
      name: "Dr. Stoffels",
      avatar: "/stoffels.png",
      isSpeaking: false,
    },
    {
      id: "oki",
      name: "o͞ki",
      avatar: "/oki.png",
      isSpeaking: false,
    },
  ]);

  // Automatically decrease happiness over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHappiness((prev) => Math.max(0, prev - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sync happiness state with parent component
  useEffect(() => {
    onHappinessChange(happiness);
  }, [happiness, onHappinessChange]);

  // Feed all guinea pigs veggies!
  const feedVeggies = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const buttonRect = e.currentTarget.getBoundingClientRect();
    setVeggiePos({
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top,
    });

    setShowVeggie(true);
    setIsAnimating(true);
    setHappiness((prev) => Math.min(100, prev + 10));

    console.log("Feeding veggies, triggering event");
    if (onFeedVeggies) {
      onFeedVeggies();
    }

    // Animate speaking indicators for all pigs
    setActivePigs((pigs) => pigs.map((pig) => ({ ...pig, isSpeaking: true })));
    setTimeout(() => {
      setShowVeggie(false);
      setIsAnimating(false);
      setActivePigs((pigs) =>
        pigs.map((pig) => ({ ...pig, isSpeaking: false }))
      );
    }, 1000);
  };

  const progressClasses = cn(
    "h-6 transition-all duration-300",
    happiness >= 80
      ? "[&>div>div]:bg-green-500"
      : happiness >= 40
      ? "[&>div>div]:bg-yellow-500"
      : "[&>div>div]:bg-red-500"
  );

  const VeggieIcon = happiness > 50 ? Carrot : Leaf;

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-2xl">
      <h2 className="text-lg font-bold text-center">Guinea Pig Group Chat</h2>

      <div className="flex justify-center gap-4 mb-4">
        {activePigs.map((pig) => (
          <div
            key={pig.id}
            className={cn(
              "relative transition-all duration-300",
              pig.isSpeaking ? "scale-110" : "scale-100"
            )}
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
              <Image
                src={pig.avatar}
                alt={pig.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              {pig.name}
            </div>
            {pig.isSpeaking && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Squeeking
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative h-6">
        <Progress value={happiness} className={progressClasses} />
        {showVeggie && (
          <div
            className={`absolute transition-all duration-1000 ${
              isAnimating ? "opacity-0 -translate-y-20" : "opacity-100"
            }`}
            style={{ left: `${veggiePos.x}px`, top: `${veggiePos.y}px` }}
          >
            <VeggieIcon className="text-green-500 h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">
          {happiness >= 80
            ? "Very Happy!"
            : happiness >= 40
            ? "Getting Hungry..."
            : "Feed us now!"}
        </span>
        <span className="font-mono">{happiness}%</span>
      </div>

      {/* Desktop button - hidden on mobile */}
      <Button
        type="button"
        onClick={feedVeggies}
        className="bg-green-500 hover:bg-green-600 gap-2 transition-transform duration-200 active:scale-95 md:flex hidden"
      >
        <Carrot className="h-4 w-4" />
        Feed All Veggies
      </Button>

      {/* Mobile floating button */}
      <button
        aria-label="Feed Veggies"
        onClick={feedVeggies}
        className="md:hidden fixed top-5 right-5 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 active:scale-95 transition-all z-50"
      >
        <span className="text-xl flex items-center">
          🥕<span className="text-lg font-bold ml-1">+</span>
        </span>
      </button>
    </div>
  );
}
