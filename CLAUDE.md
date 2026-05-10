# CLAUDE.md — YugiAI

## Project overview

YugiAI is a Next.js 15 (App Router) application that provides AI-powered Yu-Gi-Oh! TCG rulings and deck-building analytics. It has two main features:

- **Judge** (`/judge`) — ask a ruling question, get a judge-quality answer backed by real card text
- **Opening Hand Calculator** (`/calculator`) — hypergeometric probability charts for starters and bricks

---

## Architecture

### Two-stage ruling pipeline (`src/lib/ai.ts`)

Every ruling query goes through two Bedrock calls before the final response:

1. **Extraction (Haiku)** — `extractCardNames(query)` sends the raw query to `CARD_EXTRACTION_MODEL` (Claude Haiku 4.5) with `CARD_EXTRACTION_PROMPT`. Returns a JSON array of canonical card names. The response may arrive wrapped in markdown fences (` ```json ``` `) even when the prompt forbids it — these are stripped before `JSON.parse`.

2. **Card context fetch** — `fetchMultipleCardTexts(cardNames)` hits the YGOPRODeck API (`https://db.ygoprodeck.com/api/v7/cardinfo.php`) for each card name. Falls back to a fuzzy `fname=` search if exact match fails. Returns a formatted string injected into the main system prompt.

3. **Ruling (main model)** — `getJudgeRuling(query)` calls the model set by `AI_MODEL` with the augmented system prompt and returns the text response.

The four predefined queries (Pendulum Summon, Ash vs Called by, Solemn Strike, Mirrorjade) skip both Bedrock calls entirely and return constant strings from `constants.ts`.

### Dev vs. Prod mode

`ENV=PROD` in `.env.local` routes requests to `getJudgeRuling` (real Bedrock calls).
`ENV=DEV` routes to `getDummyJudgeRuling` (returns the serialised request payload, no Bedrock call).

Card name extraction runs in both modes — the `extractCardNames` log is visible regardless of `ENV`.

---

## Multi-model support

Model selection is controlled by the `AI_MODEL` environment variable. Detection functions in `src/lib/util.ts` use substring matching on `CURRENT_MODEL` (computed once at module load):

| Model family | ID must contain | Payload format | Response field |
|---|---|---|---|
| Claude (Bedrock) | `anthropic.claude` | Claude Messages API | `content[0].text` |
| DeepSeek R1 | `deepseek` | OpenAI-compatible | `choices[0].message.content` |
| Gemini | `google.gemini` | Gemini format | `candidates[0].content.parts[0].text` |

**DeepSeek R1 gotcha:** R1 generates a `<think>` reasoning block before its final answer. `max_tokens` must be large (≥ 8000) or the model exhausts the budget during reasoning and returns `content: null`. A `reasoning_content` fallback is in place in `extractResponseText`.

**Important:** `CURRENT_MODEL` is a module-level constant — it reads `process.env.AI_MODEL` once at startup. Changing `AI_MODEL` at runtime requires a server restart.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `AWS_REGION` | Yes | Bedrock region (e.g. `us-east-1`) |
| `AWS_ACCESS_KEY_ID` | Yes | IAM credentials with Bedrock invoke permissions |
| `AWS_SECRET_ACCESS_KEY` | Yes | IAM credentials |
| `AI_MODEL` | No | Bedrock model ID or inference profile ARN. Defaults to `anthropic.claude-3-sonnet-20240229` |
| `ENV` | No | `PROD` for real Bedrock calls, `DEV` for dummy endpoint |

---

## Key files

| File | Purpose |
|---|---|
| `src/lib/ai.ts` | Bedrock client, two-stage pipeline, model payload/response helpers |
| `src/lib/constants.ts` | System prompts (v0–v2 + chain-of-thought variant), card extraction prompt, predefined responses |
| `src/lib/util.ts` | Input sanitisation, profanity filter, model detection (`isClaudeModel` etc.), env helpers |
| `src/lib/ygoprodeck.ts` | YGOPRODeck API client (`fetchCardText`, `fetchMultipleCardTexts`) |
| `src/app/api/judge/route.ts` | POST handler — routes to real or dummy ruling based on `ENV` |
| `src/components/HandCalculator.tsx` | Hypergeometric calculator UI (Recharts, fully client-side, no API calls) |
| `src/components/JudgeContent.tsx` | Client component — reads `?q=` param, calls `/api/judge`, renders response |

### System prompt versions

`constants.ts` contains several prompt variants; `JUDGE_SYSTEM_PROMPT` in `ai.ts` selects which one is active:

- `v1_2` — **currently active** — adds official errata edge cases (Evilswarm Castor, SEGOC, etc.)

---

## Branch and PR workflow

- **Never commit to `main`/`master`.** Always create a feature branch first.
- Branch naming: `fix/`, `feat/`, `chore/` prefix + kebab-case description.
- After every `gh pr merge`, post a comment: `Merged by Claude Code — model: **claude-sonnet-4-6** — <date EST>`.
- UI changes: run `/front-end-checkout` (cloudflared tunnel for visual review) before opening a PR.

---

## Common pitfalls

- **Haiku JSON fences** — Haiku returns ` ```json\n[...]\n``` ` even when prompted not to. Always strip fences before `JSON.parse` in `extractCardNames`.
- **DeepSeek R1 null content** — see multi-model section above; keep `max_tokens` at 8000+.
- **`isClaudeModel()` uses module-level constant** — if you add a new model family, update both the detection function in `util.ts` and the payload/response branches in `ai.ts`.
- **`maxDuration` must be a static literal** in Next.js route handlers — do not use a variable or expression.
- **Profanity filter** — `YGO_SAFE_TERMS` in `constants.ts` allowlists card names that contain words the filter would otherwise flag (e.g. "Snatch Steal").
