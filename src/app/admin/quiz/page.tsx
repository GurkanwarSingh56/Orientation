'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Play, SkipForward, Pause, Square, Users, Award, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { subscribeToLiveQuiz, LiveQuizState } from '@/lib/firebase/rtdb';
import { signInAnonymouslyUser } from '@/lib/firebase/auth';

export default function HostQuizControlPage() {
  const [sessionId, setSessionId] = useState('TV26');
  const [liveState, setLiveState] = useState<LiveQuizState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [localTimer, setLocalTimer] = useState<number>(30);

  // Authenticate host anonymously on mount & initialize session
  useEffect(() => {
    signInAnonymouslyUser().catch((err) => console.warn('Host auth error:', err));
  }, []);

  // Initialize session TV26 on mount
  useEffect(() => {
    handleHostAction('create');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to RTDB socket listener + REST polling fallback
  useEffect(() => {
    const targetSessionId = sessionId.trim().toUpperCase();

    // Socket listener
    const unsubscribe = subscribeToLiveQuiz(targetSessionId, (data) => {
      if (data) setLiveState(data);
    });

    // REST Polling fallback every 2s
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
        console.warn('REST state poll error:', err);
      }
    };

    fetchLatestState();
    const interval = setInterval(fetchLatestState, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [sessionId]);

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

  // Auto-advance question when timer reaches 0
  useEffect(() => {
    if (liveState?.status === 'RUNNING' && localTimer === 0 && !isBusy) {
      handleHostAction('nextQuestion');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTimer, liveState?.status]);

  // Host Action Handler
  const handleHostAction = async (action: 'create' | 'start' | 'nextQuestion' | 'pause' | 'resume' | 'end') => {
    if (isBusy) return;
    setIsBusy(true);

    try {
      const res = await fetch('/api/live-quiz/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sessionId: sessionId.trim().toUpperCase(),
        }),
      });
      if (res.ok) {
        // Trigger instant state fetch
        const stateRes = await fetch(`/api/live-quiz/state?sessionId=${sessionId.trim().toUpperCase()}`);
        if (stateRes.ok) {
          const json = await stateRes.json();
          if (json.data) setLiveState(json.data);
        }
      }
    } catch (err) {
      console.error('Host action error:', err);
    } finally {
      setIsBusy(false);
    }
  };

  const participantsList = liveState?.participants ? Object.values(liveState.participants) : [];
  const onlineParticipants = participantsList.filter((p) => p.online);
  const currentQNum = (liveState?.currentQuestion || 0) + 1;
  const status = (liveState?.status || 'LOBBY').toUpperCase();

  // Compute fallback leaderboard dynamically if leaderboard array is empty
  let effectiveLeaderboard = liveState?.leaderboard || [];
  if (effectiveLeaderboard.length === 0 && participantsList.length > 0) {
    const sorted = [...participantsList].sort((a, b) => {
      const scoreA = a.currentScore || 0;
      const scoreB = b.currentScore || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (a.answeredCount || 0) - (b.answeredCount || 0);
    });

    effectiveLeaderboard = sorted.map((p, idx) => ({
      rank: idx + 1,
      participantId: p.participantId,
      displayName: p.displayName || 'Student',
      score: p.currentScore || 0,
      answeredCount: p.answeredCount || 0,
    }));
  }

  return (
    <main className="bg-[#050814] min-h-screen text-white flex flex-col justify-between selection:bg-cyan-400 selection:text-black">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/#explore"
            className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> HOST CONTROL DASHBOARD
          </span>
        </div>

        {/* Banner Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Session Control Room
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">LIVE QUIZ CONTROL</h1>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border ${status === 'RUNNING' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : status === 'PAUSED' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : status === 'FINISHED' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-gray-500/20 text-gray-300 border-gray-500/40'}`}>
                Status: {status}
              </span>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Online: {onlineParticipants.length}
              </span>
            </div>
          </div>

          {/* Session Setup Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono text-gray-300 block mb-1.5">Room Code</label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm uppercase focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleHostAction('create')}
                disabled={isBusy}
                className="w-full py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Initialize Session ({sessionId})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Host Control Actions Toolbar */}
        <div className="p-6 rounded-2xl bg-[#0B1124] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
              Host Action Commands
            </h3>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {localTimer}s remaining
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {status !== 'PAUSED' ? (
              <button
                onClick={() => handleHostAction('start')}
                disabled={isBusy || status === 'RUNNING' || status === 'FINISHED'}
                className="py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START QUIZ</span>
              </button>
            ) : (
              <button
                onClick={() => handleHostAction('resume')}
                disabled={isBusy}
                className="py-3 px-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RESUME TEST</span>
              </button>
            )}

            <button
              onClick={() => handleHostAction('nextQuestion')}
              disabled={isBusy || status === 'FINISHED'}
              className="py-3 px-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
              <span>NEXT QUESTION ({currentQNum}/70)</span>
            </button>

            <button
              onClick={() => handleHostAction('pause')}
              disabled={isBusy || status !== 'RUNNING'}
              className="py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Pause className="w-4 h-4" />
              <span>PAUSE TEST</span>
            </button>

            <button
              onClick={() => handleHostAction('end')}
              disabled={isBusy || status === 'FINISHED'}
              className="py-3 px-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              <span>FINISH TEST</span>
            </button>
          </div>
        </div>

        {/* Live Grid: Presence & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Presence Roster (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B1124] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Live Participants ({participantsList.length})
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {onlineParticipants.length} Online
              </span>
            </div>

            {participantsList.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No participants connected yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {participantsList.map((p) => (
                  <div
                    key={p.participantId}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          p.online ? 'bg-emerald-400 shadow-glow' : 'bg-gray-500'
                        }`}
                      />
                      <span className="font-bold text-white">{p.displayName}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="text-cyan-300 font-bold">{p.currentScore || 0} pts</span>
                      <span className="text-gray-400">({p.online ? '🟢 Online' : '⚪ Offline'})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Leaderboard (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0B1124] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Realtime Leaderboard
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                Question {currentQNum} of 70
              </span>
            </div>

            {effectiveLeaderboard.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">
                Leaderboard will update automatically as students submit answers.
              </p>
            ) : (
              <div className="space-y-2.5">
                {effectiveLeaderboard.map((item) => (
                  <div
                    key={item.participantId}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold">
                        #{item.rank}
                      </span>
                      <span className="text-sm font-bold text-white">{item.displayName}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-mono">
                      <span className="text-gray-400">{item.answeredCount || 0} Ans</span>
                      <span className="text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg">
                        {item.score} Points
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
