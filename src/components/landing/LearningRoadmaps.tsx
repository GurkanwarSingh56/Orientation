'use client';

import { MapPin, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export const ROADMAP_PATHS = [
  {
    id: 'web-dev',
    title: 'Web Development',
    category: 'Full-Stack Track',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    stages: ['HTML', 'CSS', 'JavaScript', 'React', 'Backend', 'Database', 'Deployment'],
  },
  {
    id: 'dsa-prep',
    title: 'DSA & Interview Preparation',
    category: 'Problem Solving Track',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    stages: ['Programming', 'Arrays', 'Data Structures', 'Algorithms', 'Problem Solving', 'Interviews'],
  },
  {
    id: 'ai-agents',
    title: 'AI & AI Agents',
    category: 'AI Engineer Track',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-500/10',
    stages: ['Python', 'ML', 'Deep Learning', 'LLMs', 'RAG', 'AI Agents'],
  },
  {
    id: 'cloud-aws',
    title: 'Cloud & AWS',
    category: 'Cloud Architecture Track',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-500/10',
    stages: ['Networking', 'Linux', 'Cloud', 'AWS', 'Deployment', 'Architecture'],
  },
];

export default function LearningRoadmaps() {
  return (
    <section id="roadmaps" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONNECTED STEP TRACKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Don't Know What To Learn?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
            Choose a path and follow it step by step.
          </p>
        </div>

        {/* 4 Connected Stage Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROADMAP_PATHS.map((rm) => (
            <div
              key={rm.id}
              className="p-6 rounded-3xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${rm.badgeColor}`}>
                    {rm.category}
                  </span>
                  <div className="flex items-center space-x-1 text-cyan-400 text-xs font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{rm.stages.length} Stages</span>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-white mb-5 group-hover:text-cyan-300 transition-colors">
                  {rm.title}
                </h3>

                {/* Connected Stages Visual Flow */}
                <div className="flex items-center flex-wrap gap-2 mb-6">
                  {rm.stages.map((stage, idx) => (
                    <div key={stage} className="flex items-center">
                      <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-black/40 text-gray-200 border border-white/10 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors">
                        {stage}
                      </span>
                      {idx < rm.stages.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mx-1 opacity-70" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono">Structured Pathway</span>
                <a
                  href="#cta"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-transform"
                >
                  <span>View Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
