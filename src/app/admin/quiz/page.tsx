'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Play, Users, CheckCircle2, Clock, Activity, Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { subscribeToSession, subscribeToLeaderboard, subscribeToParticipants, LiveQuizSession, LeaderboardEntry, LiveParticipant } from '@/lib/firebase/firestore';

export default function AdminQuizDashboard() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [session, setSession] = useState<LiveQuizSession | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [participants, setParticipants] = useState<LiveParticipant[]>([]);
  
  const [timeLeft, setTimeLeft] = useState<string>('--:--');
  const [loadingAction, setLoadingAction] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('All Topics');

  // Hardcoded known session ID as requested
  const SESSION_ID = 'technovate2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'technovate2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode');
    }
  };

  // Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubSession = subscribeToSession(SESSION_ID, (sess) => setSession(sess));
    const unsubLeaderboard = subscribeToLeaderboard(SESSION_ID, (entries) => setLeaderboard(entries));
    const unsubParticipants = subscribeToParticipants(SESSION_ID, (list) => setParticipants(list));

    return () => {
      unsubSession();
      unsubLeaderboard();
      unsubParticipants();
    };
  }, [isAuthenticated]);

  // Global Timer logic (local display based on server timerEndsAt)
  useEffect(() => {
    if (session?.status === 'active' && session.timerEndsAt) {
      const interval = setInterval(() => {
        const endsAt = new Date(session.timerEndsAt).getTime();
        const now = new Date().getTime();
        const diff = endsAt - now;

        if (diff <= 0) {
          setTimeLeft('00:00');
          clearInterval(interval);
          setSession(prev => prev ? { ...prev, status: 'finished' } as LiveQuizSession : null);
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft('--:--');
    }
  }, [session]);

  const handleStartSession = async () => {
    setLoadingAction(true);
    try {
      const res = await fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', passcode: 'technovate2026', sessionId: SESSION_ID })
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Failed to start session');
        return;
      }

      // Immediately update local state to reflect successful server API write
      setSession(prev => ({
        ...(prev || {}),
        sessionId: SESSION_ID,
        status: data.status,
        timerEndsAt: data.timerEndsAt,
        adminPasscode: 'technovate2026',
        totalQuestions: 10,
        createdAt: prev?.createdAt || new Date(),
        startedAt: prev?.startedAt || new Date(),
        timerDurationSeconds: prev?.timerDurationSeconds || 3600
      } as LiveQuizSession));

    } catch (err) {
      console.error('Failed to start session', err);
      alert('Network error while starting session');
    } finally {
      setLoadingAction(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-[#050814] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            />
            {authError && (
              <div className="text-rose-400 text-xs flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> {authError}</div>
            )}
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#050814] font-bold py-3 rounded-xl transition-all">
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Calculate stats
  const totalParticipants = participants.length;
  const completedParticipants = participants.filter((p) => p.completedAt).length;
  const playingParticipants = totalParticipants - completedParticipants;

  // Filter Leaderboard
  const filteredLeaderboard = leaderboard.filter((entry) => {
    const matchesSearch = entry.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === 'All Topics' || entry.domainSlug === topicFilter;
    return matchesSearch && matchesTopic;
  });

  // Calculate highest/average score
  let highestScore = 0;
  let totalScore = 0;
  leaderboard.forEach(p => {
    if (p.score > highestScore) highestScore = p.score;
    totalScore += p.score;
  });
  const avgScore = leaderboard.length > 0 ? (totalScore / leaderboard.length).toFixed(1) : '0';

  return (
    <main className="bg-[#050814] min-h-screen text-white pb-16">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-28">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
              Live Quiz Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono text-gray-400">SESSION: {SESSION_ID}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                session?.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                session?.status === 'finished' ? 'bg-rose-500/20 text-rose-400' : 
                'bg-white/10 text-gray-300'
              }`}>
                {session?.status === 'active' ? '🟢 LIVE' : session?.status === 'finished' ? '🔴 FINISHED' : '🔴 NOT LIVE'}
              </span>
            </div>
          </div>
          
          {session?.status !== 'active' && (
            <button
              onClick={handleStartSession}
              disabled={loadingAction}
              className="bg-green-500 hover:bg-green-400 text-[#050814] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> Start Global Timer
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Users className="w-6 h-6"/></div>
            <div>
              <div className="text-xs text-gray-400 font-mono">Participants</div>
              <div className="text-2xl font-bold">{totalParticipants}</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Activity className="w-6 h-6"/></div>
            <div>
              <div className="text-xs text-gray-400 font-mono">Playing</div>
              <div className="text-2xl font-bold">{playingParticipants}</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><CheckCircle2 className="w-6 h-6"/></div>
            <div>
              <div className="text-xs text-gray-400 font-mono">Completed</div>
              <div className="text-2xl font-bold">{completedParticipants}</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent">
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400"><Clock className="w-6 h-6"/></div>
            <div>
              <div className="text-xs text-gray-400 font-mono">Time Remaining</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">{timeLeft}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="All Topics" className="bg-[#050814]">All Topics</option>
              <option value="cybersecurity" className="bg-[#050814]">Cybersecurity</option>
              <option value="web-development" className="bg-[#050814]">Web Development</option>
              <option value="dsa" className="bg-[#050814]">DSA</option>
              <option value="databases" className="bg-[#050814]">Databases</option>
              <option value="cloud-aws" className="bg-[#050814]">Cloud & AWS</option>
              <option value="space-satellites" className="bg-[#050814]">Space & Satellites</option>
              <option value="github-tools" className="bg-[#050814]">GitHub</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">Rank</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">Participant</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">Topic</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal text-center">Score</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                      No participants found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((entry, index) => {
                    // Actual rank is based on the unfiltered leaderboard position
                    const actualRank = leaderboard.findIndex(l => l.participantId === entry.participantId) + 1;
                    
                    let rankDisplay = <span className="text-gray-400 font-mono">{actualRank}</span>;
                    let rowClass = "hover:bg-white/[0.02] transition-colors";
                    
                    if (actualRank === 1) { rankDisplay = <span className="text-xl" title="Rank 1">🥇</span>; rowClass += " bg-amber-500/5"; }
                    if (actualRank === 2) { rankDisplay = <span className="text-xl" title="Rank 2">🥈</span>; rowClass += " bg-gray-300/5"; }
                    if (actualRank === 3) { rankDisplay = <span className="text-xl" title="Rank 3">🥉</span>; rowClass += " bg-orange-700/5"; }

                    // We need to merge with participants to get 'Playing' status if they aren't on leaderboard yet
                    // Wait, leaderboard contains ONLY completed participants? 
                    // No, my backend puts them on leaderboard only when finished (`api/quiz/submit` -> `action: 'finish'`).
                    // Actually, the requirements said: 
                    // "Live Leaderboard: | Rank | Participant | Topic | Score | Time | Status |"
                    // "4 Arjun Web Development 9/10 Playing"
                    // Meaning playing participants should ALSO be in the list!
                    return (
                      <tr key={entry.participantId} className={rowClass}>
                        <td className="p-4 whitespace-nowrap">{rankDisplay}</td>
                        <td className="p-4 font-semibold text-white">{entry.displayName}</td>
                        <td className="p-4 text-sm text-gray-300 capitalize">{entry.domainSlug.replace('-', ' ')}</td>
                        <td className="p-4 text-center font-bold text-cyan-400">{entry.score}</td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
                
                {/* Append Playing Participants */}
                {participants
                  .filter(p => !p.completedAt) // Not completed yet
                  .filter(p => topicFilter === 'All Topics' || p.domainSlug === topicFilter)
                  .filter(p => p.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(p => (
                    <tr key={p.participantId} className="hover:bg-white/[0.02] transition-colors opacity-70">
                      <td className="p-4 text-gray-500 font-mono">-</td>
                      <td className="p-4 font-semibold text-white">{p.displayName}</td>
                      <td className="p-4 text-sm text-gray-400 capitalize">{p.domainSlug.replace('-', ' ')}</td>
                      <td className="p-4 text-center font-bold text-gray-500">{p.score}</td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20">
                          Playing
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#0a0f1c] rounded-2xl border border-white/5">
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Total Participants</div>
            <div className="text-lg font-bold">{totalParticipants}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Completed</div>
            <div className="text-lg font-bold">{completedParticipants}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Highest Score</div>
            <div className="text-lg font-bold text-cyan-400">{highestScore}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Average Score</div>
            <div className="text-lg font-bold text-violet-400">{avgScore}</div>
          </div>
        </div>

      </div>
    </main>
  );
}
