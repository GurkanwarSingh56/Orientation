'use client';

import { Flame, Rocket, Cpu, Globe, Code2, Sparkles } from 'lucide-react';

export const TODAY_TECH_FACTS = [
  {
    id: 'voyager-1',
    category: 'Space Tech',
    title: 'Voyager 1 Transmits at 23 Watts Across 24B Kilometers',
    icon: Rocket,
    fact: 'Launched in 1977, Voyager 1 communicates with NASA from interstellar space using a radio transmitter powered at just 23 Watts — less than a standard refrigerator light bulb!',
    source: 'NASA Jet Propulsion Laboratory',
  },
  {
    id: 'subsea-cables',
    category: 'Networking',
    title: '99% of Global Internet Runs on Subsea Ocean Cables',
    icon: Globe,
    fact: 'Contrary to popular belief, over 99% of international internet traffic travels through fiber-optic cables laid on the ocean floor, not satellites!',
    source: 'Telegeography Submarine Cable Map',
  },
  {
    id: 'matrix-llm',
    category: 'AI & Machine Learning',
    title: 'GPT Models & 2D Matrix Multiplication',
    icon: Cpu,
    fact: 'Over 95% of GPU compute spent during Large Language Model neural network inference is consumed by 2D matrix multiplication operations at scale.',
    source: 'NVIDIA Research',
  },
];

export const TODAY_DSA_CHALLENGE = {
  title: 'Valid Palindrome (Two Pointers Pattern)',
  difficulty: 'Easy',
  category: 'Arrays & Strings',
  statement: 'Given a string `s`, return `true` if it reads the same forward and backward after converting all uppercase letters into lowercase and removing non-alphanumeric characters.',
  exampleInput: 's = "A man, a plan, a canal: Panama"',
  exampleOutput: 'true ("amanaplanacanalpanama")',
  hint: 'Initialize one pointer at the start (index 0) and one at the end (index N-1). Move them inward skipping punctuation!',
};

export default function TodayInTech() {
  return (
    <section id="today" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Curated Tech Bytes */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 rounded-xl bg-white/5 border border-cyan-500/30 text-cyan-400">
                <Flame className="w-5 h-5 animate-pulse text-pink-400" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Daily Technology Stream
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Today in Tech</h2>
              </div>
            </div>

            <div className="space-y-4">
              {TODAY_TECH_FACTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="p-5 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 transition-all backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" /> {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-3">{item.fact}</p>
                    <span className="text-[10px] text-gray-400 italic">Source: {item.source}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Daily DSA Micro-Challenge */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#0B1124] border border-cyan-500/40 backdrop-blur-xl sticky top-28 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-violet-400" /> Daily Coding Pattern
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {TODAY_DSA_CHALLENGE.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{TODAY_DSA_CHALLENGE.title}</h3>
              <p className="text-xs font-mono text-gray-400 mb-3">{TODAY_DSA_CHALLENGE.category}</p>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">{TODAY_DSA_CHALLENGE.statement}</p>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-gray-300 space-y-1 mb-4">
                <p className="text-cyan-400 font-bold text-[10px]">Example Input:</p>
                <p className="text-[11px]">{TODAY_DSA_CHALLENGE.exampleInput}</p>
                <p className="text-emerald-400 font-bold text-[10px] mt-2">Expected Output:</p>
                <p className="text-[11px]">{TODAY_DSA_CHALLENGE.exampleOutput}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 mb-6">
                <span className="font-bold text-cyan-400">Hint: </span>
                {TODAY_DSA_CHALLENGE.hint}
              </div>

              <a
                href="#roadmaps"
                className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-lg hover:opacity-90 block"
              >
                Explore Problem Solving Track
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
