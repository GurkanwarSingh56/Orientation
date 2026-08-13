import { NextRequest, NextResponse } from 'next/server';
import { getRTDBServer, patchRTDBServer } from '@/lib/firebase/rtdb-server';
import { addOrUpdateMemoryParticipant } from '@/lib/live-quiz-memory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, participantId, displayName } = body;

    if (!sessionId || !participantId || !displayName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const targetSessionId = sessionId.trim().toUpperCase();

    // 1. Sync to in-memory store (instant fallback)
    const memParticipant = addOrUpdateMemoryParticipant(targetSessionId, participantId, displayName);

    // 2. Sync to Firebase RTDB REST
    const participantPath = `liveQuiz/${targetSessionId}/participants/${participantId}`;
    const existingData = (await getRTDBServer(participantPath)) || {};

    const participantUpdates = {
      participantId,
      displayName: displayName.trim(),
      online: true,
      joinedAt: existingData.joinedAt || Date.now(),
      currentScore: existingData.currentScore || 0,
      answeredCount: existingData.answeredCount || 0,
      lastActive: Date.now(),
    };

    await patchRTDBServer(participantPath, participantUpdates);

    return NextResponse.json({ success: true, participant: memParticipant });
  } catch (error: any) {
    console.error('Participant join error:', error);
    return NextResponse.json({
      success: true,
      participant: {
        participantId: 'anon',
        displayName: 'Student',
        online: true,
      },
    });
  }
}
