export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type DomainSlug = 
  | 'cybersecurity'
  | 'web-development'
  | 'dsa'
  | 'databases'
  | 'cloud-aws'
  | 'space-satellites'
  | 'github-tools';

export interface QuizQuestion {
  id: string;
  domain: DomainSlug;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
  difficulty: QuizDifficulty;
  points: number;
}

// Client-facing question interface stripped of answers for security prior to submission
export interface ClientQuizQuestion {
  id: string;
  domain: DomainSlug;
  question: string;
  options: [string, string, string, string];
  difficulty: QuizDifficulty;
  points: number;
}

export interface QuizSubmission {
  questionId: string;
  selectedOption: number;
}

export interface QuizEvaluationResult {
  score: number;
  maxScore: number;
  totalPoints: number;
  earnedPoints: number;
  details: {
    questionId: string;
    isCorrect: boolean;
    selectedOption: number;
    correctAnswer: number;
    explanation: string;
  }[];
}

// ============================================================
// Live Quiz Session Types
// ============================================================

export type SessionStatus = 'waiting' | 'active' | 'finished';

export interface LiveSessionData {
  sessionId: string;
  status: SessionStatus;
  createdAt: string;
  startedAt: string | null;
  timerDurationSeconds: number;
  timerEndsAt: string | null;
  totalQuestions: number;
}

export interface ParticipantData {
  participantId: string;
  displayName: string;
  domainSlug: DomainSlug;
  joinedAt: string;
  answers: Record<string, { selected: number; answeredAt: string }>;
  score: number;
  totalCorrect: number;
  totalAnswered: number;
  completedAt: string | null;
}

export interface LeaderboardEntryData {
  participantId: string;
  displayName: string;
  domainSlug: DomainSlug;
  score: number;
  totalCorrect: number;
  completedAt: string | null;
}
