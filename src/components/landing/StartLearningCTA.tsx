'use client';

import { Compass, MapPin, Sparkles } from 'lucide-react';

export default function StartLearningCTA() {
  return (
    <section id="cta" className="py-24 sm:py-28 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 via-violet-600/15 to-pink-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#0B1124] via-[#0E1730] to-[#0B1124] border border-cyan-500/40 backdrop-blur-xl text-center relative overflow-hidden shadow-2xl">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TECHNOVATE STUDENT PLATFORM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            You Don't Need To Know Everything.
          </h2>

          <p className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 mt-2">
            Just Start Somewhere.
          </p>

          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed">
            Pick one technology. Follow one roadmap. Build one project. Learn from the process.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#explore"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Technology</span>
            </a>

            <a
              href="#roadmaps"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all backdrop-blur-md"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Start a Roadmap</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
