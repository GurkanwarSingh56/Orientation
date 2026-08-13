'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ROADMAPS_DATA } from '@/lib/data/roadmaps-data';
import { MapPin, CheckCircle2, Clock, BookOpen, ExternalLink, ArrowLeft, Sparkles, Check } from 'lucide-react';

export default function InteractiveRoadmapPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const roadmap = ROADMAPS_DATA.find((r) => r.slug === slug);
  const [completedNodes, setCompletedNodes] = useState<Record<string, boolean>>({});

  if (!roadmap) {
    return (
      <main className="bg-[#0B0F19] min-h-screen text-white pt-28 px-4 text-center">
        <Navbar />
        <h1 className="text-2xl font-bold text-red-400">Roadmap Not Found</h1>
        <Link href="/roadmaps" className="mt-4 inline-block text-cyan-400 underline">Back to Roadmaps</Link>
      </main>
    );
  }

  const toggleNode = (id: string) => {
    setCompletedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedNodes).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / roadmap.nodes.length) * 100);

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-10 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/roadmaps" className="text-cyan-400 text-xs font-mono flex items-center gap-1 mb-3 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Roadmaps
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {roadmap.badge}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">{roadmap.title}</h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">{roadmap.description}</p>
            </div>

            {/* Progress Counter Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center shrink-0 min-w-[150px]">
              <p className="text-2xl font-extrabold text-cyan-400">{progressPercent}%</p>
              <p className="text-[10px] text-gray-400 font-mono">Progress Completed</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Step Nodes List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          {roadmap.nodes.map((node, index) => {
            const isDone = !!completedNodes[node.id];
            return (
              <div
                key={node.id}
                className={`p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-white/5 border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleNode(node.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-white/30 bg-white/5 text-transparent hover:border-cyan-400'
                      }`}
                    >
                      <Check className="w-4 h-4 font-black" />
                    </button>

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                          Step {index + 1} • {node.level}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" /> ~{node.estimatedHours} Hours
                        </span>
                      </div>

                      <h3 className={`text-base font-bold transition-colors ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {node.title}
                      </h3>

                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{node.description}</p>
                    </div>
                  </div>
                </div>

                {/* Node Resources */}
                {node.resources && node.resources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-cyan-400" /> Recommended:
                    </span>
                    {node.resources.map((res) => (
                      <a
                        key={res.title}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 flex items-center gap-1 transition-colors"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
