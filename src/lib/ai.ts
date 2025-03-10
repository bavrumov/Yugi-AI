import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { JUDGE_SYSTEM_PROMPT_v1, ASH_RESPONSE, MIRRORJADE_RESPONSE, SOLEMN_RESPONSE, PENDULUM_RESPONSE } from "./constants";

export const JUDGE_SYSTEM_PROMPT = JUDGE_SYSTEM_PROMPT_v1;

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
  if (modelId.includes("anthropic.claude")) {
    return JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      temperature: 0.1, // Add this line to lower output randomness and increase correctness, perfect for /judge
      top_p: 0.9,
      system: systemPrompt,
      messages: [{ role: "user", content: query }]
    });
  } 
  // Format for Google Gemini models, UNUSED
  else if (modelId.includes("google.gemini")) {
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
  // Format for DeepSeek models, UNUSED
  else if (modelId.includes("deepseek")) {
    return JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      max_tokens: 1000,
      temperature: 0.2
    });
  }
  
  throw new Error(`Unsupported model: ${modelId}`);
};

// Extract text from model-specific response
const extractResponseText = (modelId: string, responseBody: any) => {
  try {
    if (modelId.includes("anthropic.claude")) {
      return JSON.parse(responseBody).content[0].text;
    } else if (modelId.includes("google.gemini")) {
      return JSON.parse(responseBody).candidates[0].content.parts[0].text;
    } else if (modelId.includes("deepseek")) {
      return JSON.parse(responseBody).choices[0].message.content;
    }
    
    throw new Error(`Unsupported model response format: ${modelId}`);
  } catch (error) {
    console.error("Error extracting response text:", error);
    return "Sorry, I couldn't process your request. Please try again.";
  }
};

// Get ruling from AI model
export async function getJudgeRuling(query: string): Promise<string> {
  try {
    const modelId = process.env.AI_MODEL || "anthropic.claude-3-sonnet-20240229";
    
    const payload = prepareModelPayload(modelId, JUDGE_SYSTEM_PROMPT, query);
    
    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: payload
    });
    
    const response = await bedrockClient.send(command);
    
    // Convert the UInt8Array to string
    const responseBody = new TextDecoder().decode(response.body);
    
    return extractResponseText(modelId, responseBody);
  } catch (error) {
    console.error("Error getting ruling:", error);
    return "Sorry, I couldn't process your request. Please try again.";
  }

}

// Dummy endpoint, just dumps the request or returns a constant response
export async function getDummyJudgeRuling(query: string): Promise<string> {
    const modelId = process.env.AI_MODEL || "anthropic.claude-3-sonnet-20240229";
    // Four cases for the four default questions, which will response with the four constant responses
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
    // Otherwise, just return the query
    const payload = prepareModelPayload(modelId, JUDGE_SYSTEM_PROMPT, query);
    return payload;
}
