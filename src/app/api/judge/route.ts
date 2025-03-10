import { NextRequest, NextResponse } from 'next/server';
import { getDummyJudgeRuling, getJudgeRuling } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query parameter' },
        { status: 400 }
      );
    }
    
    // Ternary operator to switch between dummy and real model
    const response = process.env.ENV === "DEV" ? await getDummyJudgeRuling(query) : await getJudgeRuling(query);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
