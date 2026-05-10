# YugiAI — Yu-Gi-Oh! TCG Rulings Assistant

YugiAI is a fast, AI-powered rulings assistant for the Yu-Gi-Oh! Trading Card Game. Ask any ruling question — card interactions, chain timing, activation windows, summoning conditions — and get a clear, judge-quality answer in seconds.

No account. No setup. Just rulings.

---

## Features

- **Judge-quality rulings** — powered by DeepSeek R1 via AWS Bedrock, a reasoning model that thinks through chain interactions, timing windows, and PSCT before answering
- **Grounded rulings** — a two-stage pipeline first extracts card names from your query (Claude Haiku 4.5), fetches their official effect text from YGOPRODeck, then injects it into the ruling prompt so the model reasons over ground truth, not recalled training data
- **Opening Hand Calculator** — hypergeometric probability calculator for deck building; shows starter open rates, brick-avoidance odds, the "Golden Zone" (≥85% open rate) and "Danger Zone" thresholds across 40–60 card decks for going-first and going-second hands
- **Player shorthand understood** — ask about "Ash", "Imperm", "D-Shifter", or any other common nickname; the model knows what you mean
- **Multi-model support** — runs on DeepSeek R1 (production), Claude Sonnet, or Gemini via AWS Bedrock; switch models via a single env var
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
AI_MODEL=arn:aws:bedrock:us-east-1:YOUR_ACCOUNT_ID:inference-profile/us.deepseek.r1-v1:0
```

> **Tip:** The `AI_MODEL` value controls which Bedrock model is used for rulings. DeepSeek R1 is the current production model. Claude Sonnet and Gemini are also supported — see the Supported Models section below.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supported Models

YugiAI supports any model available through AWS Bedrock. Set the `AI_MODEL` environment variable to switch:

| Model | Bedrock ID | Notes |
|---|---|---|
| DeepSeek R1 **(production)** | `arn:aws:bedrock:REGION:ACCOUNT_ID:inference-profile/us.deepseek.r1-v1:0` | Reasoning model; best quality-to-cost for rulings |
| Claude 3.7 Sonnet | `us.anthropic.claude-3-7-sonnet-20250219-v1:0` | Strong alternative; ~3× more expensive |
| Gemini | *(Bedrock preview ID)* | Experimental |

Claude Haiku 4.5 is always used for card name extraction regardless of the `AI_MODEL` setting — it is not configurable.

---

## Cost Per Ruling (CPR) Analysis

Every ruling query triggers two Bedrock calls: one Haiku 4.5 call for card name extraction, and one DeepSeek R1 call for the ruling itself. The following figures are derived from real AWS billing data and CloudWatch invocation logs (May 2026, 28 rulings).

### Model pricing (AWS Bedrock cross-region inference profile)

| Model | Input | Output |
|---|---|---|
| DeepSeek R1 | $1.35 / 1M tokens | $5.40 / 1M tokens |
| Claude Haiku 4.5 | ~$1.10 / 1M tokens | ~$5.50 / 1M tokens |

### Average tokens per ruling

| Stage | Model | Avg Input Tokens | Avg Output Tokens | Avg Total |
|---|---|---|---|---|
| Card extraction | Haiku 4.5 | 312 | 22 | 334 |
| Ruling | DeepSeek R1 | 1,070 | 969 | 2,039 |
| **Per ruling total** | | **1,382** | **991** | **2,373** |

The R1 output token count includes internal `<think>` reasoning tokens before the final answer — these are billed but not shown to the user.

### Input token composition (DeepSeek R1 calls)

The 1,070 average input tokens are not the user's question — they are overwhelmingly overhead:

| Component | Tokens | % of input | Notes |
|---|---|---|---|
| System prompt (fixed) | ~942 | ~88% | Judge persona, ruling principles, PSCT edge cases, response format |
| Card context (variable) | ~96 | ~9% | Official card text fetched from YGOPRODeck per card mentioned; range 0–220 tokens (0–3 cards) |
| User query | ~32 | ~3% | Avg 129 chars; range 65–227 chars across observed queries |

**System prompt to user query ratio: ~29:1.** The user's question accounts for roughly 3 cents of every dollar spent on input tokens. The fixed system prompt is the dominant cost driver and is identical on every single call.

### Per-ruling cost breakdown

| Stage | Input cost | Output cost | Subtotal |
|---|---|---|---|
| Haiku 4.5 (extraction) | 312 × $1.10/M = $0.000343 | 22 × $5.50/M = $0.000121 | **$0.000464** |
| DeepSeek R1 (ruling) | 1,070 × $1.35/M = $0.001445 | 969 × $5.40/M = $0.005233 | **$0.006678** |
| **Total CPR** | | | **~$0.0071** |

### Scale projections

| Monthly rulings | Estimated monthly cost |
|---|---|
| 28 (current) | ~$0.20 |
| 500 | ~$3.55 |
| 5,000 | ~$35.50 |
| 14,000 | ~$99.40 |

At current traffic the app costs less than a quarter per day.

### Note on prompt caching

Anthropic's Claude models on Bedrock support prompt caching — repeated identical prompt prefixes are stored server-side and re-read at ~10% of the normal input token cost. Since the system prompt is 88% of every R1 input call and is identical on every request, caching it would cut input costs significantly. However, **DeepSeek R1 on Bedrock does not support prompt caching** — it is an Anthropic-only feature. Switching to Claude Haiku 4.5 for rulings and enabling caching would reduce per-ruling cost to ~$0.0042, but at the expense of R1's superior chain-of-thought reasoning quality. DeepSeek R1 remains the production model.

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
