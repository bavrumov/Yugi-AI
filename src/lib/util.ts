import { Filter } from "bad-words";
import { DEFAULT_CLAUDE_MODEL, YGO_SAFE_TERMS } from "./constants";

// Model type constants initialized from environment variables
const CURRENT_MODEL = process.env.AI_MODEL || DEFAULT_CLAUDE_MODEL;

const ENV = {
    PROD: "PROD",
    DEV: "DEV"
};

// Remove potentially harmful characters from user input
export const sanitizeInput = (input: string) => {
    return input
        .replace(/[<>;"']/g, '') 
        .trim();
};

//  Profanity filter and helper method
const filter = new Filter(); 

export const containsProfanity = (input: string): boolean => {
    const words = input.toLowerCase().split(/\s+/);
    return words.some((word) => {
      const cleanWord = word.replace(/[^a-z0-9]/gi, ''); // remove punctuation
      return !YGO_SAFE_TERMS.includes(cleanWord) && filter.isProfane(cleanWord);
    })
};

export const isProdEnv = () => {
    return process.env.ENV === ENV.PROD;
};

export const isDevEnv = () => {
    return process.env.ENV === ENV.DEV
};

// Model type utility functions
export const isClaudeModel = () => {
    return CURRENT_MODEL.includes("anthropic.claude");
};

export const isDeepseekModel = () => {
    return CURRENT_MODEL.includes("deepseek");
};

export const isGeminiModel = () => {
    return CURRENT_MODEL.includes("google.gemini");
};
