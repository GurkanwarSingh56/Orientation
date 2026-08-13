import { NextRequest, NextResponse } from 'next/server';
import { getRTDBServer, patchRTDBServer } from '@/lib/firebase/rtdb-server';
import { getMemorySession, updateMemorySession } from '@/lib/live-quiz-memory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId, domain, domainTitle } = body;

    const targetSessionId = (sessionId || 'TV26').trim().toUpperCase();
    const sessionPath = `liveQuiz/${targetSessionId}`;

    if (action === 'create') {
      const existingData = (await getRTDBServer(sessionPath)) || {};

      const sessionUpdates = {
        sessionId: targetSessionId,
        status: existingData.status || 'lobby',
        domain: domain || existingData.domain || 'cybersecurity',
        domainTitle: domainTitle || existingData.domainTitle || 'Cybersecurity',
        currentQuestion: existingData.currentQuestion ?? 0,
        questionStartedAt: existingData.questionStartedAt ?? null,
        questionDuration: 30,
      };

      updateMemorySession(targetSessionId, sessionUpdates as any);
      await patchRTDBServer(sessionPath, sessionUpdates);
      return NextResponse.json({ success: true, state: sessionUpdates });
    }

    if (action === 'start') {
      const updates = {
        status: 'active' as const,
        currentQuestion: 0,
        questionStartedAt: Date.now(),
      };
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'active', currentQuestion: 0 });
    }

    if (action === 'nextQuestion') {
      const memSession = getMemorySession(targetSessionId);
      const current = memSession.currentQuestion || 0;
      const nextIndex = current + 1;

      if (nextIndex >= 10) {
        const updates = {
          status: 'ended' as const,
          questionStartedAt: null,
        };
        updateMemorySession(targetSessionId, updates);
        await patchRTDBServer(sessionPath, updates);
        return NextResponse.json({ success: true, status: 'ended' });
      } else {
        const updates = {
          status: 'active' as const,
          currentQuestion: nextIndex,
          questionStartedAt: Date.now(),
        };
        updateMemorySession(targetSessionId, updates);
        await patchRTDBServer(sessionPath, updates);
        return NextResponse.json({ success: true, status: 'active', currentQuestion: nextIndex });
      }
    }

    if (action === 'pause') {
      const updates = { status: 'paused' as const };
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'paused' });
    }

    if (action === 'end') {
      const updates = {
        status: 'ended' as const,
        questionStartedAt: null,
      };
      updateMemorySession(targetSessionId, updates);
      await patchRTDBServer(sessionPath, updates);
      return NextResponse.json({ success: true, status: 'ended' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Host control error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
