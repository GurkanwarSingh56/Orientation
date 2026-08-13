import { NextRequest, NextResponse } from 'next/server';
import { ALL_QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';
import { getRTDBServer, patchRTDBServer, putRTDBServer } from '@/lib/firebase/rtdb-server';
import { recordMemoryAnswer, getMemorySession } from '@/lib/live-quiz-memory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, participantId, questionId, selectedOption } = body;

    if (!sessionId || !participantId || !questionId || selectedOption === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const targetSessionId = sessionId.trim().toUpperCase();

    // Master answer validation
    const masterQuestion = ALL_QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!masterQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = masterQuestion.correctAnswer === selectedOption;

    // 1. Sync to in-memory store
    const memRes = recordMemoryAnswer(targetSessionId, participantId, isCorrect);
    const memSession = getMemorySession(targetSessionId);

    // 2. Sync to Firebase RTDB REST
    const participantPath = `liveQuiz/${targetSessionId}/participants/${participantId}`;
    const participantData = (await getRTDBServer(participantPath)) || {};

    const currentScore = (participantData.currentScore || 0) + (isCorrect ? 1 : 0);
    const answeredCount = (participantData.answeredCount || 0) + 1;

    await patchRTDBServer(participantPath, {
      currentScore,
      answeredCount,
      lastActive: Date.now(),
    });

    if (memSession.leaderboard && memSession.leaderboard.length > 0) {
      await putRTDBServer(`liveQuiz/${targetSessionId}/leaderboard`, memSession.leaderboard);
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      explanation: masterQuestion.explanation,
      newScore: memRes.currentScore,
    });
  } catch (error: any) {
    console.error('Server answer evaluation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
