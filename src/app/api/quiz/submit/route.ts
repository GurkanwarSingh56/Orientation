import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { ALL_QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';
import { DomainSlug } from '@/lib/types/quiz';
import { FieldValue } from 'firebase-admin/firestore';

// POST: Join session OR submit an answer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'join') {
      return handleJoin(body);
    }

    if (action === 'submit-answer') {
      return handleSubmitAnswer(body);
    }

    if (action === 'finish') {
      return handleFinish(body);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Submit API error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// ---- JOIN ----
async function handleJoin(body: any) {
  const { sessionId, participantId, displayName, domainSlug } = body;

  if (!sessionId || !participantId || !displayName || !domainSlug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getAdminFirestore();
  const sessionRef = db.collection('quizSessions').doc(sessionId);
  const sessionSnap = await sessionRef.get();

  const sessionData = sessionSnap.exists ? sessionSnap.data()! : { status: 'waiting', timerEndsAt: null, eventId: 'default' };

  // Auto-finalize if expired
  if (sessionData.status === 'active' && sessionData.timerEndsAt) {
    const endsAt = new Date(sessionData.timerEndsAt);
    if (new Date() >= endsAt) {
      sessionData.status = 'finished';
      await sessionRef.update({ status: 'finished' });
    }
  }

  if (sessionData.status === 'finished') {
    return NextResponse.json({ error: 'Session has ended' }, { status: 400 });
  }

  // Check if participant already joined
  const participantRef = sessionRef.collection('participants').doc(participantId);
  const existingParticipant = await participantRef.get();

  if (existingParticipant.exists) {
    const pData = existingParticipant.data()!;
    // If the participant belongs to a PREVIOUS event, we treat them as NOT joined for the current event.
    if (pData.eventId === sessionData.eventId) {
      // Already joined — return their current state
      return NextResponse.json({
        joined: true,
        alreadyJoined: true,
        domainSlug: pData.domainSlug,
        totalAnswered: pData.totalAnswered || 0,
        completedAt: pData.completedAt || null,
      });
    }
  }

  // Get the 10 questions for the chosen domain (IDs only, no answers sent to client)
  const domainQuestions = ALL_QUIZ_QUESTIONS
    .filter((q) => q.domain === (domainSlug as DomainSlug))
    .map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      points: q.points,
    }));

  if (domainQuestions.length === 0) {
    return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
  }

  // Create participant document
  await participantRef.set({
    displayName,
    domainSlug,
    eventId: sessionData.eventId || 'default',
    joinedAt: FieldValue.serverTimestamp(),
    answers: {},
    score: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    completedAt: null,
  });

  return NextResponse.json({
    joined: true,
    alreadyJoined: false,
    questions: domainQuestions,
    sessionStatus: sessionData.status,
    timerEndsAt: sessionData.timerEndsAt || null,
  });
}

// ---- SUBMIT ANSWER ----
async function handleSubmitAnswer(body: any) {
  const { sessionId, participantId, questionId, selectedOption } = body;

  if (!sessionId || !participantId || !questionId || selectedOption === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getAdminFirestore();
  const sessionRef = db.collection('quizSessions').doc(sessionId);
  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const sessionData = sessionSnap.data()!;

  // Auto-finalize if expired
  if (sessionData.status === 'active' && sessionData.timerEndsAt) {
    const endsAt = new Date(sessionData.timerEndsAt);
    if (new Date() >= endsAt) {
      sessionData.status = 'finished';
      await sessionRef.update({ status: 'finished' });
    }
  }

  // Check if session is still active
  if (sessionData.status === 'finished') {
    return NextResponse.json({ error: 'Session has ended' }, { status: 400 });
  }

  // Get participant
  const participantRef = sessionRef.collection('participants').doc(participantId);
  const participantSnap = await participantRef.get();

  if (!participantSnap.exists) {
    return NextResponse.json({ error: 'Participant not found. Please rejoin.' }, { status: 404 });
  }

  const pData = participantSnap.data()!;

  // Validate eventId
  if (pData.eventId !== sessionData.eventId) {
    return NextResponse.json({ error: 'Participant not in current event' }, { status: 400 });
  }

  // Check if already answered this question
  if (pData.answers && pData.answers[questionId]) {
    return NextResponse.json({ error: 'Already answered this question', alreadyAnswered: true }, { status: 400 });
  }

  // Check if already completed
  if (pData.completedAt) {
    return NextResponse.json({ error: 'Quiz already completed' }, { status: 400 });
  }

  // Validate answer server-side
  const question = ALL_QUIZ_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
  }

  // Check the participant is answering a question from their chosen domain
  if (question.domain !== pData.domainSlug) {
    return NextResponse.json({ error: 'Question does not belong to your selected topic' }, { status: 400 });
  }

  const isCorrect = selectedOption === question.correctAnswer;
  const pointsEarned = isCorrect ? question.points : 0;

  // Update participant answers atomically
  await participantRef.update({
    [`answers.${questionId}`]: {
      selected: selectedOption,
      answeredAt: new Date().toISOString(),
    },
    totalAnswered: FieldValue.increment(1),
    totalCorrect: FieldValue.increment(isCorrect ? 1 : 0),
    score: FieldValue.increment(pointsEarned),
  });

  return NextResponse.json({
    accepted: true,
    isCorrect,
    pointsEarned,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  });
}

// ---- FINISH (mark participant as completed + update leaderboard) ----
async function handleFinish(body: any) {
  const { sessionId, participantId } = body;

  if (!sessionId || !participantId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = getAdminFirestore();
  const sessionRef = db.collection('quizSessions').doc(sessionId);
  const participantRef = sessionRef.collection('participants').doc(participantId);
  const participantSnap = await participantRef.get();

  if (!participantSnap.exists) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
  }

  const sessionSnap = await sessionRef.get();
  const sessionData = sessionSnap.exists ? sessionSnap.data()! : { status: 'waiting', timerEndsAt: null, eventId: 'default' };

  // Auto-finalize if expired
  if (sessionData.status === 'active' && sessionData.timerEndsAt) {
    const endsAt = new Date(sessionData.timerEndsAt);
    if (new Date() >= endsAt) {
      sessionData.status = 'finished';
      await sessionRef.update({ status: 'finished' });
    }
  }

  const pData = participantSnap.data()!;

  // Validate eventId
  if (pData.eventId !== sessionData.eventId) {
    return NextResponse.json({ error: 'Participant not in current event' }, { status: 400 });
  }

  if (pData.completedAt) {
    return NextResponse.json({ alreadyCompleted: true, score: pData.score, totalCorrect: pData.totalCorrect });
  }

  const now = new Date().toISOString();

  // Mark completed
  await participantRef.update({ completedAt: now });

  // Update leaderboard
  await sessionRef.collection('leaderboard').doc(participantId).set({
    displayName: pData.displayName,
    domainSlug: pData.domainSlug,
    score: pData.score,
    totalCorrect: pData.totalCorrect,
    completedAt: now,
  });

  return NextResponse.json({
    completed: true,
    score: pData.score,
    totalCorrect: pData.totalCorrect,
    totalAnswered: pData.totalAnswered,
  });
}
