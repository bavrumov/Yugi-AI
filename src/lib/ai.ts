import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import {
  ASH_RESPONSE,
  CARD_EXTRACTION_MODEL,
  CARD_EXTRACTION_PROMPT,
  DEFAULT_CLAUDE_MODEL,
  JUDGE_SYSTEM_PROMPT_v1_2,
  MIRRORJADE_RESPONSE,
  PENDULUM_RESPONSE,
  SOLEMN_RESPONSE,
} from "./constants";
import { fetchMultipleCardTexts } from "./ygoprodeck";
import { isClaudeModel, isDeepseekModel, isGeminiModel } from "./util";

export const JUDGE_SYSTEM_PROMPT = JUDGE_SYSTEM_PROMPT_v1_2;

// Initialize the AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Helper function to prepare model-specific payload
const prepareModelPayload = (modelId: string, systemPrompt: string, query: string) => {
  // Format for Claude models
  if (isClaudeModel()) {
    return JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1500,
      temperature: 0.1, // Add this line to lower output randomness and increase correctness, perfect for /judge
      top_p: 0.9,
      system: systemPrompt,
      messages: [{ role: "user", content: query }]
    });
  }
  // Format for DeepSeek models
  else if (isDeepseekModel()) {
    return JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      max_tokens: 8000, // R1 burns tokens on chain-of-thought before producing content
      temperature: 0.1 // Lowers output randomness and increase correctness, perfect for /judge
    });
  }
  // Format for Google Gemini models, UNUSED
  else if (isGeminiModel()) {
    return JSON.stringify({
      contents: [
        { role: "system", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: query }] }
      ],
      generation_config: {
        max_output_tokens: 1000,
        temperature: 0.2
      }
    });
  }
  
  throw new Error(`Unsupported model: ${modelId}`);
};

// Extract text from model-specific response
const extractResponseText = (modelId: string, responseBody: any) => {
  try {
    if (isClaudeModel()) {
      return JSON.parse(responseBody).content[0].text;
    } else if (isGeminiModel()) {
      return JSON.parse(responseBody).candidates[0].content.parts[0].text;
    } else if (isDeepseekModel()) {
      const msg = JSON.parse(responseBody).choices[0].message;
      return msg.content ?? msg.reasoning_content ?? null;
    }
    
    throw new Error(`Unsupported model response format: ${modelId}`);
  } catch (error) {
    console.error("Error extracting response text:", error);
    return "Sorry, I couldn't process your request. Please try again.";
  }
};

// Four cases for the four default questions, which will respond with the four constant responses
const getConstantResponse = (query: string): string => {
  if (query === "How do I pendulum summon?") {
    return PENDULUM_RESPONSE;
  }
  if (query === "Ash Blossom vs Called by the Grave timing") {
    return ASH_RESPONSE;
  }
  if (query === "Can I chain Solemn Strike to a monster effect?") {
    return SOLEMN_RESPONSE;
  }
  if (query === "Does Mirrorjade's destruction effect trigger when Traptrix Pudica's effect banishes it from the field?") {
    return MIRRORJADE_RESPONSE;
  }
  return "";
};

// Stage 1: Extract canonical card names from the user query via Haiku
export async function extractCardNames(query: string): Promise<string[]> {
  try {
    const payload = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 200,
      temperature: 0,
      system: CARD_EXTRACTION_PROMPT,
      messages: [{ role: "user", content: query }]
    });

    const command = new InvokeModelCommand({
      modelId: CARD_EXTRACTION_MODEL,
      contentType: "application/json",
      accept: "application/json",
      body: payload
    });

    const response = await bedrockClient.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    const raw = JSON.parse(responseBody).content[0].text.trim();
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const cardNames = JSON.parse(text);
    const result = Array.isArray(cardNames) ? cardNames : [];
    console.log("Extracted card names:", result);
    return result;
  } catch (error) {
    console.error("Error extracting card names:", error);
    return []; // Graceful fallback — ruling call proceeds without injection
  }
}

// Get ruling from AI model
export async function getJudgeRuling(query: string): Promise<string> {
  // Check if the query matches one of the four default
  const constantResponse = getConstantResponse(query);
  if (constantResponse) {
      return constantResponse;
  }
  // Otherwise, get the ruling from the model
  try {
    // Stage 1: Extract card names via Haiku
    const cardNames = await extractCardNames(query);

    // Stage 2: Fetch card text from YGOPRODeck (parallel)
    const cardContext = await fetchMultipleCardTexts(cardNames);

    // Stage 3: Build augmented system prompt and call Sonnet
    const modelId = process.env.AI_MODEL || DEFAULT_CLAUDE_MODEL;
    const augmentedSystemPrompt = cardContext
      ? `${JUDGE_SYSTEM_PROMPT}\n\n${cardContext}`
      : JUDGE_SYSTEM_PROMPT;

    const payload = prepareModelPayload(modelId, augmentedSystemPrompt, query);

    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: payload
    });

    const response = await bedrockClient.send(command);

    // Convert the UInt8Array to string
    const responseBody = new TextDecoder().decode(response.body);
    console.log("Model response (first 300 chars):", responseBody.substring(0, 300));

    return extractResponseText(modelId, responseBody);
  } catch (error) {
    console.error("Error getting ruling:", error);
    return "Sorry, I couldn't process your request. Please try again.";
  }

}

// Dummy endpoint, just dumps the request or returns a constant response
export async function getDummyJudgeRuling(query: string): Promise<string> {
  // Check if the query matches one of the four default
  const constantResponse = getConstantResponse(query);
  if (constantResponse) {
    return constantResponse;
  }
  const modelId = process.env.AI_MODEL || DEFAULT_CLAUDE_MODEL;
  // Otherwise, just return the query
  const payload = prepareModelPayload(modelId, JUDGE_SYSTEM_PROMPT, query);
  return payload;
}
