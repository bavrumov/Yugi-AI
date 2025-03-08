'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryForm from '@/components/QueryForm';
import AnimatedResponse from '@/components/AnimatedResponse';
import { responseCache } from '@/lib/cache';

interface ResponseEntry {
  query: string;
  response: string;
  timestamp: number;
}

export default function JudgeContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
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
      // Check cache first
      const cachedResponse = responseCache.get(queryText);
      if (cachedResponse) {
        // Add response to the stack
        setResponses(prev => [{
          query: cachedResponse.query,
          response: cachedResponse.response,
          timestamp: Date.now()
        }, ...prev]);
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!res.ok) throw new Error('Failed to fetch ruling');

      const data = await res.json();
      
      // Cache the response
      responseCache.set(queryText, data.response);
      
      // Add response to the stack
      setResponses(prev => [{
        query: queryText,
        response: data.response,
        timestamp: Date.now()
      }, ...prev]);
    } catch (error) {
      console.error("Error:", error);
      setResponses(prev => [{
        query: queryText,
        response: "Sorry, there was an error processing your request.",
        timestamp: Date.now()
      }, ...prev]);
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
      {(isLoading || responses.length > 0) && <div className="h-8"></div>}
      <div className="w-full max-w-2xl space-y-4">
        {isLoading && (
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        )}
        {responses.map((entry) => (
          <AnimatedResponse
            key={entry.timestamp}
            query={entry.query}
            response={entry.response}
          />
        ))}
      </div>
    </div>
  );
}
