'use client';

import { HelpCircle, Bug, Cpu, Terminal, Sparkles } from 'lucide-react';

export const DID_YOU_KNOW_FACTS = [
  {
    id: 'first-bug',
    title: 'The Origin of the Term "Computer Bug"',
    icon: Bug,
    text: 'In 1947, computer pioneer Grace Hopper recorded the first actual computer bug — a real moth trapped inside Relay #70 of the Harvard Mark II computer!',
  },
  {
    id: 'voyager-memory',
    title: 'Voyager 1 Operates on 68 Kilobytes Memory',
    icon: Cpu,
    text: 'Voyager 1, currently traveling through interstellar space over 24 billion km from Earth, operates on a computer with just 68 Kilobytes of memory — less memory than a modern digital watch!',
  },
  {
    id: 'supercomputers-linux',
    title: 'Linux Powers 100% of World Supercomputers',
    icon: Terminal,
    text: 'Every single one of the top 500 fastest supercomputers in the world runs on Linux operating system distributions due to its open-source kernel speed and customization.',
  },
  {
    id: 'quantum-bits',
    title: 'Qubits & Superposition',
    icon: Sparkles,
    text: 'Unlike classical binary bits that represent either 0 or 1, quantum bits (qubits) can exist in a superposition of both states simultaneously, unlocking massive parallel computation.',
  },
];

export default function DidYouKnow() {
  return (
    <section id="facts" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>SPARKS OF CURIOSITY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Did You Know?</h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2">
            Fascinating technical facts designed to spark wonder and inspire your journey into computing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {DID_YOU_KNOW_FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <div key={fact.id} className="p-5 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{fact.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{fact.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
