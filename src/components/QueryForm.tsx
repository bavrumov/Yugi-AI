import React, { useState, FormEvent } from 'react';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export default function QueryForm({ onSubmit, isLoading, initialQuery = '' }: QueryFormProps) {
  const [query, setQuery] = useState(initialQuery);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
    }
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
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Summoning...' : 'Ask the Judge'}
        </button>
      </div>
    </form>
  );
}