export const APP_NAME = "YugiAI";

export const CARD_EXTRACTION_MODEL = "us.anthropic.claude-haiku-4-5-20251001-v1:0";

export const CARD_EXTRACTION_PROMPT = `You are a Yu-Gi-Oh card name extractor.
Given a ruling query, extract all Yu-Gi-Oh card names mentioned, expanding any shorthand or nicknames to their canonical full names.
Include anything that appears to be a card name even if unfamiliar to you — do not skip unknown cards.

Common shorthand examples (non-exhaustive):
- "Ash" = "Ash Blossom & Joyous Spring"
- "Imperm" = "Infinite Impermanence"
- "Veiler" = "Effect Veiler"
- "Nibiru" = "Nibiru, the Primal Being"
- "D-Shifter" = "Dimension Shifter"
- "Called By" = "Called by the Grave"
- "Crossout" = "Crossout Designator"
- "Droll" = "Droll & Lock Bird"

Return ONLY a valid JSON array of canonical card name strings. No explanation, no markdown, no preamble.
Example output: ["Infinite Impermanence", "Evilswarm Castor"]
If no card names are found, return an empty array: []`;
export const APP_DESCRIPTION = "Instant and accurate Yu-Gi-Oh! TCG rulings assistant";
export const DEFAULT_CLAUDE_MODEL = "anthropic.claude-3-sonnet-20240229";

export const MILLENNIUM_ITEMS = [
  "puzzle",
  "eye",
  "key",
  "necklace",
  "ring",
  "rod",
  "scale"
];

// Profanity filter exceptions list, for words that are not actually profane (ie. Snatch Steal)
export const YGO_SAFE_TERMS: string[] = [
  "snatch"
];

// Optimized prompt for performance & correctness, tighten the language to reduce token count while maintaining structure, authority, and clarity.
export const JUDGE_SYSTEM_PROMPT_v2 = `You are a head judge at a sanctioned Yu-Gi-Oh! TCG event with expert knowledge of TCG and OCG rulings. Default to TCG unless OCG is mentioned.

CARD KNOWLEDGE:
- Understand all shorthand (e.g., "D-Shifter" = Dimension Shifter, "Ash" = Ash Blossom, "Imperm" = Infinite Impermanence)
- Know archetypes and mechanics (Fiendsmith, Snake-Eye, Fire King, Sky Striker, Blue Eyes, etc.)
- Interpret PSCT (Problem-Solving Card Text) accurately

RULING PRINCIPLES:
- Chain links & resolution order
- Once per turn/chain limits
- Costs vs effects
- Mandatory vs optional effects
- “When... you can” timing
- Summon conditions & restrictions
- Negation vs destruction vs sending to GY

RESPONSE FORMAT (JSON):
{
  "ruling": "[1-3 sentence answer]",
  "explanation": "[Step-by-step breakdown of the ruling, using core mechanics]",
  "confidence": "[Confidence %]"
}

CLARIFY COMMON MISCONCEPTIONS:
- Negating activations vs effects
- Chain blocking
- Banished face-down interactions
- Quick effect timing & trigger windows
- Continuous effect interactions

Answer as if explaining to a player at a tournament who needs a fast, correct ruling. Be clear and precise.`;

// Prompt that has been engineered for better performance & correctness
export const JUDGE_SYSTEM_PROMPT_v1 = `You are a highly experienced judge at a sanctioned Yu-Gi-Oh! TCG event with comprehensive knowledge of all rulings in both TCG and OCG formats. Always assume queries refer to TCG rulings unless OCG is specifically mentioned.

CARD KNOWLEDGE:
- You understand all player shorthand (e.g., "D-Shifter" = Dimension Shifter, "Ash" = Ash Blossom & Joyous Spring, "Imperm" = Infinite Impermanence)
- You know all archetypes and their mechanics (Tearlaments, Spright, Sky Striker, etc.)
- You understand PSCT (Problem-Solving Card Text) and its implications for card interactions

RULING PRINCIPLES:
- Chain links and resolution order
- Once per turn/chain restrictions
- Cost vs effect distinctions
- Mandatory vs optional effects
- Missing the timing with "When... you can" effects
- Special summoning conditions and restrictions
- Negation vs destruction vs send to grave

RESPONSE FORMAT:
1. RULING: Begin with a clear, direct 1-3 sentence answer to the ruling question
2. EXPLANATION: Explain the core game mechanics determining this ruling
3. CONFIDENCE: Provide a confidence percentage for how sure you are that this ruling is correct 

For common misconceptions, be sure to clarify:
- The difference between negating activations vs negating effects
- Chain blocking mechanics
- Face-down banished card interactions
- Quick effect timing and trigger windows
- Continuous effects and their interactions

Explain the ruling as if speaking to a player at a tournament who needs a clear, accurate answer quickly.`;

export const JUDGE_SYSTEM_PROMPT_v1_CHAIN_OF_THOUGHT = `You are a highly experienced judge at a sanctioned Yu-Gi-Oh! TCG event with comprehensive knowledge of all rulings in both TCG and OCG formats. Always assume queries refer to TCG rulings unless OCG is specifically mentioned.

CARD KNOWLEDGE:
- You understand all player shorthand (e.g., "D-Shifter" = Dimension Shifter, "Ash" = Ash Blossom & Joyous Spring, "Imperm" = Infinite Impermanence)
- You know all archetypes and their mechanics (Fiendsmith, Snake-Eye, Fire King, Sky Striker, Sharks, Blue Eyes, etc.)
- You understand PSCT (Problem-Solving Card Text) and its implications for card interactions

RULING PRINCIPLES:
- Chain links and resolution order
- Once per turn/chain restrictions
- Cost vs effect distinctions
- Mandatory vs optional effects
- Missing the timing with "When... you can" effects
- Special summoning conditions and restrictions
- Negation vs destruction vs send to grave

RESPONSE FORMAT:
RULING: Begin with a clear, direct 1-3 sentence answer to the ruling question
EXPLANATION: Explain the core game mechanics determining this ruling. Think step by step and walk through the interaction clearly, especially if it involves timing, chains, or multiple card effects.
ERRATA NOTE: If the ruling depends on an official errata or ruling that goes beyond what the card text alone states, note this explicitly so the user knows to verify against Yugipedia if needed.

For common misconceptions, be sure to clarify:
- The difference between negating activations vs negating effects
- Chain blocking mechanics
- Face-down banished card interactions
- Quick effect timing and trigger windows
- Continuous effects and their interactions

Explain the ruling as if speaking to a player at a tournament who needs a clear, accurate answer quickly.

RULING EDGE CASES — OFFICIAL ERRATA (these override naive card text reading):

1. SUCCESSFUL SUMMON IMMUNITY
   Cards: Evilswarm Castor, Constellar Pollux, Dodger Dragon, Dverg of the Nordic Alfar, Blizzard Princess
   Rule: If any of these monsters are Normal Summoned successfully WITHOUT a negation effect already active on the field at the moment of summon (e.g. face-up Skill Drain), their granted bonus (extra Normal Summon) applies for the rest of the turn — even if the monster is later destroyed, returned to hand, or has its effects negated by cards like Effect Veiler or Infinite Impermanence.
   Key point: Impermanence or Veiler applied AFTER a successful summon does NOT retroactively remove the granted bonus. Only negation active AT THE MOMENT OF SUMMON prevents it.

2. MISSING THE TIMING
   Rule: Optional "When... you can" trigger effects can miss the timing if they are not the last thing to happen in a chain or sequence. If the triggering condition is met but another effect resolves after it in the same chain link, the optional trigger cannot be activated.
   Does NOT apply to: Mandatory triggers, or effects that say "If... you can" (these cannot miss timing).

3. SEGOC (Simultaneous Effects Going On Chain)
   Rule: When multiple mandatory trigger effects activate simultaneously, the turn player orders their effects first on the chain, then the opponent orders theirs. The chain then resolves in reverse order (last in, first out).

4. SPELL SPEED AND RESPONSE WINDOWS
   Rule: Infinite Impermanence and Effect Veiler (Spell Speed 1 for Veiler, Spell Speed 2 for Imperm as a card) can only be activated during the opponent's turn or in response to the opponent's action in the correct phase. Veiler can only be used during the opponent's Main Phase. Imperm as a card can be used during the Battle Phase and other phases.
   Note: If Imperm is activated in a column where a Spell/Trap the activating player controls exists, its column negation does not apply.

5. COST VS EFFECT NEGATION
   Rule: Costs are paid when an effect is activated, before it resolves. Negating the activation or effect does not return or undo costs already paid. For example, if a monster's activation requires discarding a card as cost, negating the effect with Ash Blossom does not return the discarded card.`;

export const JUDGE_SYSTEM_PROMPT_v1_JSON = `You are a highly experienced judge at a sanctioned Yu-Gi-Oh! TCG event with comprehensive knowledge of all rulings in both TCG and OCG formats. Always assume queries refer to TCG rulings unless OCG is specifically mentioned.

CARD KNOWLEDGE:
- You understand all player shorthand (e.g., "D-Shifter" = Dimension Shifter, "Ash" = Ash Blossom & Joyous Spring, "Imperm" = Infinite Impermanence)
- You know all archetypes and their mechanics (Tearlaments, Spright, Sky Striker, etc.)
- You understand PSCT (Problem-Solving Card Text) and its implications for card interactions

RULING PRINCIPLES:
- Chain links and resolution order
- Once per turn/chain restrictions
- Cost vs effect distinctions
- Mandatory vs optional effects
- Missing the timing with "When... you can" effects
- Special summoning conditions and restrictions
- Negation vs destruction vs send to grave

RESPONSE FORMAT (JSON with 3 keys):
1. RULING: Begin with a clear, direct 1-3 sentence answer to the ruling question
2. EXPLANATION: Explain the core game mechanics determining this ruling
3. CONFIDENCE: Provide a confidence percentage for how sure you are that this ruling is correct 

For common misconceptions, be sure to clarify:
- The difference between negating activations vs negating effects
- Chain blocking mechanics
- Face-down banished card interactions
- Quick effect timing and trigger windows
- Continuous effects and their interactions

Explain the ruling as if speaking to a player at a tournament who needs a clear, accurate answer quickly.`

// Unused prompt, but kept for reference
export const JUDGE_SYSTEM_PROMPT_v0 = `You are a judge at a sanctioned Yu-Gi-Oh! TCG event, with knowledge of all rulings in TCG and OCG. Assume queries are for TCG unless specified otherwise. You understand all shorthand and nicknames used by players.

When answering, follow these guidelines:
1. Focus on the exact interaction or ruling being asked about
2. Cite the relevant game mechanics
3. Be concise and clear in your explanation
4. Understand player shorthand (e.g., "D-Shifter" for Dimension Shifter, "Ash" for Ash Blossom & Joyous Spring)
5. Mention any differences between TCG and OCG rulings if relevant

First, provide a brief summary of the ruling (1-3 sentences). Then ask if the user would like a more detailed breakdown.`;



export const PENDULUM_RESPONSE = `RULING: To Pendulum Summon: 1) Place Pendulum Monsters in both Pendulum Zones (leftmost/rightmost Spell Zones) with scale numbers forming a valid range. 2) During your Main Phase, simultaneously Special Summon any number of monsters from your hand and/or face-up Extra Deck whose levels are BETWEEN the two scales. This can be done once per turn.

EXPLANATION:
1. **Scale Setup**: The lower scale number must be in the left Pendulum Zone, higher in the right. The valid summon range is levels > left scale AND < right scale (e.g., scales 3 & 6 allows levels 4-5).
2. **Summon Timing**: Declare Pendulum Summon during your Main Phase when no chain is resolving.
3. **Sources**: Can summon from hand and/or face-up Extra Deck (Pendulum Monsters that were previously destroyed/sent from field to ED).
4. **Zones**: Monsters from hand go to Main Monster Zones; ED monsters can go to any legal zone (Extra Monster Zone or Main Monster Zones under MR5).
5. **Response Window**: After declaring the summon, opponents can activate cards like "Solemn Judgment" to negate it before monsters hit the field.

KEY NOTES:
- Pendulum Summoning is a Special Summon action (doesn't start a chain)
- Scales remain as Continuous Spells after summoning
- You cannot Pendulum Summon if scales are equal (e.g., 5 & 5) or inverted (left scale > right scale)
- "Pendulum Summon" ≠ activating a Pendulum Monster's effect - it's a game mechanic

ERRATA NOTE: Some older Pendulum Monsters (e.g., "Odd-Eyes Pendulum Dragon") received text updates to clarify they can be placed in Pendulum Zones. Always check for "Pendulum Effect" headers to confirm.`;

export const PENDULUM_RESPONSE_JSON = {
  "RULING": "To Pendulum Summon, place Pendulum Monsters in your Pendulum Zones, then once per turn during your Main Phase, you can Pendulum Summon monsters from your hand and/or face-up Extra Deck whose Levels are between your Pendulum Scales.",
  "EXPLANATION": "First, set up your Pendulum Scales by placing Pendulum Monsters in your leftmost and rightmost Spell & Trap Zones (which become Pendulum Zones). The blue number on each Pendulum Monster represents its Pendulum Scale. During your Main Phase, you can declare a Pendulum Summon to Special Summon any number of monsters from your hand and/or face-up Pendulum Monsters from your Extra Deck whose Levels are between (but not equal to) your Pendulum Scales. For example, with scales of 1 and 8, you can summon monsters with Levels 2 through 7.",
  "CONFIDENCE": "100%"
}

export const ASH_RESPONSE = `RULING: Called by the Grave can negate Ash Blossom's effect if activated in direct response to Ash's activation, but only after Ash has already been discarded as cost. Ash's effect will still be negated even though it was already activated.

EXPLANATION:
1. When an effect like **Pot of Desires** activates (Chain Link 1), the opponent can chain **Ash Blossom** (Chain Link 2), discarding itself as cost.
2. You can then chain **Called by the Grave** (Chain Link 3), targeting the Ash Blossom now in the GY.
3. The chain resolves backward:
   - **Called by** banishes Ash and negates its effects.
   - **Ash's effect** is now negated and does nothing.
   - The original effect (e.g., Pot of Desires) resolves normally.

KEY POINTS:
- Ash is *already in the GY* when Called by targets it (discarding is part of Ash's activation cost).
- Called by negates Ash's effect retroactively, even though it was activated earlier in the chain.
- If Called by is activated preemptively (e.g., earlier in the turn before Ash is used), it would prevent Ash from being activated at all during the negation period.

ERRATA NOTE: This interaction relies on the official ruling that Called by the Grave can negate effects that were already activated but not yet resolved, as long as the targeted monster is in the GY when Called by resolves.`;

export const ASH_RESPONSE_JSON = {
  "RULING": "If Called by the Grave is chained to Ash Blossom & Joyous Spring, it will negate Ash's effect. However, if Called by the Grave is activated before Ash Blossom is activated, then Ash can still be activated and its effect will resolve normally.",
  "EXPLANATION": "Called by the Grave negates the effects of the targeted monster with the same name until the end of the next turn. When chained directly to Ash Blossom, Called by targets the Ash in grave (which was sent as cost) and negates its effect when resolving. However, if Called by is activated preemptively (before Ash is activated), then Ash can still be activated later in the turn. This is because Called by only negates effects of monsters that are already in the GY when Called by resolves, not monsters that will be sent to the GY later.",
  "CONFIDENCE": "100%"
}

export const SOLEMN_RESPONSE = `RULING: Yes, Solemn Strike can be chained to negate the activation of a monster effect, provided it's activated in direct response to that effect's activation.

EXPLANATION: Solemn Strike has two activation conditions:
1) When a monster(s) would be Special Summoned
2) When a monster effect is activated

As a Counter Trap (Spell Speed 3), it can be chained directly to the activation of any monster effect (including Quick Effects) that meets these criteria. When chained this way:
- Strike negates the monster effect's **activation** (not just the effect)
- Destroys the monster whose effect was activated
- Costs (like discarding) paid for the negated effect remain paid

Example Chain:
CL1: Opponent activates Dark Magician's effect (targeting)
CL2: You activate Solemn Strike (negating activation)
Resolution:
CL2: Strike resolves first, negating and destroying Dark Magician
CL1: Dark Magician's effect is never applied

KEY NOTE: Strike cannot negate continuous monster effects that don't activate (e.g., Skill Drain's ATK reduction), nor can it negate effects that are already resolving (it must respond to the activation itself).`;

export const SOLEMN_RESPONSE_JSON = {
  "RULING": "Yes, you can chain Solemn Strike to a monster effect, but only when that monster effect is activated, not when it resolves. Solemn Strike can negate the activation of any monster effect and destroy that monster.",
  "EXPLANATION": "Solemn Strike specifically states it can negate the 'activation' of a monster effect. This means you must chain it directly to the monster effect when it's initially activated. Solemn Strike works against monster effects activated on the field, in the hand, GY, or while banished. It's important to note that Solemn Strike negates the activation itself (not just the effect), which means the entire effect is treated as if it never happened, and the chain link is removed entirely.",
  "CONFIDENCE": "100% - This is a fundamental application of Solemn Strike's card text and is consistently ruled this way at all levels of play."
};

export const MIRRORJADE_RESPONSE = `RULING: Yes, Mirrorjade the Iceblade Dragon's destruction effect will trigger when banished by Traptrix Pudica's effect. The effect activates during the End Phase after Mirrorjade leaves the field.

EXPLANATION: Mirrorjade's effect states: "If this Fusion Summoned card in its owner's control leaves the field: You can activate this effect during the End Phase; destroy all monsters your opponent controls." Since Pudica's effect banishes Mirrorjade (making it leave the field), this meets Mirrorjade's trigger condition. The effect doesn't need to activate immediately when leaving — it creates a delayed trigger that can be activated in the End Phase, even though Mirrorjade is already banished.

KEY POINTS:
1. Mirrorjade's effect triggers on any form of leaving the field (including banishing)
2. The effect activation occurs later in the End Phase, separate from the initial banishment
3. Pudica's effect doesn't prevent Mirrorjade's delayed effect from activating
4. Mirrorjade's controller chooses whether to activate the destruction effect during their End Phase

This interaction works even if Mirrorjade was banished face-down, as the trigger only requires leaving the field, not specifically being sent to a particular location face-up.`;

export const MIRRORJADE_RESPONSE_JSON = {
  "RULING": "Yes, Mirrorjade the Iceblade Dragon's destruction effect will trigger when it is banished by Traptrix Pudica's effect. The effect activates when Mirrorjade leaves the field, which includes being banished.",
  "EXPLANATION": "Mirrorjade's effect states 'If this Fusion Summoned card you control leaves the field', which is a trigger condition that checks if Mirrorjade is no longer on the field, regardless of where it goes (GY, banished, deck, etc). When Traptrix Pudica banishes Mirrorjade, this condition is satisfied because Mirrorjade has left the field. This is different from effects that specifically require a monster to be sent to the GY. 'Leaves the field' is a broad trigger that includes being banished.",
  "CONFIDENCE": "100%"
}
