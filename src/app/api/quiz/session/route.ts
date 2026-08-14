import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const ADMIN_PASSCODE = 'technovate2026';

// POST: Create or manage a session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, passcode, sessionId, timerDurationSeconds } = body;

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 403 });
    }

    const db = getAdminFirestore();

    // START a session
    if (action === 'start' && sessionId) {
      const sessionRef = db.collection('quizSessions').doc(sessionId);
      const snap = await sessionRef.get();
      const data = snap.exists ? snap.data()! : null;

      if (data && data.status === 'active') {
        const currentEndsAt = data.timerEndsAt ? new Date(data.timerEndsAt) : new Date(0);
        if (new Date() < currentEndsAt) {
          return NextResponse.json({ error: 'Quiz is already live.' }, { status: 400 });
        }
      }

      const duration = timerDurationSeconds || (data?.timerDurationSeconds) || 600;
      const now = new Date();
      const endsAt = new Date(now.getTime() + duration * 1000);

      const updatePayload = {
        status: 'active',
        startedAt: FieldValue.serverTimestamp(),
        timerEndsAt: endsAt.toISOString(),
        timerDurationSeconds: duration,
        totalQuestions: 10,
        eventId: now.getTime().toString(), // Unique ID for this specific round
      };

      if (!snap.exists) {
        await sessionRef.set({ ...updatePayload, createdAt: FieldValue.serverTimestamp() });
      } else {
        await sessionRef.update(updatePayload);
      }

      return NextResponse.json({ sessionId, status: 'active', timerEndsAt: endsAt.toISOString() });
    }

    // END a session
    if (action === 'end' && sessionId) {
      const sessionRef = db.collection('quizSessions').doc(sessionId);
      await sessionRef.update({ status: 'finished' });
      return NextResponse.json({ sessionId, status: 'finished' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Session API error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// GET: Fetch session data (public — no passcode needed)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const snap = await db.collection('quizSessions').doc(sessionId).get();

    if (!snap.exists) {
      return NextResponse.json({ status: 'waiting' });
    }

    let data = snap.data()!;

    // Auto-finalize if expired
    if (data.status === 'active' && data.timerEndsAt) {
      const endsAt = new Date(data.timerEndsAt);
      if (new Date() >= endsAt) {
        data.status = 'finished';
        await db.collection('quizSessions').doc(sessionId).update({ status: 'finished' });
      }
    }

    // Fetch leaderboard
    const leaderboardSnap = await db
      .collection('quizSessions')
      .doc(sessionId)
      .collection('leaderboard')
      .orderBy('score', 'desc')
      .limit(50)
      .get();

    const leaderboard = leaderboardSnap.docs.map((d) => ({
      participantId: d.id,
      ...d.data(),
    }));

    // Fetch participant count
    const participantsSnap = await db
      .collection('quizSessions')
      .doc(sessionId)
      .collection('participants')
      .get();

    return NextResponse.json({
      sessionId,
      status: data.status,
      timerDurationSeconds: data.timerDurationSeconds,
      timerEndsAt: data.timerEndsAt || null,
      startedAt: data.startedAt || null,
      totalQuestions: data.totalQuestions || 10,
      participantCount: participantsSnap.size,
      leaderboard,
    });
  } catch (err: any) {
    console.error('Session GET error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
