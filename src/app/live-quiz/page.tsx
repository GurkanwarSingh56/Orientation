'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Zap, CheckCircle2, Clock, Award, Loader2, Play, Pause } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { signInAnonymouslyUser } from '@/lib/firebase/auth';
import { joinLiveQuizSessionWithPresence, subscribeToLiveQuiz, LiveQuizState } from '@/lib/firebase/rtdb';
import { ALL_QUIZ_QUESTIONS } from '@/lib/data/quiz-questions';

export default function LiveQuizStudentPage() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('TV26');
  const [joined, setJoined] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [liveState, setLiveState] = useState<LiveQuizState | null>(null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedForQuestion, setSubmittedForQuestion] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localTimer, setLocalTimer] = useState<number>(30);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-restore saved name on mount
  useEffect(() => {
    const savedName = localStorage.getItem('technovate_student_name');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  // Handle joining live session
  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomCode.trim()) return;

    setErrorMsg(null);
    setIsSubmitting(true);
    
    // Check global state first to prevent late joining
    try {
      const targetSessionId = roomCode.trim().toUpperCase();
      const stateRes = await fetch(`/api/live-quiz/state?sessionId=${targetSessionId}`);
      if (stateRes.ok) {
        const json = await stateRes.json();
        if (json.data && json.data.status !== 'LOBBY') {
          setErrorMsg('TEST ALREADY STARTED. You cannot join this live quiz.');
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err) {
      // Ignore network errors here and proceed
    }

    localStorage.setItem('technovate_student_name', name.trim());

    // INSTANT UI TRANSITION to Lobby Screen
    setJoined(true);

    const targetSessionId = roomCode.trim().toUpperCase();

    try {
      const user = await signInAnonymouslyUser();
      const pId = user?.uid || 'usr_' + Math.random().toString(36).substring(2, 9);
      setParticipantId(pId);

      // Register participant via REST API
      await fetch('/api/live-quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: targetSessionId,
          participantId: pId,
          displayName: name.trim(),
        }),
      }).catch((err) => console.warn('Background join fetch warning:', err));

      // Establish client presence listener (non-blocking)
      joinLiveQuizSessionWithPresence(targetSessionId, pId, name.trim()).catch((presenceErr) => {
        console.warn('Client presence fallback warning:', presenceErr);
      });
    } catch (err: any) {
      console.warn('Background auth/join warning:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subscribe to live quiz state updates when joined + REST polling fallback
  useEffect(() => {
    if (!joined || !roomCode) return;

    const targetSessionId = roomCode.trim().toUpperCase();

    // Socket subscription
    const unsubscribe = subscribeToLiveQuiz(targetSessionId, (data) => {
      if (data) setLiveState(data);
    });

    // REST Polling fallback every 1.5s
    const fetchLatestState = async () => {
      try {
        const res = await fetch(`/api/live-quiz/state?sessionId=${targetSessionId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setLiveState(json.data);
          }
        }
      } catch (err) {
        console.warn('Student REST state poll error:', err);
      }
    };

    fetchLatestState();
    const interval = setInterval(fetchLatestState, 1500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [joined, roomCode]);

  // Synchronize timer precisely from Firebase state
  useEffect(() => {
    if (!liveState) return;

    if (liveState.status === 'PAUSED' || liveState.status === 'FINISHED' || liveState.status === 'LOBBY') {
      setLocalTimer(liveState.remainingTime || 0);
      return;
    }

    if (liveState.status === 'RUNNING' && liveState.questionStartedAt) {
      const duration = liveState.questionDuration || 30;
      const timerInterval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - (liveState.questionStartedAt || Date.now())) / 1000);
        const remaining = Math.max(0, duration - elapsedSec);
        setLocalTimer(remaining);
      }, 500);
      return () => clearInterval(timerInterval);
    }
  }, [liveState]);

  // Reset selected option when host advances question
  useEffect(() => {
    setSelectedOption(null);
  }, [liveState?.currentQuestion]);

  // Handle submitting answer to server evaluation API
  const handleSubmitAnswer = async (optionIdx: number) => {
    if (isSubmitting || !liveState || !participantId || liveState.status !== 'RUNNING') return;
    setSelectedOption(optionIdx);
    setIsSubmitting(true);

    const currentQ = ALL_QUIZ_QUESTIONS[liveState.currentQuestion || 0];

    try {
      const res = await fetch('/api/live-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: roomCode.trim().toUpperCase(),
          participantId,
          questionId: currentQ.id,
          selectedOption: optionIdx,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Answer submission failed');
      }

      setSubmittedForQuestion(liveState.currentQuestion || 0);
    } catch (err: any) {
      console.error('Answer submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Count online participants
  const participantsList = liveState?.participants ? Object.values(liveState.participants) : [];
  const currentQ = ALL_QUIZ_QUESTIONS[liveState?.currentQuestion || 0];
  const totalQuestions = ALL_QUIZ_QUESTIONS.length;
  const status = liveState?.status || 'LOBBY';

  // Compute My Final Score for Results Screen
  const myData = liveState?.participants ? liveState.participants[participantId] : null;
  const myScore = myData?.currentScore || 0;
  const myPercentage = ((myScore / totalQuestions) * 100).toFixed(2);

  return (
    <main className="bg-[#050814] min-h-screen text-white flex flex-col justify-between selection:bg-cyan-400 selection:text-black">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Top Back Nav */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/#explore"
            className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>
          <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            REALTIME QUIZ MODE
          </span>
        </div>

        {/* 1. JOIN VIEW */}
        {!joined ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/30 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Interactive Classroom
                </span>
                <h1 className="text-2xl font-extrabold text-white">TECHNOVATE LIVE QUIZ</h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Join your club live quiz session in real-time. Enter your display name and room code provided by your host.
            </p>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleJoinSession} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Enter your name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gurkanwar"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5">Enter room code</label>
                <input
                  type="text"
                  required
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="TV26"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono tracking-widest focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>JOIN LIVE QUIZ</span>
                    <Play className="w-4 h-4 fill-current" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* JOINED SESSION VIEWS */
          <div className="space-y-6">
            {/* Header Status Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  LIVE QUIZ • ROOM: {roomCode}
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Technovate Live Competition
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  Joined as <span className="text-cyan-300 font-semibold">{name}</span>
                </p>
              </div>
            </div>

            {/* 2. LOBBY VIEW */}
            {status === 'LOBBY' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1124] border border-white/10 shadow-xl space-y-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                  <Clock className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Waiting for host to start...</h3>
                  <p className="text-xs text-gray-400">
                    Get ready! The host will start the {totalQuestions} questions shortly.
                  </p>
                </div>

                {/* Participant Roster */}
                <div className="pt-4 border-t border-white/10 text-left">
                  <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Connected Participants ({participantsList.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-2">
                    {participantsList.map((p) => (
                      <div
                        key={p.participantId}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2 text-xs"
                      >
                        <span className={`w-2 h-2 rounded-full ${p.online ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                        <span className="text-gray-200 truncate">{p.displayName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ACTIVE QUIZ QUESTION VIEW */}
            {status === 'RUNNING' && currentQ && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1124] border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Question {(liveState?.currentQuestion || 0) + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {localTimer}s remaining
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* 4 Options */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    let optionStyle = 'bg-white/5 border-white/10 hover:border-cyan-500/40 text-gray-200';
                    if (isSelected) {
                      optionStyle = 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-semibold shadow-glow';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSubmitAnswer(optIdx)}
                        disabled={isSubmitting || submittedForQuestion === (liveState?.currentQuestion || 0)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="w-7 h-7 rounded-lg bg-white/10 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {submittedForQuestion === (liveState?.currentQuestion || 0) && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Answer submitted! Waiting for host to reveal next question...</span>
                  </div>
                )}
              </div>
            )}

            {/* 4. PAUSED QUIZ VIEW */}
            {status === 'PAUSED' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1124] border border-amber-500/30 shadow-xl space-y-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                  <Pause className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">QUIZ PAUSED</h3>
                  <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
                    The host has temporarily paused the quiz. Please wait until the host resumes the session.
                  </p>
                </div>
                <div className="text-xs font-mono text-amber-500 pt-4 border-t border-amber-500/20">
                  Question {(liveState?.currentQuestion || 0) + 1} / {totalQuestions}
                </div>
              </div>
            )}

            {/* 5. QUIZ FINISHED VIEW */}
            {status === 'FINISHED' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1124] border border-emerald-500/30 shadow-xl space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white tracking-wide">🏆 QUIZ COMPLETED</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    The live competition has concluded!
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Your Final Score</p>
                  <p className="text-4xl font-extrabold text-white">
                    {myScore} <span className="text-lg text-gray-400 font-medium">/ {totalQuestions}</span>
                  </p>
                  <p className="text-sm font-bold text-emerald-400 pt-1">
                    {myPercentage}% Accuracy
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
