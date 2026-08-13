import { NextRequest, NextResponse } from 'next/server';
import { rtdb } from '@/lib/firebase/config';
import { ref, set, update, get } from 'firebase/database';
import { DomainSlug } from '@/lib/types/quiz';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId, domain, domainTitle } = body;

    const targetSessionId = (sessionId || 'TV26').toUpperCase();
    const sessionRef = ref(rtdb, `liveQuiz/${targetSessionId}`);

    if (action === 'create') {
      const initialData = {
        sessionId: targetSessionId,
        status: 'lobby',
        domain: domain || 'cybersecurity',
        domainTitle: domainTitle || 'Cybersecurity',
        currentQuestion: 0,
        questionStartedAt: null,
        questionDuration: 30,
        leaderboard: [],
      };
      await set(sessionRef, initialData);
      return NextResponse.json({ success: true, state: initialData });
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
