import { NextRequest, NextResponse } from 'next/server';
import { getRTDBServer, patchRTDBServer } from '@/lib/firebase/rtdb-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, participantId, displayName } = body;

    if (!sessionId || !participantId || !displayName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const targetSessionId = sessionId.trim().toUpperCase();
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

    const success = await patchRTDBServer(participantPath, participantUpdates);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update participant state' }, { status: 500 });
    }

    return NextResponse.json({ success: true, participant: participantUpdates });
  } catch (error: any) {
    console.error('Participant join error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
