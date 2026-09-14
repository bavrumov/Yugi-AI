import { NextRequest } from 'next/server';
import { streamJudgeRuling } from '@/lib/ai';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { success } = await checkRateLimit(getClientIp(request));
  if (!success) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }), { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const query: unknown = body?.query;

  if (typeof query !== 'string' || !query) {
    return new Response(JSON.stringify({ error: 'Invalid query parameter' }), { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of streamJudgeRuling(query)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      } catch (error) {
        console.error('Streaming error:', error);
        const errorEvent = { type: 'error', message: 'Streaming failed' };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
