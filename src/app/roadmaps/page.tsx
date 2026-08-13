'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { MapPin, ArrowRight, Clock, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROADMAPS_DATA } from '@/lib/data/roadmaps-data';

export default function RoadmapsIndexPage() {
  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <MapPin className="w-4 h-4" />
            <span>Guided Step-by-Step Learning Tracks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Technovate Roadmaps</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
            Follow structured paths tailored for beginners, non-CSE students, and developers aiming for off-campus internships.
          </p>
        </div>
      </section>

      {/* Roadmaps Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ROADMAPS_DATA.map((rm) => (
              <div
                key={rm.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {rm.badge}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> {rm.estimatedDuration}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">{rm.title}</h2>
                  <p className="text-xs text-cyan-300 font-medium mb-3">Target: {rm.targetAudience}</p>
                  <p className="text-xs text-gray-300 leading-relaxed mb-6">{rm.description}</p>

                  <div className="space-y-2 mb-6">
                    {rm.nodes.map((node, i) => (
                      <div key={node.id} className="flex items-center space-x-2 text-xs text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <span className="truncate">{node.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/roadmaps/${rm.slug}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md hover:opacity-90 transition-opacity"
                >
                  <span>Open Interactive Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
