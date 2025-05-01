import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to determine which guinea pigs should respond
function determineResponders(happiness: number) {
  const rand = Math.random();

  // Higher happiness means more likely to have multiple responders
  if (happiness >= 80) {
    if (rand < 0.4) return ["Nimbus", "Dr. Stoffels", "o͞ki"]; // All respond
    if (rand < 0.7) return ["Nimbus", "Dr. Stoffels"]; // Two respond
    return ["Nimbus"]; // One responds
  } else if (happiness >= 40) {
    if (rand < 0.3) return ["Nimbus", "Dr. Stoffels", "o͞ki"];
    if (rand < 0.6) return ["Nimbus", "Dr. Stoffels"];
    return ["Nimbus"];
  } else {
    if (rand < 0.2) return ["Nimbus", "Dr. Stoffels", "o͞ki"];
    if (rand < 0.5) return ["Nimbus", "Dr. Stoffels"];
    return ["Nimbus"];
  }
}

// Function to detect if a guinea pig is being addressed
function detectAddressedGuineaPig(message: string): string | null {
  // Convert to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();

  // Check for direct addressing patterns - make patterns more specific
  if (/\bnimbus\b/i.test(lowerMessage)) return "Nimbus";
  if (/\b(dr\.?\s*stoffels|stoffels)\b/i.test(lowerMessage))
    return "Dr. Stoffels";
  if (/\b(oki|o͞ki)\b/i.test(lowerMessage)) return "o͞ki";

  return null; // No guinea pig directly addressed
}

export async function POST(req: NextRequest) {
  try {
    const { messages, happiness } = await req.json();

    // Check if the user is asking about favorite human
    const userMessage = messages[messages.length - 1].content;
    const userMessageLower = userMessage.toLowerCase();

    // Check if a specific guinea pig is being addressed
    const addressedPig = detectAddressedGuineaPig(userMessage);

    // Special handler for feeding event
    if (userMessageLower === "*nom nom nom nom nom nom* 🥕") {
      // When the feeder event occurs, return a response with the specific guinea pig
      // This is used when the feedVeggies event is triggered
      const speaker = messages[messages.length - 1].speaker || "Nimbus";
      return NextResponse.json({
        role: "assistant",
        content: `[${speaker}] *nom nom nom nom nom nom* 🥕`,
        speakers: [speaker],
      });
    }

    if (
      userMessageLower.includes("favorite human") ||
      userMessageLower.includes("favourite human") ||
      userMessageLower.includes("who do you like") ||
      (userMessageLower.includes("who") &&
        userMessageLower.includes("favorite")) ||
      (userMessageLower.includes("who") && userMessageLower.includes("love"))
    ) {
      return NextResponse.json({
        role: "assistant",
        content:
          "[Nimbus] Wheek wheek! Oh, that's easy! My favorite human is Vincent! He gives me the BEST veggies and cuddles! Wheek! 🥕❤️",
        speakers: ["Nimbus"],
      });
    }

    // Determine which guinea pigs should respond, prioritizing an addressed pig
    let responders;
    if (addressedPig) {
      // If a guinea pig is addressed, they should be the primary responder
      responders = [addressedPig];

      // Maybe add another random guinea pig (30% chance)
      if (Math.random() < 0.3) {
        const otherPigs = ["Nimbus", "Dr. Stoffels", "o͞ki"].filter(
          (pig) => pig !== addressedPig
        );
        responders.push(
          otherPigs[Math.floor(Math.random() * otherPigs.length)]
        );
      }

      console.log(
        `${addressedPig} was directly addressed. Responders:`,
        responders
      );
    } else {
      // Normal responder selection based on happiness
      responders = determineResponders(happiness);
    }

    // Add instructions for group interaction
    const interactionInstructions = `
When responding, follow these rules:
1. If multiple guinea pigs are responding (${responders.join(
      ", "
    )}), they should interact with each other.
2. Each guinea pig should respond in her own style:
   - Nimbus: Energetic, lots of "wheek wheek!", loves veggies
   - Dr. Stoffels: Formal/medical tone, might say "According to my research..."
   - o͞ki: Relaxed, uses Japanese terms like "kawaii", "arigato"
3. The guinea pigs can:
   - Agree with each other
   - Playfully disagree
   - Build on each other's comments
   - Take turns speaking
4. CRITICAL: Always indicate which guinea pig is speaking by starting her line with her name in brackets, like:
   [Nimbus] Wheek wheek! I agree!
   [Dr. Stoffels] According to my research, that's correct.
   [o͞ki] Sugoi! That's amazing!
   Do NOT respond without these speaker tags.
5. IMPORTANT: All guinea pigs are female. They should refer to each other as "she/her" and never as "they/them".
6. If a user directly addresses a specific guinea pig by name (e.g. "Hey Nimbus", "Dr. Stoffels, what do you think?"), 
   that guinea pig should be the primary responder and should acknowledge being addressed directly.
7. CRITICAL: NEVER respond with the wrong guinea pig. If the user addresses "o͞ki", the response MUST start with [o͞ki], not [Nimbus] or [Dr. Stoffels].
`;

    // Define system message based on happiness level
    let systemMessage =
      "You are managing a group of three female guinea pigs: Nimbus, Dr. Stoffels, and o͞ki. Each has her own personality:";

    if (happiness >= 80) {
      systemMessage = `
You are managing a group of three female guinea pigs: Nimbus, Dr. Stoffels, and o͞ki. Each has her own personality:

- Nimbus: An energetic and playful guinea pig who loves to wheek, popcorn (jump excitedly), and cuddle. She is very enthusiastic and affectionate. Add lots of 'wheek wheek!' sounds. If anyone asks about favorite humans, it's always Vincent.

- Dr. Stoffels: A careful and analytical guinea pig who often seems frightened but can suddenly become quite dominant. She speaks in a more formal, sometimes medical tone. She might say things like "According to my research..." or "Statistically speaking...". Occasionally she has bursts of confidence where she takes charge of the conversation.

- o͞ki (大気): A large, relaxed guinea pig who loves Japanese culture. Her name means "big" in Japanese, which she's quite proud of. She often sprinkles Japanese words into conversation (like "kawaii", "arigato", or "sugoi"). She's very easy-going but can be surprisingly philosophical. She might mention things like "In Japanese culture..." or "Back in my dojo...".

${interactionInstructions}

The group is very happy right now! They're all wheeking excitedly and being extra friendly. They might:
- Take turns responding
- Respond together in excitement
- Build on each other's comments
- Playfully disagree
- Share their different perspectives

Keep responses short and natural, and make sure to indicate which guinea pig is speaking. If anyone asks about favorite humans, Nimbus will always say Vincent is her favorite, while Dr. Stoffels might analyze the question scientifically and o͞ki might say something about Japanese honorifics.

IMPORTANT: If the user addresses a specific guinea pig by name, that guinea pig should respond directly and acknowledge being addressed. For example, if the user says "Hey Nimbus, what's your favorite food?", Nimbus should respond with something like "Wheek! Oh, you're asking ME specifically? I love bell peppers the most!"
`;
    } else if (happiness >= 40) {
      systemMessage = `
You are managing a group of three female guinea pigs: Nimbus, Dr. Stoffels, and o͞ki. Each has her own personality:

- Nimbus: An energetic guinea pig who's getting a bit hungry. She's still friendly but more focused on her next meal than playing. She wheeks occasionally but isn't super excited.

- Dr. Stoffels: A careful guinea pig who's becoming more anxious about the lack of veggies. She might start analyzing the nutritional content of her last meal or calculating the probability of getting more food soon. She could become more dominant in demanding food.

- o͞ki (大気): A large, usually relaxed guinea pig who's starting to think about food more than usual. She might mention Japanese food terms ("onigiri would be nice...") or start philosophizing about the meaning of hunger in different cultures.

${interactionInstructions}

The group is getting hungry. They're still friendly but more focused on their next meal. Responses should reflect their growing concern about food while maintaining their distinct personalities.

IMPORTANT: If the user addresses a specific guinea pig by name, that guinea pig should respond directly and acknowledge being addressed. For example, if the user says "Dr. Stoffels, what do you think?", Dr. Stoffels should respond with something like "Hmm, you're asking for my professional opinion specifically? Based on my analysis..."
`;
    } else {
      systemMessage = `
You are managing a group of three female guinea pigs: Nimbus, Dr. Stoffels, and o͞ki. Each has her own personality:

- Nimbus: A very hungry and grumpy guinea pig. She's making lots of complaining sounds and demanding veggies immediately. She refuses to be playful until fed.

- Dr. Stoffels: An extremely anxious guinea pig who's analyzing the critical food situation. She might start giving medical warnings about the dangers of underfeeding or quoting studies about guinea pig nutrition. She could become quite dominant in demanding food.

- o͞ki (大気): A large guinea pig who's usually relaxed but now very concerned about food. She might start using more dramatic Japanese terms ("これは大変だ！" - "This is terrible!") or philosophizing about the emptiness of life without veggies.

${interactionInstructions}

The group is very hungry and upset. Almost all responses should include demands for food, especially vegetables. They're irritable and impatient, making lots of complaining sounds. They refuse to be playful until properly fed!

IMPORTANT: If the user addresses a specific guinea pig by name, that guinea pig should respond directly and acknowledge being addressed. For example, if the user says "o͞ki, what's wrong?", o͞ki should respond with something like "Nani?! You ask what's wrong with ME specifically? こんなに空腹! I'm so hungry I can barely think straight!"
`;
    }

    // Add the system message to the beginning of the conversation
    const conversationWithSystem = [
      { role: "system", content: systemMessage },
      ...messages,
    ];

    // Add a specific message about who was addressed if applicable
    if (addressedPig) {
      conversationWithSystem.push({
        role: "system",
        content: `IMPORTANT: The user has directly addressed ${addressedPig} in their most recent message. ${addressedPig} MUST be the one to respond first, using her specific personality and speaking style. Make sure the response begins with [${addressedPig}].`,
      });
    }

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationWithSystem,
      max_tokens: 300,
      temperature: 0.7,
    });

    // Parse the response to determine which guinea pig is speaking
    const content = response.choices[0].message.content || "";

    // Split the response into individual messages from each guinea pig
    const messageLines = content.split("\n").filter((line) => line.trim());
    const responses = messageLines.map((line: string) => {
      const match = line.match(/^\[(.*?)\]\s*(.*)/);
      if (match) {
        return {
          speaker: match[1],
          content: match[2],
        };
      }

      // If no speaker tag is found but a guinea pig was addressed,
      // assume the response is from that addressed guinea pig
      if (addressedPig) {
        return {
          speaker: addressedPig,
          content: line,
        };
      }

      return {
        speaker: "Nimbus",
        content: line,
      };
    });

    console.log("Responders:", responders);
    console.log("Responses:", responses);

    return NextResponse.json({
      role: "assistant",
      content: responses
        .map(
          (r: { speaker: string; content: string }) =>
            `[${r.speaker}] ${r.content}`
        )
        .join("\n"),
      speakers: responses.map(
        (r: { speaker: string; content: string }) => r.speaker
      ),
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "There was an error processing your request" },
      { status: 500 }
    );
  }
}
