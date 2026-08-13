'use client';

import { Compass, BookOpen, Hammer, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function ExploreTechnology() {
  const pillars = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Emerging Tech & Space Telemetry',
      icon: Compass,
      gradient: 'from-cyan-500 to-blue-600',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Explore daily technical bytes, satellite communications, AI agent paradigms, and curated off-campus student programs.',
    },
    {
      step: '02',
      title: 'LEARN',
      subtitle: 'Zero-Jargon Explanations',
      icon: BookOpen,
      gradient: 'from-violet-500 to-indigo-600',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      description: 'Plain-English concept guides tailored for first-year & non-CSE students with interactive key terms and visual breakdowns.',
    },
    {
      step: '03',
      title: 'BUILD',
      subtitle: 'Real Projects & Open Source',
      icon: Hammer,
      gradient: 'from-pink-500 to-rose-600',
      badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      description: 'Turn foundational knowledge into real-world code. Access project starter guides, GitHub best practices, and code snippets.',
    },
    {
      step: '04',
      title: 'CONNECT',
      subtitle: 'Student Technology Ecosystem',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Engage with fellow student developers, participate in technical workshops, and collaborate across branches.',
    },
  ];

  return (
    <section id="explore" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              Core Learning Blueprint
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Discover → Learn → Build → Connect
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-3 max-w-xl mx-auto leading-relaxed">
            Technovate provides a structured pathway for every student to grow from a curious beginner to a confident technology creator.
          </p>
        </div>

        {/* 4 Pillar Cards Grid - Optimized for Mobile 360px & 390px viewports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group p-5 sm:p-6 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-gray-400">{p.step}</span>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${p.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 tracking-wide group-hover:text-cyan-300 transition-colors">
                    {p.title}
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block mb-3 ${p.badgeColor}`}>
                    {p.subtitle}
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">{p.description}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Phase {p.step}</span>
                  <a
                    href="#topics"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
