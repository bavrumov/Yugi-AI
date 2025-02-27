'use client';

import { useState } from 'react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import QueryForm from '@/components/QueryForm';
import AnimatedResponse from '@/components/AnimatedResponse';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    
    try {
      // Redirect to judge page with query
      window.location.href = `/judge?q=${encodeURIComponent(queryText)}`;
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, there was an error processing your request.");
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 text-center">{APP_NAME}</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 text-center">
        Instant Yu-Gi-Oh! TCG rulings at your fingertips
      </p>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Ask the Judge</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Get instant rulings on card interactions, timing, and mechanics. Just type your question below.
          </p>
          <QueryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
      
      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Examples</h2>
          <ul className="space-y-2 text-blue-600 dark:text-blue-400">
            <li>
              <Link href="/judge?q=Ash Blossom vs Called by the Grave timing">
                Ash Blossom vs Called by the Grave timing
              </Link>
            </li>
            <li>
              <Link href="/judge?q=Can I chain Solemn Strike to a monster effect?">
                Can I chain Solemn Strike to a monster effect?
              </Link>
            </li>
            <li>
              <Link href="/judge?q=How does Mystic Mine work with link monsters?">
                How does Mystic Mine work with link monsters?
              </Link>
            </li>
            <li>
              <Link href="/judge?q=How do I pendulum summon?">
                How do I pendulum summon?
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}