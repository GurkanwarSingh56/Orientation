'use client';

import Link from 'next/link';
import { Briefcase, Flame, ArrowRight, ExternalLink, Rocket, Calendar, MapPin } from 'lucide-react';
import { OPPORTUNITIES_DATA } from '@/lib/data/opportunities-data';
import { TECH_FACTS_DATA, DAILY_CHALLENGE_DATA } from '@/lib/data/today-in-tech-data';

export default function OpportunitiesTicker() {
  const featuredFacts = TECH_FACTS_DATA.slice(0, 2);

  return (
    <section className="py-20 bg-[#080C14] relative border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Student Opportunity Radar */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Student Opportunity Radar</h3>
                  <p className="text-xs text-gray-400">Curated Internships, Hackathons & Fellowships</p>
                </div>
              </div>
              <Link href="/opportunities" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {OPPORTUNITIES_DATA.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {opp.category}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" /> {opp.location}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{opp.title}</h4>
                    <p className="text-xs text-cyan-300 font-medium">{opp.organization} • {opp.stipendOrPrize}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{opp.description}</p>
                  </div>

                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Today in Tech & Space Fact Ticker */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Today in Tech</h3>
                    <p className="text-xs text-gray-400">Intriguing Facts & Daily Bytes</p>
                  </div>
                </div>
                <Link href="/today" className="text-xs font-bold text-pink-400 hover:underline flex items-center gap-1">
                  Read Feed <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Deep Space Voyager Fact Card */}
              {featuredFacts.map((fact) => (
                <div key={fact.id} className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-pink-500/30 mb-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1">
                      <Rocket className="w-3.5 h-3.5" /> {fact.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{fact.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{fact.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">{fact.fact}</p>
                  <span className="text-[10px] text-gray-400 italic">Source: {fact.source}</span>
                </div>
              ))}
            </div>

            {/* Daily Challenge Snippet */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  Daily Problem Challenge
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {DAILY_CHALLENGE_DATA.difficulty}
                </span>
              </div>
              <h5 className="text-xs font-bold text-white mb-1">{DAILY_CHALLENGE_DATA.title}</h5>
              <p className="text-[11px] text-gray-400 line-clamp-2">{DAILY_CHALLENGE_DATA.problemStatement}</p>
              <Link href="/today" className="mt-2 inline-block text-[11px] font-semibold text-cyan-300 hover:underline">
                Solve Challenge →
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
