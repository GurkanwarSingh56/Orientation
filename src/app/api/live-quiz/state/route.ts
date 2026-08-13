import { NextRequest, NextResponse } from 'next/server';
import { getRTDBServer } from '@/lib/firebase/rtdb-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = (searchParams.get('sessionId') || 'TV26').trim().toUpperCase();

    const sessionData = (await getRTDBServer(`liveQuiz/${sessionId}`)) || {};

    // Transform participants map to array if present
    const participantsMap = sessionData.participants || {};
    const participantsList = Object.values(participantsMap) as any[];

    // Recalculate leaderboard dynamically if missing
    let leaderboard = sessionData.leaderboard || [];
    if (participantsList.length > 0 && leaderboard.length === 0) {
      participantsList.sort((a, b) => (b.currentScore || 0) - (a.currentScore || 0));
      leaderboard = participantsList.map((p, idx) => ({
        rank: idx + 1,
        participantId: p.participantId,
        displayName: p.displayName || 'Student',
        score: p.currentScore || 0,
        answeredCount: p.answeredCount || 0,
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        status: sessionData.status || 'lobby',
        domain: sessionData.domain || 'cybersecurity',
        domainTitle: sessionData.domainTitle || 'Cybersecurity',
        currentQuestion: sessionData.currentQuestion ?? 0,
        questionStartedAt: sessionData.questionStartedAt ?? null,
        questionDuration: sessionData.questionDuration ?? 30,
        participants: participantsMap,
        leaderboard,
      },
    });
  } catch (error: any) {
    console.error('Fetch live state error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
