'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { DOMAIN_ITEMS, FEATURED_DOMAIN, DomainItem } from '@/lib/data/domain-data';
import Link from 'next/link';
import DomainModal from '@/components/DomainModal';

export interface ExploreTechnologyProps {
  activeCategoryFilter?: string;
  onSelectCategory?: (id: string) => void;
}

export default function ExploreTechnology({ activeCategoryFilter, onSelectCategory }: ExploreTechnologyProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDomainModal = (domain: DomainItem) => {
    setSelectedDomain(domain);
    setIsModalOpen(true);
    if (onSelectCategory) {
      onSelectCategory(domain.id);
    }
  };

  const handleCloseDomainModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="explore" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>KNOWLEDGE DIRECTORY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Explore Technology
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
            You don't need to know where to start. Pick something that interests you.
          </p>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Prominent Featured Category Hero Card (Spans 5 cols on lg) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" /> {FEATURED_DOMAIN.badge}
                </span>
                <FEATURED_DOMAIN.icon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {FEATURED_DOMAIN.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                {FEATURED_DOMAIN.shortDescription}
              </p>

              <div className="mb-6">
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">Learn about:</span>
                <div className="flex flex-wrap gap-2">
                  {FEATURED_DOMAIN.subtopics.map((t) => (
                    <span key={t} className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-200 border border-cyan-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleOpenDomainModal(FEATURED_DOMAIN)}
                className="w-full py-3 rounded-2xl bg-white/5 text-white font-bold text-xs flex items-center justify-center space-x-2 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span>Explore AI & AI Agents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <Link
                href={`/live-quiz?topic=${FEATURED_DOMAIN.quizSlug}`}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
              >
                <span>Take Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 7 Supporting Categories Grid (Spans 7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOMAIN_ITEMS.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {cat.title}
                      </h4>
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed mb-3">
                      {cat.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.subtopics.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDomainModal(cat)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>Explore Domain</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <Link
                      href={`/live-quiz?topic=${cat.quizSlug}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Take Quiz</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Reusable Domain Modal */}
      <DomainModal
        isOpen={isModalOpen}
        onClose={handleCloseDomainModal}
        domain={selectedDomain}
      />
    </section>
  );
}
