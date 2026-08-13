import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  Timestamp,
  FieldValue,
} from 'firebase/firestore';
import { db } from './config';
import { QuizQuestion, QuizSubmission, DomainSlug } from '../types/quiz';

export interface FirestoreParticipant {
  participantId: string;
  displayName: string;
  createdAt: Timestamp | Date | number | FieldValue | any;
  lastActive: Timestamp | Date | number | FieldValue | any;
}

export interface FirestoreQuizAttempt {
  attemptId: string;
  domain: DomainSlug;
  participantId: string;
  studentName: string;
  submissions: QuizSubmission[];
  startedAt: Timestamp | Date | number | string | FieldValue | any;
  completedAt?: Timestamp | Date | number | string | FieldValue | any;
}

export interface FirestoreQuizResult {
  resultId: string;
  attemptId: string;
  domain: DomainSlug;
  domainTitle: string;
  participantId: string;
  studentName: string;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  totalPoints: number;
  earnedPoints: number;
  completedAt: Timestamp | Date | number | string | FieldValue | any;
  completedDateFormatted?: string;
  completedTimeFormatted?: string;
}

/**
 * Save participant profile to Firestore
 */
export async function saveParticipant(participantId: string, displayName: string) {
  try {
    const ref = doc(db, 'participants', participantId);
    await setDoc(
      ref,
      {
        participantId,
        displayName,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore saveParticipant error:', err);
  }
}

/**
 * Complete quiz submission: saves attempt + evaluated result with serverTimestamp
 */
export async function saveCompleteQuizSubmission(
  attemptId: string,
  domain: DomainSlug,
  domainTitle: string,
  participantId: string,
  studentName: string,
  submissions: QuizSubmission[],
  score: number,
  maxScore: number,
  earnedPoints: number,
  totalPoints: number,
  startedAtIso: string
): Promise<FirestoreQuizResult> {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const correctCount = score;
  const incorrectCount = maxScore - score;
  const percentage = Math.round((score / maxScore) * 100);

  const attemptData: FirestoreQuizAttempt = {
    attemptId,
    domain,
    participantId,
    studentName,
    submissions,
    startedAt: startedAtIso,
    completedAt: serverTimestamp(),
  };

  const resultData: FirestoreQuizResult = {
    resultId: attemptId,
    attemptId,
    domain,
    domainTitle,
    participantId,
    studentName,
    score,
    maxScore,
    correctCount,
    incorrectCount,
    percentage,
    earnedPoints,
    totalPoints,
    completedAt: serverTimestamp(),
    completedDateFormatted: dateFormatted,
    completedTimeFormatted: timeFormatted,
  };

  try {
    const attemptRef = doc(db, 'quizAttempts', attemptId);
    await setDoc(attemptRef, attemptData);

    const resultRef = doc(db, 'quizResults', attemptId);
    await setDoc(resultRef, resultData);
  } catch (err) {
    console.warn('Firestore write warning (operating with local state persistence fallback):', err);
  }

  return {
    ...resultData,
    completedAt: now.toISOString(),
  };
}

/**
 * Fetch a single quiz result by attemptId/resultId
 */
export async function getQuizResultById(attemptId: string): Promise<FirestoreQuizResult | null> {
  try {
    const resultRef = doc(db, 'quizResults', attemptId);
    const snap = await getDoc(resultRef);
    if (snap.exists()) {
      return snap.data() as FirestoreQuizResult;
    }
  } catch (err) {
    console.warn('Firestore getQuizResultById error:', err);
  }
  return null;
}

/**
 * Fetch a single quiz attempt by attemptId
 */
export async function getQuizAttemptById(attemptId: string): Promise<FirestoreQuizAttempt | null> {
  try {
    const attemptRef = doc(db, 'quizAttempts', attemptId);
    const snap = await getDoc(attemptRef);
    if (snap.exists()) {
      return snap.data() as FirestoreQuizAttempt;
    }
  } catch (err) {
    console.warn('Firestore getQuizAttemptById error:', err);
  }
  return null;
}

/**
 * Fetch all past completed quiz results for a participant
 */
export async function getParticipantHistory(participantId: string): Promise<FirestoreQuizResult[]> {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('participantId', '==', participantId)
    );
    const snapshot = await getDocs(q);
    const results: FirestoreQuizResult[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as FirestoreQuizResult);
    });
    return results;
  } catch (err) {
    console.warn('Firestore getParticipantHistory error:', err);
    return [];
  }
}
