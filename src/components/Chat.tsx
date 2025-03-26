"use client";

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Carrot, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  happiness: number;
}

// Define the interface for the imperative handle
export interface ChatHandle {
  addNimbusMessage: (message: string) => void;
}

const Chat = forwardRef<ChatHandle, ChatProps>(({ happiness }, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Wheek wheek! Hi there, I'm Nimbus the guinea pig! I love veggies and cuddles! What would you like to talk about today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Expose the addNimbusMessage function to parent components
  useImperativeHandle(ref, () => ({
    addNimbusMessage: (message: string) => {
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    },
  }));

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get response from API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          happiness,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Wheek! Something went wrong. Maybe I need more veggies to think clearly!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden border">
      <div className="p-4 border-b flex items-center gap-3 bg-green-50 dark:bg-green-950">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/nimbus.png" alt="Nimbus the Guinea Pig" />
          <AvatarFallback>
            <Carrot className="h-6 w-6 text-green-500" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold">Nimbus the Guinea Pig</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {happiness >= 80
              ? "Very happy and ready to chat!"
              : happiness >= 40
              ? "Getting a bit hungry..."
              : "Really needs some veggies...NOW!"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-tr-none"
                  : "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-tl-none"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/nimbus.png" alt="Nimbus" />
                    <AvatarFallback>
                      <Carrot className="h-4 w-4 text-green-500" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-xs">Nimbus</span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-tl-none">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/nimbus.png" alt="Nimbus" />
                  <AvatarFallback>
                    <Carrot className="h-4 w-4 text-green-500" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-bold text-xs">Nimbus</span>
              </div>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something to Nimbus..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-green-500 hover:bg-green-600"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
});

Chat.displayName = "Chat";

export default Chat;
