export const APP_NAME = "YugiAI";
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
CONFIDENCE: Provide a confidence percentage for how sure you are that this ruling is correct 

For common misconceptions, be sure to clarify:
- The difference between negating activations vs negating effects
- Chain blocking mechanics
- Face-down banished card interactions
- Quick effect timing and trigger windows
- Continuous effects and their interactions

Explain the ruling as if speaking to a player at a tournament who needs a clear, accurate answer quickly.`;

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



export const PENDULUM_RESPONSE = `# RULING
To Pendulum Summon, place Pendulum Monsters in your Pendulum Zones, then once per turn during your Main Phase, you can Special Summon monsters from your hand and/or face-up Extra Deck whose Levels are between your Pendulum Scales.

# EXPLANATION
Pendulum Summoning requires:
1. Having Pendulum Monsters in both your left and right Pendulum Zones with different Pendulum Scale values
2. During your Main Phase 1 or 2, you can Pendulum Summon monsters whose Levels are between (but not equal to) your Pendulum Scales
3. You can summon multiple monsters simultaneously from your hand and/or face-up Pendulum Monsters from your Extra Deck
4. Pendulum Monsters that would be sent from the field to the GY are placed face-up in your Extra Deck instead
5. You can only Pendulum Summon once per turn

Remember that Pendulum Monsters from the Extra Deck must be summoned to either the Extra Monster Zone or a zone a Link Monster points to.

# CONFIDENCE
100%`;

export const PENDULUM_RESPONSE_JSON = {
  "RULING": "To Pendulum Summon, place Pendulum Monsters in your Pendulum Zones, then once per turn during your Main Phase, you can Pendulum Summon monsters from your hand and/or face-up Extra Deck whose Levels are between your Pendulum Scales.",
  "EXPLANATION": "First, set up your Pendulum Scales by placing Pendulum Monsters in your leftmost and rightmost Spell & Trap Zones (which become Pendulum Zones). The blue number on each Pendulum Monster represents its Pendulum Scale. During your Main Phase, you can declare a Pendulum Summon to Special Summon any number of monsters from your hand and/or face-up Pendulum Monsters from your Extra Deck whose Levels are between (but not equal to) your Pendulum Scales. For example, with scales of 1 and 8, you can summon monsters with Levels 2 through 7.",
  "CONFIDENCE": "100%"
}

export const ASH_RESPONSE = `# RULING
If Called by the Grave is chained to Ash Blossom & Joyous Spring, Ash Blossom's effect will be negated and will not resolve. However, if Called by the Grave is activated before Ash Blossom is activated (not as a direct chain), then Ash Blossom cannot be activated at all while Called by the Grave's effect is applying.

# EXPLANATION
Called by the Grave has two distinct effects: it negates the activated effects of the targeted monster, and it prevents the activation of effects of monsters with the same name. If Called by the Grave is chained directly to Ash Blossom (Chain Link 2 to Ash's Chain Link 1), it will negate Ash's effect when the chain resolves. If Called by the Grave was activated in a previous chain and successfully resolved (targeting Ash Blossom in the GY), then its lingering effect prevents the player from activating any Ash Blossom effects for the rest of that turn.

# CONFIDENCE
100%`;

export const ASH_RESPONSE_JSON = {
  "RULING": "If Called by the Grave is chained to Ash Blossom & Joyous Spring, it will negate Ash's effect. However, if Called by the Grave is activated before Ash Blossom is activated, then Ash can still be activated and its effect will resolve normally.",
  "EXPLANATION": "Called by the Grave negates the effects of the targeted monster with the same name until the end of the next turn. When chained directly to Ash Blossom, Called by targets the Ash in grave (which was sent as cost) and negates its effect when resolving. However, if Called by is activated preemptively (before Ash is activated), then Ash can still be activated later in the turn. This is because Called by only negates effects of monsters that are already in the GY when Called by resolves, not monsters that will be sent to the GY later.",
  "CONFIDENCE": "100%"
}

export const SOLEMN_RESPONSE = `# RULING
Yes, you can chain Solemn Strike to a monster effect, but only when that monster effect is activated (not when it resolves).

# EXPLANATION
Solemn Strike's text states "When a monster effect is activated, OR when a monster(s) would be Special Summoned: Pay 1500 LP; negate the activation, and if you do, destroy that card." This means Solemn Strike can respond to the activation of any monster effect, whether it's from a monster on the field, in the hand, GY, or banished zone. However, you must chain it directly to the activation of that effect - you cannot wait until the effect resolves to use Solemn Strike. Also note that Solemn Strike negates the activation itself, not just the effect, meaning the entire chain link is treated as if it never happened.

# CONFIDENCE
100%`;

export const SOLEMN_RESPONSE_JSON = {
  "RULING": "Yes, you can chain Solemn Strike to a monster effect, but only when that monster effect is activated, not when it resolves. Solemn Strike can negate the activation of any monster effect and destroy that monster.",
  "EXPLANATION": "Solemn Strike specifically states it can negate the 'activation' of a monster effect. This means you must chain it directly to the monster effect when it's initially activated. Solemn Strike works against monster effects activated on the field, in the hand, GY, or while banished. It's important to note that Solemn Strike negates the activation itself (not just the effect), which means the entire effect is treated as if it never happened, and the chain link is removed entirely.",
  "CONFIDENCE": "100% - This is a fundamental application of Solemn Strike's card text and is consistently ruled this way at all levels of play."
};

export const MIRRORJADE_RESPONSE = `# RULING
Yes, Mirrorjade the Iceblade Dragon's destruction effect will trigger when it is banished from the field by Traptrix Pudica's effect.

# EXPLANATION
Mirrorjade's effect states "If this Fusion Summoned card you control leaves the field: Destroy all monsters on the field during the End Phase of this turn." This is a trigger effect that activates when Mirrorjade leaves the field by any means (including being banished). Being banished by Pudica counts as "leaving the field," which fulfills the activation condition for Mirrorjade's effect. The effect will activate and resolve normally, setting up the field-wide destruction during that turn's End Phase.

# CONFIDENCE
100%`;

export const MIRRORJADE_RESPONSE_JSON = {
  "RULING": "Yes, Mirrorjade the Iceblade Dragon's destruction effect will trigger when it is banished by Traptrix Pudica's effect. The effect activates when Mirrorjade leaves the field, which includes being banished.",
  "EXPLANATION": "Mirrorjade's effect states 'If this Fusion Summoned card you control leaves the field', which is a trigger condition that checks if Mirrorjade is no longer on the field, regardless of where it goes (GY, banished, deck, etc). When Traptrix Pudica banishes Mirrorjade, this condition is satisfied because Mirrorjade has left the field. This is different from effects that specifically require a monster to be sent to the GY. 'Leaves the field' is a broad trigger that includes being banished.",
  "CONFIDENCE": "100%"
}
