'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Flame, Rocket, Cpu, Globe, Bug, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { TECH_FACTS_DATA, DAILY_CHALLENGE_DATA } from '@/lib/data/today-in-tech-data';

export default function TodayInTechPage() {
  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-pink-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>Curated Technology Feed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Today in Tech & Tech Bytes</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
            Fascinating technical facts, deep space engineering marvels (Voyager 1), and daily DSA micro-challenges.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left 8 Cols: Tech Bytes Feed */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>Today's Curated Tech Facts</span>
              </h2>

              {TECH_FACTS_DATA.map((fact) => (
                <div
                  key={fact.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 backdrop-blur-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 flex items-center gap-1">
                      <Rocket className="w-3.5 h-3.5" /> {fact.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{fact.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{fact.title}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed mb-4">{fact.fact}</p>
                  
                  <span className="text-xs text-gray-400 italic">Source: {fact.source}</span>
                </div>
              ))}
            </div>

            {/* Right 4 Cols: Daily DSA Challenge */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/40 backdrop-blur-xl sticky top-28">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    Daily Problem Challenge
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {DAILY_CHALLENGE_DATA.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{DAILY_CHALLENGE_DATA.title}</h3>
                <p className="text-xs font-mono text-cyan-300 mb-3">{DAILY_CHALLENGE_DATA.category}</p>

                <p className="text-xs text-gray-300 leading-relaxed mb-4">{DAILY_CHALLENGE_DATA.problemStatement}</p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-gray-300 space-y-1 mb-4">
                  <p className="text-cyan-400 font-bold text-[10px]">Example Input:</p>
                  <p className="text-[11px]">{DAILY_CHALLENGE_DATA.exampleInput}</p>
                  <p className="text-emerald-400 font-bold text-[10px] mt-2">Expected Output:</p>
                  <p className="text-[11px]">{DAILY_CHALLENGE_DATA.exampleOutput}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 mb-6">
                  <span className="font-bold text-amber-400">Hint: </span>
                  {DAILY_CHALLENGE_DATA.hint}
                </div>

                <a
                  href="/tech-hub/dsa-interview-prep"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md hover:opacity-90 transition-opacity"
                >
                  <span>Practice DSA Topic Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
