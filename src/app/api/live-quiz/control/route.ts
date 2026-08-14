import { NextRequest, NextResponse } from 'next/server';
import { getRTDBServer, patchRTDBServer } from '@/lib/firebase/rtdb-server';
import { getMemorySession, updateMemorySession } from '@/lib/live-quiz-memory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId } = body;

    const targetSessionId = (sessionId || 'TV26').trim().toUpperCase();
    const sessionPath = `liveQuiz/${targetSessionId}`;

    if (action === 'create') {
      const existingData = (await getRTDBServer(sessionPath)) || {};
      const sessionUpdates = {
        sessionId: targetSessionId,
        status: existingData.status || 'LOBBY',
        currentQuestion: existingData.currentQuestion ?? 0,
        questionStartedAt: existingData.questionStartedAt ?? null,
        questionDuration: 30,
        remainingTime: 30,
      };
      updateMemorySession(targetSessionId, sessionUpdates as any);
      await patchRTDBServer(sessionPath, sessionUpdates);
      return NextResponse.json({ success: true, state: sessionUpdates });
    }

    if (action === 'start') {
      const updates = {
        status: 'RUNNING' as const,
        currentQuestion: 0,
        questionStartedAt: Date.now(),
        remainingTime: 30,
      };
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'RUNNING', currentQuestion: 0 });
    }

    if (action === 'nextQuestion') {
      const memSession = getMemorySession(targetSessionId);
      const current = memSession.currentQuestion || 0;
      const nextIndex = current + 1;

      // exactly 70 questions (0 to 69)
      if (nextIndex >= 70) {
        const updates = {
          status: 'FINISHED' as const,
          questionStartedAt: null,
          remainingTime: 0,
        };
        updateMemorySession(targetSessionId, updates);
        await patchRTDBServer(sessionPath, updates);
        return NextResponse.json({ success: true, status: 'FINISHED' });
      } else {
        const updates = {
          status: 'RUNNING' as const,
          currentQuestion: nextIndex,
          questionStartedAt: Date.now(),
          remainingTime: 30,
        };
        updateMemorySession(targetSessionId, updates);
        await patchRTDBServer(sessionPath, updates);
        return NextResponse.json({ success: true, status: 'RUNNING', currentQuestion: nextIndex });
      }
    }

    if (action === 'pause') {
      const memSession = getMemorySession(targetSessionId);
      let rem = memSession.remainingTime || 30;
      
      // Calculate exactly how much time is left before pausing
      if (memSession.status === 'RUNNING' && memSession.questionStartedAt) {
        const elapsedSec = Math.floor((Date.now() - memSession.questionStartedAt) / 1000);
        rem = Math.max(0, memSession.questionDuration - elapsedSec);
      }
      
      const updates = { 
        status: 'PAUSED' as const,
        remainingTime: rem,
        questionStartedAt: null,
      };
      
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'PAUSED', remainingTime: rem });
    }

    if (action === 'resume') {
      const memSession = getMemorySession(targetSessionId);
      const rem = memSession.remainingTime || 30;
      
      // Simulate that the question started (30 - remainingTime) seconds ago
      const simulatedStartTime = Date.now() - ((30 - rem) * 1000);
      
      const updates = {
        status: 'RUNNING' as const,
        questionStartedAt: simulatedStartTime,
      };
      
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'RUNNING' });
    }

    if (action === 'end') {
      const updates = {
        status: 'FINISHED' as const,
        questionStartedAt: null,
        remainingTime: 0,
      };
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'FINISHED' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Host control error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
