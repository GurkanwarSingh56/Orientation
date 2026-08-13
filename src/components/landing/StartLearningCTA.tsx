'use client';

import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function StartLearningCTA() {
  return (
    <section id="cta" className="py-20 sm:py-24 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-cyan-500/10 via-violet-600/10 to-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B1124] border border-cyan-500/30 backdrop-blur-xl text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technovate Student Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to Start Your Technology Journey?
          </h2>

          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed">
            Whether you are a first-year student taking your initial coding steps or a pre-final year student preparing for off-campus roles, Technovate is built for you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#topics"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Topics</span>
            </a>

            <a
              href="#roadmaps"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all backdrop-blur-md"
            >
              <span>View Roadmaps</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
