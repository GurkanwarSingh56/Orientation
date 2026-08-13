'use client';

import Link from 'next/link';
import { Compass, BookOpen, Hammer, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function PhilosophyPillars() {
  const pillars = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Today in Tech & Opportunities',
      icon: Compass,
      gradient: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/30',
      description: 'Explore daily tech bytes, deep space facts (like Voyager 1 transmissions), and off-campus student opportunity radars (GSoC, MLH, Hackathons).',
      href: '/today'
    },
    {
      step: '02',
      title: 'LEARN',
      subtitle: 'Tech Hub & Roadmaps',
      icon: BookOpen,
      gradient: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/30',
      description: 'Zero-jargon explanations designed for 1st-year & non-CSE students across AI, Web Dev, Cybersecurity, DSA, Cloud, and Space Satellites.',
      href: '/tech-hub'
    },
    {
      step: '03',
      title: 'BUILD',
      subtitle: 'Student Projects Showcase',
      icon: Hammer,
      gradient: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-500/30',
      description: 'Turn concepts into real code. Showcase your side-projects, share demo links, receive peer reviews, and earn Technovate badges.',
      href: '/projects'
    },
    {
      step: '04',
      title: 'CONNECT',
      subtitle: 'Discussions & Events',
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-500/30',
      description: 'Ask questions in student forums, join hands-on Technovate AI agent workshops, and collaborate with peers across departments.',
      href: '/discussions'
    },
    {
      step: '05',
      title: 'GROW',
      subtitle: 'Internship & Career Prep',
      icon: TrendingUp,
      gradient: 'from-pink-500 to-emerald-500',
      borderColor: 'border-pink-500/30',
      description: 'Track your roadmap completion progress, master interview coding patterns, and get ready for top software internships.',
      href: '/roadmaps'
    }
  ];

  return (
    <section className="py-20 bg-[#0B0F19] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Our Core Philosophy</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Technovate Transforms Student Learning
          </h3>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            A continuous loop engineered to take you from a curious beginner to a confident technology creator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`relative group rounded-2xl p-5 bg-white/5 border ${p.borderColor} backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-gray-400">{p.step}</span>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${p.gradient} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-white tracking-wider mb-0.5">{p.title}</h4>
                  <p className="text-xs font-semibold text-cyan-400 mb-3">{p.subtitle}</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{p.description}</p>
                </div>

                <Link
                  href={p.href}
                  className="mt-6 inline-flex items-center space-x-1.5 text-xs font-bold text-gray-300 group-hover:text-cyan-400 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
