export interface MemoryParticipant {
  participantId: string;
  displayName: string;
  online: boolean;
  joinedAt: number;
  currentScore: number;
  answeredCount: number;
  lastActive: number;
}

export interface MemorySession {
  sessionId: string;
  status: 'lobby' | 'active' | 'paused' | 'ended';
  domain: string;
  domainTitle: string;
  currentQuestion: number;
  questionStartedAt: number | null;
  questionDuration: number;
  participants: Record<string, MemoryParticipant>;
  leaderboard: Array<{
    rank: number;
    participantId: string;
    displayName: string;
    score: number;
    answeredCount: number;
  }>;
}

// Global server memory store persistent across API route calls
const globalSessions: Record<string, MemorySession> = {};

export function getMemorySession(sessionId: string): MemorySession {
  const id = sessionId.trim().toUpperCase();
  if (!globalSessions[id]) {
    globalSessions[id] = {
      sessionId: id,
      status: 'lobby',
      domain: 'cybersecurity',
      domainTitle: 'Cybersecurity',
      currentQuestion: 0,
      questionStartedAt: null,
      questionDuration: 30,
      participants: {},
      leaderboard: [],
    };
  }
  return globalSessions[id];
}

export function updateMemorySession(sessionId: string, updates: Partial<MemorySession>): MemorySession {
  const session = getMemorySession(sessionId);
  Object.assign(session, updates);
  return session;
}

export function addOrUpdateMemoryParticipant(
  sessionId: string,
  participantId: string,
  displayName: string
): MemoryParticipant {
  const session = getMemorySession(sessionId);
  const existing = session.participants[participantId];

  const updated: MemoryParticipant = {
    participantId,
    displayName: displayName.trim(),
    online: true,
    joinedAt: existing?.joinedAt || Date.now(),
    currentScore: existing?.currentScore || 0,
    answeredCount: existing?.answeredCount || 0,
    lastActive: Date.now(),
  };

  session.participants[participantId] = updated;
  recalculateMemoryLeaderboard(sessionId);
  return updated;
}

export function recordMemoryAnswer(
  sessionId: string,
  participantId: string,
  isCorrect: boolean
): { currentScore: number; answeredCount: number } {
  const session = getMemorySession(sessionId);
  let participant = session.participants[participantId];

  if (!participant) {
    participant = addOrUpdateMemoryParticipant(sessionId, participantId, 'Student');
  }

  participant.currentScore = (participant.currentScore || 0) + (isCorrect ? 1 : 0);
  participant.answeredCount = (participant.answeredCount || 0) + 1;
  participant.lastActive = Date.now();

  recalculateMemoryLeaderboard(sessionId);
  return {
    currentScore: participant.currentScore,
    answeredCount: participant.answeredCount,
  };
}

export function recalculateMemoryLeaderboard(sessionId: string) {
  const session = getMemorySession(sessionId);
  const list = Object.values(session.participants);

  list.sort((a, b) => {
    if (b.currentScore !== a.currentScore) {
      return b.currentScore - a.currentScore;
    }
    return a.answeredCount - b.answeredCount;
  });

  session.leaderboard = list.map((p, idx) => ({
    rank: idx + 1,
    participantId: p.participantId,
    displayName: p.displayName || 'Student',
    score: p.currentScore || 0,
    answeredCount: p.answeredCount || 0,
  }));
}
