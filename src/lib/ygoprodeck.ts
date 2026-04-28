interface YGOCard {
  name: string;
  desc: string;
  type: string;
}

interface YGOApiResponse {
  data: YGOCard[];
}

export async function fetchCardText(cardName: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(cardName);
    // Try exact match first
    let res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encoded}`);

    // Fall back to fuzzy match if exact fails
    if (!res.ok) {
      res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encoded}`);
    }

    if (!res.ok) return null;

    const data: YGOApiResponse = await res.json();
    if (!data.data || data.data.length === 0) return null;

    const card = data.data[0];
    return `${card.name} (${card.type}): ${card.desc}`;
  } catch (error) {
    console.error(`Error fetching card text for "${cardName}":`, error);
    return null;
  }
}

export async function fetchMultipleCardTexts(cardNames: string[]): Promise<string> {
  if (cardNames.length === 0) return "";

  const results = await Promise.all(cardNames.map(fetchCardText));
  const found = results.filter((r): r is string => r !== null);

  if (found.length === 0) return "";

  return `CARD DATA (use as ground truth for this ruling):\n${found.map(c => `- ${c}`).join("\n")}`;
}
