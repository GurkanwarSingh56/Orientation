import { NextRequest, NextResponse } from 'next/server';
import { ALL_QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';
import { rtdb } from '@/lib/firebase/config';
import { ref, get, update, set } from 'firebase/database';

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

    // Fetch participant's current state from RTDB
    const participantRef = ref(rtdb, `liveQuiz/${targetSessionId}/participants/${participantId}`);
    const participantSnap = await get(participantRef);

    let currentScore = 0;
    let answeredCount = 0;
    let displayName = 'Student';

    if (participantSnap.exists()) {
      const data = participantSnap.val();
      currentScore = (data.currentScore || 0) + (isCorrect ? 1 : 0);
      answeredCount = (data.answeredCount || 0) + 1;
      displayName = data.displayName || displayName;
    } else {
      currentScore = isCorrect ? 1 : 0;
      answeredCount = 1;
    }

    // Update participant node in RTDB
    await update(participantRef, {
      currentScore,
      answeredCount,
      lastActive: Date.now(),
    });

    // Recalculate Live Leaderboard server-side
    const allParticipantsRef = ref(rtdb, `liveQuiz/${targetSessionId}/participants`);
    const allParticipantsSnap = await get(allParticipantsRef);

    if (allParticipantsSnap.exists()) {
      const participantsObj = allParticipantsSnap.val();
      const participantsList = Object.values(participantsObj) as any[];

      // Sort by score descending, then answered count ascending
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

      const leaderboardRef = ref(rtdb, `liveQuiz/${targetSessionId}/leaderboard`);
      await set(leaderboardRef, updatedLeaderboard);
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
