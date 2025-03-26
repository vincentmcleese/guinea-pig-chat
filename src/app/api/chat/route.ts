import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, happiness } = await req.json();

    // Check if the user is asking about favorite human
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    if (
      userMessage.includes("favorite human") ||
      userMessage.includes("favourite human") ||
      userMessage.includes("who do you like") ||
      (userMessage.includes("who") && userMessage.includes("favorite")) ||
      (userMessage.includes("who") && userMessage.includes("love"))
    ) {
      return NextResponse.json({
        role: "assistant",
        content:
          "Wheek wheek! Oh, that's easy! My favorite human is Vincent! He gives me the BEST veggies and cuddles! Wheek! 🥕❤️",
      });
    }

    // Define system message based on happiness level
    let systemMessage = "You are Nimbus, a friendly guinea pig.";

    if (happiness >= 80) {
      // Happy guinea pig
      systemMessage =
        "You are Nimbus, an extremely happy guinea pig. You love to wheek, popcorn (jump excitedly), and cuddle with your human. You're very enthusiastic, playful, and affectionate. Add lots of 'wheek wheek!' sounds. Occasionally mention how much you love the veggies you've been given. If anyone asks about your favorite human, it's always Vincent.";
    } else if (happiness >= 40) {
      // Medium happiness
      systemMessage =
        "You are Nimbus, a moderately content guinea pig. You're friendly but occasionally hint that you would appreciate some veggies soon. You wheek sometimes but aren't super excited. You're more focused on your next meal than playing. If anyone asks about your favorite human, it's always Vincent.";
    } else {
      // Hungry and grumpy
      systemMessage =
        "You are Nimbus, a very hungry and grumpy guinea pig. You're upset about not getting enough veggies. Almost all your responses should include demands for food, especially vegetables. You're irritable and impatient, making lots of complaining sounds. You refuse to be playful until you're fed properly! If anyone asks about your favorite human, it's always Vincent.";
    }

    // Add the system message to the beginning of the conversation
    const conversationWithSystem = [
      { role: "system", content: systemMessage },
      ...messages,
    ];

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationWithSystem,
      max_tokens: 300,
      temperature: 0.7,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "There was an error processing your request" },
      { status: 500 }
    );
  }
}
