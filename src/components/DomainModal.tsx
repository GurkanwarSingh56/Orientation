'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ArrowRight, BookOpen, Layers, HelpCircle } from 'lucide-react';
import { DomainItem } from '@/lib/data/domain-data';

export interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: DomainItem | null;
}

export default function DomainModal({ isOpen, onClose, domain }: DomainModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Auto-focus close button when modal opens for keyboard accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !domain) return null;

  const IconComponent = domain.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md transition-opacity duration-300 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="domain-modal-title"
      aria-describedby="domain-modal-desc"
    >
      {/* Modal Dialog Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl rounded-3xl bg-[#0B1124] border border-cyan-500/30 shadow-2xl overflow-hidden my-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                Technology Domain
              </span>
              <h2 id="domain-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white">
                {domain.title}
              </h2>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close modal"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Desktop 2-Column / Mobile Stacked */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 relative z-10">
          
          {/* Left Column: Descriptions, Explanation & Subtopics (8 cols on desktop) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            
            {/* Short Description */}
            <div>
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Short Description
              </h3>
              <p id="domain-modal-desc" className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                {domain.shortDescription}
              </p>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                Educational Explanation
              </h3>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 leading-relaxed">
                {domain.explanation}
              </div>
            </div>

            {/* Subtopics */}
            <div>
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-pink-400" />
                Related Subtopics
              </h3>
              <div className="flex flex-wrap gap-2">
                {domain.subtopics.map((subtopic) => (
                  <span
                    key={subtopic}
                    className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-200 border border-cyan-500/30"
                  >
                    {subtopic}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Quiz Action Card (4 cols on desktop) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#101835] to-[#0A0F24] border border-cyan-500/30 relative overflow-hidden">
            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-block mb-3">
                Interactive Quiz
              </span>
              <h4 className="text-lg font-bold text-white mb-2">
                Test Your Knowledge
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Assess your skills and understanding in {domain.title} with our structured domain quiz.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/live-quiz"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:opacity-95 transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                <span>Take Live Quiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
