import { NextRequest, NextResponse } from 'next/server';
import { getRTDBServer } from '@/lib/firebase/rtdb-server';
import { getMemorySession } from '@/lib/live-quiz-memory';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = (searchParams.get('sessionId') || 'TV26').trim().toUpperCase();

    // 1. Get memory session
    const memSession = getMemorySession(sessionId);

    // 2. Try fetching RTDB server session
    const rtdbSession = (await getRTDBServer(`liveQuiz/${sessionId}`)) || {};

    // Merge participant rosters
    const mergedParticipants = {
      ...(memSession.participants || {}),
      ...(rtdbSession.participants || {}),
    };

    const participantsList = Object.values(mergedParticipants) as any[];

    // Calculate leaderboard
    participantsList.sort((a, b) => {
      const scoreA = a.currentScore || 0;
      const scoreB = b.currentScore || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (a.answeredCount || 0) - (b.answeredCount || 0);
    });

    const leaderboard = participantsList.map((p, idx) => ({
      rank: idx + 1,
      participantId: p.participantId,
      displayName: p.displayName || 'Student',
      score: p.currentScore || 0,
      answeredCount: p.answeredCount || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        status: rtdbSession.status || memSession.status || 'LOBBY',
        currentQuestion: rtdbSession.currentQuestion ?? memSession.currentQuestion ?? 0,
        questionStartedAt: rtdbSession.questionStartedAt ?? memSession.questionStartedAt ?? null,
        questionDuration: rtdbSession.questionDuration ?? memSession.questionDuration ?? 30,
        remainingTime: rtdbSession.remainingTime ?? memSession.remainingTime ?? 30,
        participants: mergedParticipants,
        leaderboard,
      },
    });
  } catch (error: any) {
    console.error('Fetch live state error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
