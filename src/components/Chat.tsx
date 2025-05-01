"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Carrot } from "lucide-react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
  speaker?: string;
}

interface ChatProps {
  happiness: number;
}

export default function Chat({ happiness }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Wheek wheek! Hi there! I'm Nimbus, and these are my friends Dr. Stoffels and o͞ki! We're excited to chat with you!",
      speaker: "Nimbus",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keep focus on the input field
  useEffect(() => {
    // Only focus if not loading - prevents focus during loading state
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages]);

  // Define addGroupMessage with useCallback to prevent unnecessary recreations
  const addGroupMessage = useCallback((content: string, speaker?: string) => {
    console.log("Adding message from:", speaker, content);
    setMessages((prev) => [...prev, { role: "assistant", content, speaker }]);
  }, []);

  // Handle veggie feeding event
  useEffect(() => {
    const handleFeedVeggies = () => {
      // Randomly select 1, 2, or all 3 guinea pigs to respond
      const allGuineaPigs = ["Nimbus", "Dr. Stoffels", "o͞ki"];

      // Randomly decide how many guinea pigs will respond (1, 2, or 3)
      const numResponders = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3

      // Shuffle the array to get random guinea pigs
      const shuffled = [...allGuineaPigs].sort(() => 0.5 - Math.random());
      const respondingPigs = shuffled.slice(0, numResponders);

      console.log("Guinea pigs responding to food:", respondingPigs);

      // Have each selected guinea pig say "nom nom nom"
      respondingPigs.forEach((pig) => {
        addGroupMessage("*nom nom nom nom nom nom* 🥕", pig);
      });
    };

    console.log("Setting up feedVeggies event listener");
    window.addEventListener("feedVeggies", handleFeedVeggies);
    return () => {
      console.log("Removing feedVeggies event listener");
      window.removeEventListener("feedVeggies", handleFeedVeggies);
    };
  }, [addGroupMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          happiness,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Split the response into individual messages from each guinea pig
      const messageLines = data.content.split("\n");
      messageLines.forEach((line: string) => {
        const match = line.match(/^\[(.*?)\]\s*(.*)/);
        if (match) {
          addGroupMessage(match[2], match[1]);
        } else {
          addGroupMessage(line, "Nimbus");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      addGroupMessage(
        "Sorry, we had trouble processing that. Could you try again?",
        "Nimbus"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatar = (message: Message) => {
    if (message.role === "user") return "/user.png";

    // Return the correct avatar based on the speaker
    switch (message.speaker) {
      case "Nimbus":
        return "/nimbus.png";
      case "Dr. Stoffels":
        return "/stoffels.png";
      case "o͞ki":
        return "/oki.png";
      default:
        return "/nimbus.png"; // Default fallback
    }
  };

  const getSpeakerName = (message: Message) => {
    if (message.role === "user") return "You";
    return message.speaker || "Nimbus";
  };

  return (
    <Card className="flex flex-col h-[600px] w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {message.role !== "user" && (
                <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                  <Image
                    src={getAvatar(message)}
                    alt={getSpeakerName(message)}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`rounded-lg p-3 break-words ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <div className="text-xs font-semibold mb-1">
                  {getSpeakerName(message)}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Carrot className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                <div className="text-xs font-semibold mb-1">Squeeking...</div>
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
