import { NextResponse } from 'next/server';
import { getSubmissionStats } from '@/lib/submissions';

export async function GET() {
  try {
    const stats = await getSubmissionStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
