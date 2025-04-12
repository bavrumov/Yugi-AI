import { Filter } from "bad-words";
import { YGO_SAFE_TERMS } from "./constants";

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

const filter = new Filter(); //  Profanity filter

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
