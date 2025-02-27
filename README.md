# YugiAI - Yu-Gi-Oh! TCG Rulings Assistant

A lightweight application that provides instant and accurate Yu-Gi-Oh! Trading Card Game (TCG) rulings through a fast and elegant interface. Players can ask about card interactions and receive clear, judge-like rulings in real-time.

## Features

- **Instant Rulings**: Get immediate answers to your Yu-Gi-Oh! TCG ruling questions
- **Card Recognition**: The app understands player shorthand and nicknames (e.g., "D-Shifter" for Dimension Shifter)
- **Seamless Experience**: No account required - just visit and ask
- **Responsive Design**: Works great on mobile and desktop
- **Dark/Light Mode**: Choose your preferred theme

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or yarn
- AWS account for Bedrock access

### Installation

1. Clone the repository:
   ```bash
   gh repo clone bavrumov/Yugi-AI
   cd Yugi-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your AWS credentials:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AI_MODEL=anthropic.claude-3-sonnet-20240229
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See the included AWS Setup Guide for detailed deployment instructions.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: TypeScript, Next.js API Routes
- **AI Services**: AWS Bedrock (Claude, Gemini, DeepSeek)

## License

This project is licensed under the MIT License - see the LICENSE file for details.