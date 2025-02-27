'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryForm from '@/components/QueryForm';
import AnimatedResponse from '@/components/AnimatedResponse';

export default function JudgeContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      fetchRuling(queryParam);
    }
  }, [searchParams]);

  const fetchRuling = async (queryText: string) => {
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!res.ok) throw new Error('Failed to fetch ruling');

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (queryText: string) => {
    setQuery(queryText);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('q', queryText);
    window.history.pushState({}, '', url);
    
    await fetchRuling(queryText);
  };

  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">Ask the Judge</h2>
        <QueryForm onSubmit={handleSubmit} isLoading={isLoading} initialQuery={query} />
      </div>
      {/* Add spacing between boxes */}
      {(isLoading || response) && <div className="h-8"></div>}
      {(isLoading || response) && (
        <div className="w-full max-w-2xl">
          {isLoading ? (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ) : (
            <AnimatedResponse response={response} />
          )}
        </div>
      )}
    </div>
  );
}