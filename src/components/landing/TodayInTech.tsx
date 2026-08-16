'use client';

import { Flame, Rocket, Cpu, Globe, ShieldAlert, GitBranch, ArrowRight, Calendar } from 'lucide-react';

export const TODAY_EDITORIAL_CARDS = [
  {
    id: 'ai-agents-today',
    category: 'AI & Agents',
    title: 'Autonomous Agents & Multi-Step Reasoning',
    icon: Cpu,
    summary: 'How modern LLMs transition from text generation to taking actions via tool calling, code execution, and web API queries.',
    date: 'August 13, 2026',
    readLink: 'https://en.wikipedia.org/wiki/Intelligent_agent',
  },
  {
    id: 'space-telemetry',
    category: 'Space & Satellites',
    title: 'Voyager 1 Deep Space Telemetry at 23 Watts',
    icon: Rocket,
    summary: 'NASA Deep Space Network antennas capture radio signals from 24 billion km away powered by less electricity than a light bulb.',
    date: 'August 13, 2026',
    readLink: 'https://en.wikipedia.org/wiki/Voyager_1',
  },
  {
    id: 'cybersecurity-subsea',
    category: 'Cybersecurity & Subsea',
    title: 'Subsea Ocean Fiber Optic Infrastructure Security',
    icon: ShieldAlert,
    summary: 'Over 99% of global internet traffic travels through undersea optical fiber cables protected by cryptographic encryption.',
    date: 'August 13, 2026',
    readLink: 'https://en.wikipedia.org/wiki/Submarine_communications_cable',
  },
  {
    id: 'devtools-git',
    category: 'Developer Tools',
    title: 'How Git Manages Distributed Version History',
    icon: GitBranch,
    summary: 'Inside the Directed Acyclic Graph (DAG) object store that makes Git branch switching instant and conflict resolution predictable.',
    date: 'August 13, 2026',
    readLink: 'https://en.wikipedia.org/wiki/Git',
  },
];

export default function TodayInTech() {
  return (
    <section id="today" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
              <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>CURATED BY TECHNOVATE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Today in Tech
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md">
            A few things worth knowing. Curated technology insights and engineering breakdowns.
          </p>
        </div>

        {/* 4 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TODAY_EDITORIAL_CARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5 text-cyan-400" /> {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" /> {item.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">Curated Briefing</span>
                  <a
                    href={item.readLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read →</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
