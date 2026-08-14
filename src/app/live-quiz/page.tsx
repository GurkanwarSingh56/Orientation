'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Globe, Code2, Database, Cloud, Rocket, GitBranch, ArrowRight, Loader2, Clock, CheckCircle2, Trophy, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { signInAnonymouslyUser } from '@/lib/firebase/auth';
import { subscribeToSession, subscribeToLeaderboard, LiveQuizSession, LeaderboardEntry } from '@/lib/firebase/firestore';
import { DOMAIN_ITEMS } from '@/lib/data/domain-data';
import { ClientQuizQuestion, DomainSlug } from '@/lib/types/quiz';

type QuizStep = 'join' | 'topic' | 'waiting' | 'active' | 'result' | 'ended';

export default function LiveQuizPage() {
  const router = useRouter();

  // State
  const [step, setStep] = useState<QuizStep>('join');
  const [roomCode, setRoomCode] = useState('technovate2026');
  const [displayName, setDisplayName] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<DomainSlug | null>(null);
  
  const [session, setSession] = useState<LiveQuizSession | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const [questions, setQuestions] = useState<ClientQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('--:--');

  const [resultData, setResultData] = useState<{ score: number; totalCorrect: number; totalAnswered: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef(false);

  // Finish Quiz
  const handleFinishQuiz = React.useCallback(async (sid: string, pid: string) => {
    if (isSubmittingRef.current && step === 'result') return;
    isSubmittingRef.current = true;
    setLoading(true);
    
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finish',
          sessionId: sid,
          participantId: pid,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResultData({
          score: data.score,
          totalCorrect: data.totalCorrect,
          totalAnswered: data.totalAnswered || 10
        });
        setStep('result');
      } else {
        // If it fails, we might already be finished
        if (data.error === 'Participant not found') {
          setError('Could not finalize quiz.');
        } else {
          setStep('result');
        }
      }
    } catch (err) {
      console.error('Finish error', err);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }, [step]);

  // Restore session from local storage and URL params on mount
  useEffect(() => {
    const savedRoom = localStorage.getItem('technovate_live_room');
    const savedName = localStorage.getItem('technovate_live_name');
    if (savedRoom) setRoomCode(savedRoom);
    if (savedName) setDisplayName(savedName);

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const topicParam = urlParams.get('topic');
      if (topicParam) {
        setSelectedTopic(topicParam as DomainSlug);
      }
    }
  }, []);

  // Listen to session changes once joined
  useEffect(() => {
    if (!roomCode || step === 'join' || step === 'topic') return;
    
    const unsubscribe = subscribeToSession(roomCode, (sess) => {
      if (!sess) {
        if (step !== 'waiting') {
          setError('Session not found or ended.');
        }
        return;
      }
      setSession(sess);
      setError('');
      
      // Auto-transitions based on session status
      if (sess.status === 'active' && step === 'waiting') {
        setStep('active');
      } else if (sess.status === 'finished' && step !== 'result') {
        handleFinishQuiz(roomCode, participantId);
      }
    });
    
    const unsubLeaderboard = subscribeToLeaderboard(roomCode, (entries) => {
      setLeaderboard(entries);
    });

    return () => {
      unsubscribe();
      unsubLeaderboard();
    };
  }, [roomCode, step, participantId, handleFinishQuiz]);

  // Global Timer logic
  useEffect(() => {
    if (session?.status === 'active' && session.timerEndsAt && step === 'active') {
      timerRef.current = setInterval(() => {
        const endsAt = new Date(session.timerEndsAt).getTime();
        const now = new Date().getTime();
        const diff = endsAt - now;

        if (diff <= 0) {
          setTimeLeft('00:00');
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinishQuiz(session.sessionId, participantId);
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, step, participantId, handleFinishQuiz]);

  // Fallback Polling for 'waiting' state to ensure robust transition
  useEffect(() => {
    if (step !== 'waiting' || !roomCode) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/quiz/session?sessionId=${roomCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'active') {
             setStep('active');
          } else if (data.status === 'finished') {
             handleFinishQuiz(roomCode, participantId);
          }
        }
      } catch (err) {
        // silently ignore polling errors
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [step, roomCode, participantId, handleFinishQuiz]);

  // Step 1: Join / Reconnect
  const handleJoinInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const code = 'technovate2026';
    const name = displayName.trim();
    if (!name) {
      setError('Name is required.');
      return;
    }
    if (name.length > 30) {
      setError('Name is too long.');
      return;
    }

    setLoading(true);
    try {
      const authResult = await signInAnonymouslyUser();
      const pId = authResult.uid;
      setParticipantId(pId);
      setRoomCode(code);
      setDisplayName(name);

      localStorage.setItem('technovate_live_room', code);
      localStorage.setItem('technovate_live_name', name);

      // Check session via API
      const res = await fetch(`/api/quiz/session?sessionId=${code}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to find session');
      if (data.status === 'finished') {
        setStep('ended');
        return;
      }

      // Check if participant already joined by calling the submit API with 'join'
      // We pass a dummy domainSlug just in case they haven't joined, but if they haven't, it will error without it.
      // Wait, we need to know if they already joined BEFORE asking for topic.
      // Let's just go to topic selection, and the API will handle alreadyJoined.
      // Actually, if we send a join request with empty domain, the backend might reject it.
      // Let's go to topic selection first. The topic selection will call join.
      
      setStep('topic');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Join Session with Topic
  const handleJoinWithTopic = async () => {
    if (!selectedTopic) {
      setError('Please select a topic.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          sessionId: roomCode,
          participantId,
          displayName,
          domainSlug: selectedTopic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Session has ended') {
          setStep('ended');
          return;
        }
        throw new Error(data.error || 'Failed to join');
      }

      if (data.alreadyJoined) {
        // Restore state
        setSelectedTopic(data.domainSlug);
        if (data.completedAt) {
          await handleFinishQuiz(roomCode, participantId); // Fetch result
          return;
        }
      }

      setQuestions(data.questions || []);
      
      if (data.sessionStatus === 'waiting') {
        setStep('waiting');
      } else if (data.sessionStatus === 'active') {
        setStep('active');
        
        // Skip answered questions
        if (data.alreadyJoined && data.totalAnswered > 0) {
           setCurrentQuestionIndex(Math.min(data.totalAnswered, 9));
        }
      } else {
        throw new Error('Session is in an invalid state.');
      }
    } catch (err: any) {
      setError(err.message || 'Error joining quiz.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Submit Answer
  const handleAnswerSubmit = async () => {
    if (selectedOption === null) return;
    if (isSubmittingRef.current) return;
    
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit-answer',
          sessionId: roomCode,
          participantId,
          questionId: currentQ.id,
          selectedOption,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.alreadyAnswered) {
          // It's ok, just move forward
        } else {
          throw new Error(data.error || 'Failed to submit answer');
        }
      }

      // Record locally
      setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));
      setSelectedOption(null);

      // Advance or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        await handleFinishQuiz(roomCode, participantId);
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting answer. Please try again.');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };


  // --- RENDER HELPERS ---
  const myRank = leaderboard.findIndex((l) => l.participantId === participantId) + 1;

  return (
    <main className="bg-[#050814] min-h-screen text-white flex flex-col selection:bg-cyan-400 selection:text-black">
      <Navbar />
      
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pt-28 pb-16">
        
        {/* STEP 1: JOIN */}
        {step === 'join' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-fadeInUp">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 mb-2">
                Join Live Quiz
              </h1>
            </div>

            <form onSubmit={handleJoinInit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-2 ml-1">YOUR NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={30}
                  className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !displayName}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: TOPIC SELECTION */}
        {step === 'topic' && (
          <div className="animate-fadeInUp">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Choose Your Topic
              </h1>
              <p className="text-gray-400 text-sm">Select the technology domain you want to be tested on. (10 Questions)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {DOMAIN_ITEMS.map((domain) => {
                const isSelected = selectedTopic === domain.quizSlug;
                const Icon = domain.icon;
                return (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedTopic(domain.quizSlug as DomainSlug)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                        {domain.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">10 Questions</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="p-3 mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleJoinWithTopic}
              disabled={loading || !selectedTopic}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Quiz'}
            </button>
          </div>
        )}

        {/* STEP 3: WAITING */}
        {step === 'waiting' && (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-fadeInUp">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 relative">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Waiting to Start...</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              You're in! The quiz will begin automatically as soon as the organizer starts the session.
            </p>
            <div className="mt-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
              TOPIC: {selectedTopic}
            </div>
          </div>
        )}

        {/* STEP 4: ACTIVE QUIZ */}
        {step === 'active' && questions.length > 0 && (
          <div className="animate-fadeInUp space-y-6">
            
            {/* Header: Progress & Timer */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm border border-cyan-500/30">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-mono">QUESTION {currentQuestionIndex + 1} OF {questions.length}</div>
                  <div className="text-sm font-bold text-white capitalize">{selectedTopic?.replace('-', ' ')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-rose-400">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold text-sm tracking-wider">{timeLeft}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-gradient-to-br from-[#0d1526] to-[#0a0f1c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
                {questions[currentQuestionIndex].question}
              </h2>
              
              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                        isSelected 
                          ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-cyan-400' : 'border-gray-500 group-hover:border-gray-400'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedOption === null || loading}
                className="px-8 py-3.5 rounded-xl bg-cyan-500 text-[#050814] font-bold text-sm shadow-lg hover:bg-cyan-400 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'
                )}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULT */}
        {step === 'result' && resultData && (
          <div className="animate-fadeInUp space-y-6">
            <div className="bg-gradient-to-br from-[#0d1526] to-[#0a0f1c] border border-cyan-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white mb-6 shadow-lg shadow-cyan-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <h1 className="text-3xl font-extrabold text-white mb-2">Quiz Completed! 🎉</h1>
              <p className="text-gray-400 text-sm mb-8">
                Your results have been securely recorded and added to the live leaderboard.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-1">Score</div>
                  <div className="text-3xl font-bold text-cyan-400">{resultData.score}</div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-1">Accuracy</div>
                  <div className="text-3xl font-bold text-violet-400">
                    {Math.round((resultData.totalCorrect / resultData.totalAnswered) * 100)}%
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Live Rank</div>
                      <div className="text-sm font-semibold text-gray-200">Across all topics</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-amber-400">
                    {myRank > 0 ? `#${myRank}` : '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link
                href="/#explore"
                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {/* STEP 6: ENDED */}
        {step === 'ended' && (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-fadeInUp">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">Quiz has ended</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
              The global timer for this quiz session has expired. No new attempts are being accepted.
            </p>
            <Link
              href="/#explore"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        )}
        
      </div>
      
      <Footer />
    </main>
  );
}
