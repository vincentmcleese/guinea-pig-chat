"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Carrot, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface VeggieMeterProps {
  onHappinessChange: (happiness: number) => void;
  onFeedVeggies?: () => void;
}

export default function VeggieMeter({
  onHappinessChange,
  onFeedVeggies,
}: VeggieMeterProps) {
  const [happiness, setHappiness] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [veggiePos, setVeggiePos] = useState({ x: 0, y: 0 });
  const [showVeggie, setShowVeggie] = useState(false);

  // Automatically decrease happiness over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHappiness((prev) => Math.max(0, prev - 1));
    }, 5000); // Decrease by 1 every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Sync happiness state with parent component
  // This is separate from the actual state update logic
  useEffect(() => {
    // This will run after the component has rendered with the new happiness value
    onHappinessChange(happiness);
  }, [happiness, onHappinessChange]);

  // Feed Nimbus veggies!
  const feedVeggies = (e: React.MouseEvent) => {
    // Get button position for animation
    const buttonRect = e.currentTarget.getBoundingClientRect();

    // Set random position for the flying veggie
    setVeggiePos({
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top,
    });

    // Show and animate the veggie
    setShowVeggie(true);
    setIsAnimating(true);

    // Increase happiness - only update local state here
    setHappiness((prev) => Math.min(100, prev + 10));

    // Notify parent that veggies were fed
    if (onFeedVeggies) {
      onFeedVeggies();
    }

    // Hide the veggie after animation
    setTimeout(() => {
      setShowVeggie(false);
      setIsAnimating(false);
    }, 1000);
  };

  // Determine styling based on happiness level
  const progressClasses = cn(
    "h-6 transition-all duration-300",
    happiness >= 80
      ? "[&>div>div]:bg-green-500"
      : happiness >= 40
      ? "[&>div>div]:bg-yellow-500"
      : "[&>div>div]:bg-red-500"
  );

  // Determine which veggie icon to show
  const VeggieIcon = happiness > 50 ? Carrot : Leaf;

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-xs">
      <h2 className="text-lg font-bold text-center">
        Nimbus&apos;s Veggie Meter
      </h2>

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
            : "Feed me now!"}
        </span>
        <span className="font-mono">{happiness}%</span>
      </div>

      <Button
        onClick={feedVeggies}
        className="bg-green-500 hover:bg-green-600 gap-2 transition-transform duration-200 active:scale-95"
      >
        <Carrot className="h-4 w-4" />
        Feed Veggies
      </Button>
    </div>
  );
}
