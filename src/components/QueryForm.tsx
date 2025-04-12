import React, { useState, FormEvent, useEffect } from 'react';
import { containsProfanity, isProdEnv, sanitizeInput } from '@/lib/util';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const MAX_CHAR_LIMIT = 250;
const RATE_LIMIT_MS = isProdEnv() ? 5000 : 0; // 5 second cooldown between submissions in prod, 0 in dev

export default function QueryForm({ onSubmit, isLoading, initialQuery = '' }: QueryFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Update query state when initialQuery prop changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const sanitizedQuery = sanitizeInput(query);

    if (!sanitizedQuery) {
      setError('Please enter a valid query.');
      return;
    }
    if (sanitizedQuery.length > MAX_CHAR_LIMIT) {
      setError(`Query must be under ${MAX_CHAR_LIMIT} characters.`);
      return;
    }
    if (containsProfanity(sanitizedQuery)) {
      setError('Inappropriate language is not allowed.');
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      setError(`Please wait ${Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000)}s before submitting again.`);
      return;
    }

    setLastSubmitTime(now);
    setError(null);
    onSubmit(sanitizedQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about a ruling (e.g., 'Ash vs D-Shifter')"
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={MAX_CHAR_LIMIT + 10} // Allows minor extra input but trims on submit
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Summoning...' : 'Ask the Judge'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
