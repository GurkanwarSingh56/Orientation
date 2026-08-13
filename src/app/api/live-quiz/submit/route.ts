import { NextRequest, NextResponse } from 'next/server';
import { ALL_QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';
import { getRTDBServer, patchRTDBServer, putRTDBServer } from '@/lib/firebase/rtdb-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, participantId, questionId, selectedOption } = body;

    if (!sessionId || !participantId || !questionId || selectedOption === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const targetSessionId = sessionId.trim().toUpperCase();

    // Server-side answer validation against master dataset
    const masterQuestion = ALL_QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!masterQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = masterQuestion.correctAnswer === selectedOption;

    // Fetch participant node via REST
    const participantPath = `liveQuiz/${targetSessionId}/participants/${participantId}`;
    const participantData = (await getRTDBServer(participantPath)) || {};

    const currentScore = (participantData.currentScore || 0) + (isCorrect ? 1 : 0);
    const answeredCount = (participantData.answeredCount || 0) + 1;
    const displayName = participantData.displayName || 'Student';

    // Update participant node
    await patchRTDBServer(participantPath, {
      currentScore,
      answeredCount,
      lastActive: Date.now(),
    });

    // Recalculate Live Leaderboard server-side
    const participantsPath = `liveQuiz/${targetSessionId}/participants`;
    const participantsObj = (await getRTDBServer(participantsPath)) || {};
    const participantsList = Object.values(participantsObj) as any[];

    if (participantsList.length > 0) {
      participantsList.sort((a, b) => {
        const scoreA = a.currentScore || 0;
        const scoreB = b.currentScore || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return (a.answeredCount || 0) - (b.answeredCount || 0);
      });

      const updatedLeaderboard = participantsList.map((p, idx) => ({
        rank: idx + 1,
        participantId: p.participantId,
        displayName: p.displayName || 'Student',
        score: p.currentScore || 0,
        answeredCount: p.answeredCount || 0,
      }));

      await putRTDBServer(`liveQuiz/${targetSessionId}/leaderboard`, updatedLeaderboard);
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      explanation: masterQuestion.explanation,
      newScore: currentScore,
    });
  } catch (error: any) {
    console.error('Server answer evaluation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
