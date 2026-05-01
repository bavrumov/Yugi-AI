# YugiAI — Yu-Gi-Oh! TCG Rulings Assistant

YugiAI is a fast, AI-powered rulings assistant for the Yu-Gi-Oh! Trading Card Game. Ask any ruling question — card interactions, chain timing, activation windows, summoning conditions — and get a clear, judge-quality answer in seconds.

No account. No setup. Just rulings.

---

## Features

- **Judge-quality rulings** — powered by Claude via AWS Bedrock, configured with a chain-of-thought system prompt tuned for accuracy and TCG correctness
- **Grounded rulings** — a two-stage pipeline first extracts card names from your query (Claude Haiku), fetches their official effect text from YGOPRODeck, then injects it into the ruling prompt so the model reasons over ground truth, not recalled training data
- **Opening Hand Calculator** — hypergeometric probability calculator for deck building; shows starter open rates, brick-avoidance odds, the "Golden Zone" (≥85% open rate) and "Danger Zone" thresholds across 40–60 card decks for going-first and going-second hands
- **Player shorthand understood** — ask about "Ash", "Imperm", "D-Shifter", or any other common nickname; the model knows what you mean
- **Multi-model support** — runs on Claude (default), DeepSeek R1, or Gemini via AWS Bedrock; switch models via a single env var
- **Instant answers for common questions** — predefined, verified responses for frequently asked rulings (Pendulum Summon, Ash vs Called by the Grave, Solemn Strike, Mirrorjade) skip the model entirely for zero-latency results
- **Content filtering** — built-in profanity filtering with a YGO-safe terms allowlist (e.g. "Snatch Steal" is not flagged)
- **Dark / light mode** — theme toggle with system preference detection
- **No account required** — open the app and start asking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Provider | AWS Bedrock |
| AI Models | Anthropic Claude · DeepSeek R1 · Gemini (via AWS Bedrock) |
| Analytics | Vercel Analytics + Speed Insights |

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- An AWS account with Bedrock model access enabled

### 1. Clone the repository

```bash
gh repo clone bavrumov/YugiAi
cd YugiAi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AI_MODEL=us.anthropic.claude-3-7-sonnet-20250219-v1:0
```

> **Tip:** The `AI_MODEL` value controls which Bedrock model is used. Claude is the default and recommended option. DeepSeek and Gemini model IDs are also supported.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supported Models

YugiAI supports any model available through AWS Bedrock. Set the `AI_MODEL` environment variable to switch:

| Model | Example ID |
|---|---|
| Claude 3.7 Sonnet (recommended) | `us.anthropic.claude-3-7-sonnet-20250219-v1:0` |
| DeepSeek | `us.deepseek.r1-v1:0` |
| Gemini | *(Bedrock preview ID)* |

---

## Deployment

Build and start a production server:

```bash
npm run build
npm start
```

For full AWS infrastructure setup — IAM user, Bedrock model access, and deployment options (Vercel, Amplify, EC2) — see the [AWS Setup Guide](./AWSSetupGuide.md).

---

## Project Structure

```
src/
├── app/
│   ├── api/judge/        # POST /api/judge — two-stage ruling pipeline
│   ├── calculator/       # Opening Hand Calculator page
│   ├── judge/            # Judge ruling page
│   └── page.tsx          # Landing page
├── components/
│   ├── AnimatedResponse  # Streams ruling text character-by-character
│   ├── HandCalculator    # Hypergeometric probability UI (Recharts, client-only)
│   ├── JudgeContent      # Reads ?q= param, calls /api/judge, renders response
│   ├── QueryForm         # Shared ruling input form
│   └── ThemeToggle       # Dark/light mode switch
└── lib/
    ├── ai.ts             # Bedrock client, two-stage pipeline, payload/response helpers
    ├── constants.ts      # System prompts (v0–v2), card extraction prompt, canned responses
    ├── util.ts           # Model detection, input sanitisation, profanity filter
    ├── ygoprodeck.ts     # YGOPRODeck API client (card text fetcher)
    └── theme.ts          # Theme utilities
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.
