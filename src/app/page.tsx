"use client";

import { useState, useRef } from "react";
import Chat from "@/components/Chat";
import VeggieMeter from "@/components/VeggieMeter";
import { Carrot } from "lucide-react";

export default function Home() {
  const [happiness, setHappiness] = useState(50);
  const chatRef = useRef<{
    addNimbusMessage: (message: string) => void;
  } | null>(null);

  const handleFeedVeggies = () => {
    // Have Nimbus say "nom nom" when fed
    if (chatRef.current) {
      chatRef.current.addNimbusMessage("*nom nom nom nom nom nom* 🥕");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-gray-950 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-2 flex items-center justify-center gap-2">
          <Carrot className="h-8 w-8" />
          Chat with Nimbus!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Talk to Nimbus the guinea pig - but make sure to keep her happy with
          veggies!
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="h-[600px]">
          <Chat happiness={happiness} ref={chatRef} />
        </div>

        <div className="flex justify-center">
          <VeggieMeter
            onHappinessChange={setHappiness}
            onFeedVeggies={handleFeedVeggies}
          />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Guinea pigs need constant access to hay, fresh water, and vegetables
          for a healthy diet!
        </p>
      </footer>
    </div>
  );
}
