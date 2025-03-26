# Guinea Pig Chat with Nimbus

A Next.js app that lets you chat with Nimbus, a friendly guinea pig with a love for veggies!

## Features

- 🐹 Chat with Nimbus the guinea pig using OpenAI's GPT model
- 🥕 Feed Nimbus veggies to keep her happy
- 🌿 Nimbus's mood and responses change based on her happiness level
- 🎮 Fun and interactive UI with veggie animations

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

- **Chat Interface**: Lets you send messages to Nimbus
- **Veggie Meter**: Shows Nimbus's happiness level
  - Feed Nimbus veggies by clicking the "Feed Veggies" button
  - Happiness decreases over time, so keep feeding!
- **Nimbus's Responses**:
  - **Very Happy (80-100%)**: Enthusiastic, playful, lots of "wheeks" and "popcorns"
  - **Getting Hungry (40-79%)**: Friendlier but hints at wanting more veggies
  - **Hungry/Grumpy (0-39%)**: Demands food, very irritable!

## Technologies Used

- Next.js 15
- React 19
- Tailwind CSS
- OpenAI API
- TypeScript

## License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
