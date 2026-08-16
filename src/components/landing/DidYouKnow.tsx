'use client';

import { useState } from 'react';
import { HelpCircle, ArrowRight, RefreshCw, Rocket, Bug, Cpu, Terminal } from 'lucide-react';

export const TRIVIA_FACTS = [
  {
    id: 'voyager-1',
    stat: '1977',
    statLabel: 'Launch Year',
    text: 'Voyager 1 was launched in 1977 and went on to become one of humanity\'s most distant spacecraft.',
    question: 'How is it still communicating with Earth across 24 billion kilometers?',
    storyLink: 'https://en.wikipedia.org/wiki/Voyager_1',
  },
  {
    id: 'first-bug',
    stat: '1947',
    statLabel: 'First Moth Bug',
    text: 'Grace Hopper recorded the first actual computer bug when a real moth got trapped in Relay #70 of the Harvard Mark II.',
    question: 'Why do software engineers still call code defects "bugs" today?',
    storyLink: 'https://en.wikipedia.org/wiki/Software_bug#Etymology',
  },
  {
    id: 'supercomputers',
    stat: '100%',
    statLabel: 'Linux Powered',
    text: 'Every single one of the world\'s top 500 fastest supercomputers runs on Linux operating system distributions.',
    question: 'What makes the open-source Linux kernel so dominant in supercomputing?',
    storyLink: 'https://en.wikipedia.org/wiki/TOP500',
  },
  {
    id: 'memory-voyager',
    stat: '68 KB',
    statLabel: 'Total RAM',
    text: 'Voyager 1 operates its interplanetary science payload on just 68 Kilobytes of memory.',
    question: 'How do NASA engineers optimize software algorithms for extreme resource constraints?',
    storyLink: 'https://en.wikipedia.org/wiki/Voyager_1#Computers_and_data_processing',
  },
];

export default function DidYouKnow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextFact = () => {
    setCurrentIndex((prev) => (prev + 1) % TRIVIA_FACTS.length);
  };

  const currentFact = TRIVIA_FACTS[currentIndex];

  return (
    <section id="facts" className="py-20 sm:py-24 bg-[#03050D] relative border-t border-cyan-500/20 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-r from-pink-500/10 via-violet-600/10 to-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCIENTIFIC CURIOSITY</span>
          </div>

          <button
            onClick={handleNextFact}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-cyan-300 text-xs font-bold flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next Fact</span>
          </button>
        </div>

        {/* Distinct Large Fact Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0B1124] via-[#0E1630] to-[#0B1124] border border-cyan-500/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Large Stat Display */}
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
              <span className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 font-mono tracking-tight block">
                {currentFact.stat}
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400/80 mt-1 block">
                {currentFact.statLabel}
              </span>
            </div>

            {/* Fact Text & Interactive Question */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Did You Know?
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                {currentFact.text}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-cyan-300 italic">
                "{currentFact.question}"
              </p>

              <div className="pt-4">
                <a
                  href={currentFact.storyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
                >
                  <span>Explore the story →</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
