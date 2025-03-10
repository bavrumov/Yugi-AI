import { ASH_RESPONSE, MIRRORJADE_RESPONSE, PENDULUM_RESPONSE, SOLEMN_RESPONSE } from "./constants";

interface CachedResponse {
  query: string;  // Original query with punctuation
  normalizedQuery: string;  // Lowercase, no punctuation
  response: string;
}

class ResponseCache {
  private cache: Map<string, CachedResponse>;

  constructor(initialEntries?: { query: string; response: string }[]) {
    this.cache = new Map();
    
    if (initialEntries) {
      initialEntries.forEach(({ query, response }) => {
        this.set(query, response);
      });
    }
  }

  private normalizeQuery(query: string): string {
    return query.toLowerCase().replace(/[^\w\s]/g, '').trim();
  }

  set(query: string, response: string) {
    const normalizedQuery = this.normalizeQuery(query);
    this.cache.set(normalizedQuery, {
      query,
      normalizedQuery,
      response
    });
  }

  get(query: string): CachedResponse | undefined {
    const normalizedQuery = this.normalizeQuery(query);
    return this.cache.get(normalizedQuery);
  }

  has(query: string): boolean {
    const normalizedQuery = this.normalizeQuery(query);
    return this.cache.has(normalizedQuery);
  }
}

export const responseCache = new ResponseCache([
  {
    query: "How do I pendulum summon?",
    response: PENDULUM_RESPONSE
  },
  {
    query: "Ash Blossom vs Called by the Grave timing",
    response: ASH_RESPONSE
  },
  {
    query: "Can I chain Solemn Strike to a monster effect?",
    response: SOLEMN_RESPONSE
  },
  {
    query: "Does Mirrorjade's destruction effect trigger when Traptrix Pudica's effect banishes it from the field?",
    response: MIRRORJADE_RESPONSE
  }
]);
