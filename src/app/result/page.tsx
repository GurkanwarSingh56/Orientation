'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  History,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getQuizResultById, getQuizAttemptById, getParticipantHistory, FirestoreQuizResult, FirestoreQuizAttempt } from '@/lib/firebase/firestore';
import { ALL_QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';
import { getCurrentUser } from '@/lib/firebase/auth';

function ResultContent() {
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get('attemptId');

  const [attemptId, setAttemptId] = useState<string | null>(attemptIdParam);
  const [result, setResult] = useState<FirestoreQuizResult | null>(null);
  const [attempt, setAttempt] = useState<FirestoreQuizAttempt | null>(null);
  const [history, setHistory] = useState<FirestoreQuizResult[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load result, attempt, and history on mount or attemptId change
  useEffect(() => {
    let activeAttemptId = attemptIdParam;
    if (!activeAttemptId && typeof window !== 'undefined') {
      activeAttemptId = localStorage.getItem('technovate_latest_attempt_id');
      if (activeAttemptId) {
        setAttemptId(activeAttemptId);
      }
    }

    async function loadData() {
      setLoading(true);

      // Try local storage cache fallback first for instant load
      let cachedData: any = null;
      if (activeAttemptId && typeof window !== 'undefined') {
        const raw = localStorage.getItem(`technovate_quiz_attempt_${activeAttemptId}`);
        if (raw) {
          try {
            cachedData = JSON.parse(raw);
            if (cachedData.result) {
              setResult(cachedData.result);
            }
          } catch (e) {
            console.warn('Cached data parse warning:', e);
          }
        }

        // Local history fallback
        const histRaw = localStorage.getItem('technovate_quiz_history');
        if (histRaw) {
          try {
            setHistory(JSON.parse(histRaw));
          } catch (e) {
            console.warn('History parse warning:', e);
          }
        }
      }

      // Fetch from Firestore
      if (activeAttemptId) {
        const [remoteResult, remoteAttempt] = await Promise.all([
          getQuizResultById(activeAttemptId),
          getQuizAttemptById(activeAttemptId),
        ]);

        if (remoteResult) {
          setResult(remoteResult);
        }
        if (remoteAttempt) {
          setAttempt(remoteAttempt);
        }

        const currentUser = getCurrentUser();
        if (currentUser?.uid) {
          const userHistory = await getParticipantHistory(currentUser.uid);
          if (userHistory.length > 0) {
            setHistory(userHistory);
          }
        }
      }

      setLoading(false);
    }

    loadData();
  }, [attemptIdParam]);

  if (loading && !result) {
    return (
      <div className="pt-32 pb-20 text-center flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-mono text-gray-400">Loading your Technovate quiz results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-sm">
          No quiz result found for this session.
        </div>
        <Link
          href="/#explore"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Technology Domains</span>
        </Link>
      </div>
    );
  }

  // Get question review details
  const domainQuestions = ALL_QUIZ_QUESTIONS.filter((q) => q.domain === result.domain);

  // Submissions map
  const submissionsMap: Record<string, number> = {};
  if (attempt?.submissions) {
    attempt.submissions.forEach((s) => {
      submissionsMap[s.questionId] = s.selectedOption;
    });
  } else if (typeof window !== 'undefined' && attemptId) {
    const raw = localStorage.getItem(`technovate_quiz_attempt_${attemptId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.submissions) {
          parsed.submissions.forEach((s: any) => {
            submissionsMap[s.questionId] = s.selectedOption;
          });
        }
      } catch (e) {
        console.warn('Submissions parse warning:', e);
      }
    }
  }

  // Performance summary calculation
  let performanceSummary = 'Solid effort! Review the explanations below to refine your knowledge.';
  if (result.percentage >= 90) {
    performanceSummary = 'Outstanding performance! You have mastered key concepts in this domain.';
  } else if (result.percentage >= 70) {
    performanceSummary = 'Great job! You have demonstrated strong core understanding of this technology.';
  } else if (result.percentage >= 50) {
    performanceSummary = 'Good start! Reviewing the subtopics will help elevate your domain expertise.';
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/#explore"
          className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Domain Explorer</span>
        </Link>
      </div>

      {/* Main Result Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              TECHNOVATE QUIZ RESULT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {result.domainTitle || result.domain}
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Participant: <span className="text-white font-semibold">{result.studentName || 'Student'}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-gray-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{result.completedDateFormatted || '13 August 2026'}</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400 ml-2" />
            <span>{result.completedTimeFormatted || '7:48 PM'}</span>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
              Score
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {result.score} / {result.maxScore}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
              Percentage
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {result.percentage}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block mb-1">
              Correct
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {result.correctCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
            <span className="text-[11px] font-mono text-rose-300 uppercase tracking-wider block mb-1">
              Incorrect
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              {result.incorrectCount}
            </span>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-200 flex items-center space-x-3">
          <Award className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{performanceSummary}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowReview(!showReview)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 font-bold text-xs transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Answers</span>
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <Link
            href={`/quiz/${result.domain}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake {result.domainTitle || result.domain} Quiz</span>
          </Link>
        </div>
      </div>

      {/* Review Answers Collapsible Section */}
      {showReview && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1124] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-white/10">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Answer Review & Explanations</h2>
          </div>

          <div className="space-y-6">
            {domainQuestions.map((q, qIdx) => {
              const studentOptIdx = submissionsMap[q.id];
              const isCorrect = studentOptIdx === q.correctAnswer;

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-white">
                      <span className="text-cyan-400 font-mono mr-2">{qIdx + 1}.</span>
                      {q.question}
                    </h3>
                    <span className="shrink-0 pt-0.5">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-gray-400">Your Answer:</span>
                      <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
                        {studentOptIdx !== undefined && q.options[studentOptIdx]
                          ? `${String.fromCharCode(65 + studentOptIdx)}. ${q.options[studentOptIdx]}`
                          : 'Not Answered'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                        <span className="text-emerald-300 font-semibold">Correct Answer:</span>
                        <span className="text-emerald-200 font-bold">
                          {String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 text-xs text-gray-300 leading-relaxed">
                    <span className="font-mono font-bold text-cyan-400 block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result History Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1124] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
          <History className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-bold text-white">Your Quiz Completion History</h2>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-gray-400">No previous quiz completions found.</p>
        ) : (
          <div className="space-y-3">
            {history.map((h, idx) => (
              <div
                key={h.resultId || idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{h.domainTitle || h.domain}</h4>
                  <span className="text-xs text-gray-400 block">
                    Completed: {h.completedDateFormatted || '13 Aug 2026'}, {h.completedTimeFormatted || '7:48 PM'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-extrabold font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-xl">
                    {h.score} / {h.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="bg-[#050814] min-h-screen text-white flex flex-col justify-between selection:bg-cyan-400 selection:text-black">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-gray-400 font-mono text-sm">Loading quiz results...</div>}>
        <ResultContent />
      </Suspense>
      <Footer />
    </main>
  );
}
