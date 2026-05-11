'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QueryForm from '@/components/QueryForm';
import AnimatedResponse from '@/components/AnimatedResponse';
import StageIndicator, { Stage } from '@/components/StageIndicator';
import { renderWithBold } from '@/lib/renderWithBold';

export default function JudgeContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [cannedResponse, setCannedResponse] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (!queryParam) return;
    setQuery(queryParam);
    const controller = new AbortController();
    fetchStreamingRuling(queryParam, controller.signal);
    return () => controller.abort();
  }, [searchParams]);

  const fetchStreamingRuling = async (queryText: string, signal?: AbortSignal) => {
    // Cancel any in-flight request before starting a new one
    abortRef.current?.abort();
    const controller = signal ? null : new AbortController();
    if (controller) abortRef.current = controller;
    const effectiveSignal = signal ?? controller!.signal;

    setIsLoading(true);
    setCannedResponse('');
    setStreamingText('');
    setStages([]);

    try {
      const res = await fetch('/api/judge-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
        signal: effectiveSignal,
      });

      if (!res.ok || !res.body) throw new Error('Failed to fetch ruling');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hasStages = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split('\n\n');
        buffer = messages.pop() ?? '';

        for (const message of messages) {
          if (!message.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(message.slice(6));

            if (event.type === 'stage') {
              hasStages = true;
              setIsLoading(false);
              setStages((prev) => {
                const updated = prev.map((s) =>
                  s.status === 'active' ? { ...s, status: 'complete' as const } : s
                );
                return [...updated, { id: event.stage, message: event.message, status: 'active' as const }];
              });
            } else if (event.type === 'token') {
              setIsLoading(false);
              if (!hasStages) {
                setCannedResponse(event.content);
              } else {
                setStreamingText((prev) => prev + event.content);
              }
            } else if (event.type === 'complete') {
              setIsLoading(false);
              setStages((prev) =>
                prev.map((s) => s.status === 'active' ? { ...s, status: 'complete' as const } : s)
              );
            } else if (event.type === 'error') {
              setIsLoading(false);
              if (hasStages) {
                setStreamingText(event.message);
              } else {
                setCannedResponse(event.message);
              }
            }
          } catch {
            // Skip malformed SSE event
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Error:', error);
      setCannedResponse('Sorry, there was an error processing your request.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (queryText: string) => {
    setQuery(queryText);
    const url = new URL(window.location.href);
    url.searchParams.set('q', queryText);
    window.history.pushState({}, '', url);
    await fetchStreamingRuling(queryText, undefined);
  };

  const hasResponse = Boolean(cannedResponse || streamingText || stages.length > 0);

  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">Ask the Judge</h2>
        <QueryForm onSubmit={handleSubmit} isLoading={isLoading} initialQuery={query} />
      </div>
      {(isLoading || hasResponse) && <div className="h-8"></div>}
      {(isLoading || hasResponse) && (
        <div className="w-full max-w-2xl">
          {isLoading ? (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ) : cannedResponse ? (
            <AnimatedResponse response={cannedResponse} />
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 shadow-md backdrop-blur-sm">
              {stages.length > 0 && (
                <div className={streamingText ? 'mb-4 pb-4 border-b border-gray-200 dark:border-gray-700' : ''}>
                  <StageIndicator stages={stages} />
                </div>
              )}
              {streamingText && (
                <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                  {renderWithBold(streamingText.trimStart())}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
