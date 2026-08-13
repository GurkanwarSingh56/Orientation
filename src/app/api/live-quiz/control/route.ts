import { NextRequest, NextResponse } from 'next/server';
import { rtdb } from '@/lib/firebase/config';
import { ref, update, get } from 'firebase/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId, domain, domainTitle } = body;

    const targetSessionId = (sessionId || 'TV26').trim().toUpperCase();
    const sessionRef = ref(rtdb, `liveQuiz/${targetSessionId}`);

    if (action === 'create') {
      const snap = await get(sessionRef);
      const existingData = snap.exists() ? snap.val() : {};

      const sessionUpdates = {
        sessionId: targetSessionId,
        status: existingData.status || 'lobby',
        domain: domain || existingData.domain || 'cybersecurity',
        domainTitle: domainTitle || existingData.domainTitle || 'Cybersecurity',
        currentQuestion: existingData.currentQuestion ?? 0,
        questionStartedAt: existingData.questionStartedAt ?? null,
        questionDuration: 30,
      };

      await update(sessionRef, sessionUpdates);
      return NextResponse.json({ success: true, state: sessionUpdates });
    }

    if (action === 'start') {
      await update(sessionRef, {
        status: 'active',
        currentQuestion: 0,
        questionStartedAt: Date.now(),
      });
      return NextResponse.json({ success: true, status: 'active', currentQuestion: 0 });
    }

    if (action === 'nextQuestion') {
      const snap = await get(sessionRef);
      const current = snap.exists() ? snap.val().currentQuestion || 0 : 0;
      const nextIndex = current + 1;

      if (nextIndex >= 10) {
        await update(sessionRef, {
          status: 'ended',
          questionStartedAt: null,
        });
        return NextResponse.json({ success: true, status: 'ended' });
      } else {
        await update(sessionRef, {
          status: 'active',
          currentQuestion: nextIndex,
          questionStartedAt: Date.now(),
        });
        return NextResponse.json({ success: true, status: 'active', currentQuestion: nextIndex });
      }
    }

    if (action === 'pause') {
      await update(sessionRef, {
        status: 'paused',
      });
      return NextResponse.json({ success: true, status: 'paused' });
    }

    if (action === 'end') {
      await update(sessionRef, {
        status: 'ended',
        questionStartedAt: null,
      });
      return NextResponse.json({ success: true, status: 'ended' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Host control error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
