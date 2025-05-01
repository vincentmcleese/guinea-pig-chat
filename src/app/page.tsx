"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import GuineaPigGroup from "@/components/GuineaPigGroup";

export default function Home() {
  const [happiness, setHappiness] = useState(50);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Guinea Pig Chat</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GuineaPigGroup
            onHappinessChange={setHappiness}
            onFeedVeggies={() => {
              // This will trigger the nom nom response in the chat
              console.log("Creating feedVeggies event");
              const event = new CustomEvent("feedVeggies");
              window.dispatchEvent(event);
              console.log("feedVeggies event dispatched");
            }}
          />
          <Chat happiness={happiness} />
        </div>
      </div>
    </main>
  );
}
