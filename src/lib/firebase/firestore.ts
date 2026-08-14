import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ============================================================
// Types for Firestore documents
// ============================================================

export interface FirestoreQuizResult {
  resultId: string;
  attemptId: string;
  domain: string;
  domainTitle: string;
  participantId: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  earnedPoints: number;
  totalPoints: number;
  completedAt: string;
  completedDateFormatted: string;
  completedTimeFormatted: string;
}

export interface FirestoreQuizAttempt {
  attemptId: string;
  domain: string;
  participantId: string;
  studentName: string;
  submissions: { questionId: string; selectedOption: number }[];
  startedAt: string;
  completedAt: string;
}

// ============================================================
// Quiz Results
// ============================================================

export async function getQuizResultById(attemptId: string): Promise<FirestoreQuizResult | null> {
  try {
    const docRef = doc(db, 'quizResults', attemptId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FirestoreQuizResult;
    }
  } catch (err) {
    console.warn('getQuizResultById warning:', err);
  }
  return null;
}

export async function getQuizAttemptById(attemptId: string): Promise<FirestoreQuizAttempt | null> {
  try {
    const docRef = doc(db, 'quizAttempts', attemptId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FirestoreQuizAttempt;
    }
  } catch (err) {
    console.warn('getQuizAttemptById warning:', err);
  }
  return null;
}

export async function getParticipantHistory(participantId: string): Promise<FirestoreQuizResult[]> {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('participantId', '==', participantId),
      orderBy('completedAt', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreQuizResult);
  } catch (err) {
    console.warn('getParticipantHistory warning:', err);
  }
  return [];
}

export async function saveQuizResult(result: FirestoreQuizResult): Promise<void> {
  try {
    await setDoc(doc(db, 'quizResults', result.attemptId), result);
  } catch (err) {
    console.warn('saveQuizResult warning:', err);
  }
}

export async function saveQuizAttempt(attempt: FirestoreQuizAttempt): Promise<void> {
  try {
    await setDoc(doc(db, 'quizAttempts', attempt.attemptId), attempt);
  } catch (err) {
    console.warn('saveQuizAttempt warning:', err);
  }
}

// ============================================================
// Live Quiz Session helpers (client-side Firestore reads)
// ============================================================

export interface LiveQuizSession {
  sessionId: string;
  status: 'waiting' | 'active' | 'finished';
  createdAt: any;
  startedAt: any;
  timerDurationSeconds: number;
  timerEndsAt: any;
  adminPasscode: string;
  totalQuestions: number;
}

export interface LiveParticipant {
  participantId: string;
  displayName: string;
  domainSlug: string;
  joinedAt: any;
  score: number;
  totalCorrect: number;
  totalAnswered: number;
  completedAt: any;
}

export interface LeaderboardEntry {
  participantId: string;
  displayName: string;
  domainSlug: string;
  score: number;
  totalCorrect: number;
  completedAt: any;
}

/**
 * Subscribe to a live quiz session document for real-time updates
 */
export function subscribeToSession(
  sessionId: string,
  callback: (session: LiveQuizSession | null) => void
) {
  const docRef = doc(db, 'quizSessions', sessionId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ sessionId, ...snap.data() } as LiveQuizSession);
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('subscribeToSession error:', err);
      callback(null);
    }
  );
}

/**
 * Subscribe to the leaderboard subcollection for real-time updates
 */
export function subscribeToLeaderboard(
  sessionId: string,
  callback: (entries: LeaderboardEntry[]) => void
) {
  const colRef = collection(db, 'quizSessions', sessionId, 'leaderboard');
  const q = query(colRef, orderBy('score', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      const entries = snap.docs.map((d) => ({
        participantId: d.id,
        ...d.data(),
      })) as LeaderboardEntry[];
      callback(entries);
    },
    (err) => {
      console.warn('subscribeToLeaderboard error:', err);
      callback([]);
    }
  );
}

/**
 * Subscribe to participants subcollection
 */
export function subscribeToParticipants(
  sessionId: string,
  callback: (participants: LiveParticipant[]) => void
) {
  const colRef = collection(db, 'quizSessions', sessionId, 'participants');
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({
        participantId: d.id,
        ...d.data(),
      })) as LiveParticipant[];
      callback(list);
    },
    (err) => {
      console.warn('subscribeToParticipants error:', err);
      callback([]);
    }
  );
}
