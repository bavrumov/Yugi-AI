import { MILLENNIUM_ITEMS } from "./constants";

// Get a random Millennium Item for the background
export const getRandomMillenniumItem = (): string => {
  const randomIndex = Math.floor(Math.random() * MILLENNIUM_ITEMS.length);
  return MILLENNIUM_ITEMS[randomIndex];
};