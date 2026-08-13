import { ref, update, onValue, off, onDisconnect, serverTimestamp, DataSnapshot } from 'firebase/database';
import { rtdb } from './config';
import { DomainSlug } from '../types/quiz';

export interface LiveParticipantNode {
  participantId: string;
  displayName: string;
  online: boolean;
  joinedAt: number | object;
  currentScore: number;
  answeredCount: number;
  lastActive: number | object;
}

export interface LiveLeaderboardItem {
  rank: number;
  participantId: string;
  displayName: string;
  score: number;
  answeredCount: number;
}

export interface LiveQuizState {
  sessionId: string;
  status: 'lobby' | 'active' | 'paused' | 'ended';
  domain: DomainSlug;
  domainTitle: string;
  currentQuestion: number;
  questionStartedAt: number | null;
  questionDuration: number;
  participants: Record<string, LiveParticipantNode>;
  leaderboard: LiveLeaderboardItem[];
}

/**
 * Join live quiz session and establish connection-aware presence (.info/connected & onDisconnect)
 */
export async function joinLiveQuizSessionWithPresence(
  sessionId: string,
  participantId: string,
  displayName: string
) {
  try {
    const participantRef = ref(rtdb, `liveQuiz/${sessionId}/participants/${participantId}`);
    const connectedRef = ref(rtdb, '.info/connected');

    // Initial node write
    await update(participantRef, {
      participantId,
      displayName,
      online: true,
      joinedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    }).catch((err) => console.warn('Client RTDB node update warning:', err?.message || err));

    // Connection state listener for presence
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // Set offline status on disconnect
        onDisconnect(participantRef)
          .update({
            online: false,
            lastActive: serverTimestamp(),
          })
          .catch((e) => console.warn('onDisconnect registration warning:', e?.message || e));

        // Mark online
        update(participantRef, {
          online: true,
          lastActive: serverTimestamp(),
        }).catch((e) => console.warn('online update warning:', e?.message || e));
      }
    });
  } catch (err: any) {
    console.warn('joinLiveQuizSessionWithPresence fallback:', err?.message || err);
  }
}

/**
 * Subscribe to live RTDB quiz session state changes
 */
export function subscribeToLiveQuiz(
  sessionId: string,
  callback: (data: LiveQuizState | null) => void
) {
  try {
    const sessionRef = ref(rtdb, `liveQuiz/${sessionId}`);
    onValue(
      sessionRef,
      (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val() as LiveQuizState);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn('subscribeToLiveQuiz permission/read warning:', error?.message || error);
        callback(null);
      }
    );

    return () => off(sessionRef);
  } catch (err) {
    console.warn('subscribeToLiveQuiz catch:', err);
    return () => {};
  }
}

/**
 * Subscribe to RTDB connected state
 */
export function subscribeToPresenceConnection(callback: (isConnected: boolean) => void) {
  try {
    const connectedRef = ref(rtdb, '.info/connected');
    onValue(connectedRef, (snap) => {
      callback(snap.val() === true);
    });
    return () => off(connectedRef);
  } catch (err) {
    return () => {};
  }
}
