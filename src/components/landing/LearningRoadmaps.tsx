'use client';

import { MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const LANDING_ROADMAPS = [
  {
    id: 'web-dev',
    title: 'Zero to Full-Stack Web Developer',
    target: '1st & 2nd Year Students (All Branches)',
    duration: '6 Weeks (5 hrs/week)',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    steps: [
      { num: '01', title: 'HTML5 & Semantic Structure', desc: 'Elements, forms, tables, accessibility, and modern semantic tags.' },
      { num: '02', title: 'CSS3, Flexbox & Responsive Layouts', desc: 'Flexbox, Grid, custom styling, gradients, and mobile-first rules.' },
      { num: '03', title: 'JavaScript Essentials (ES6+)', desc: 'Variables, arrow functions, promises, async/await, and DOM manipulation.' },
      { num: '04', title: 'React & Component Architecture', desc: 'JSX, state management (useState, useEffect), props, and custom hooks.' },
      { num: '05', title: 'Next.js App Router & Cloud Deployment', desc: 'Full-stack React with server components, routing, and Vercel hosting.' },
    ],
  },
  {
    id: 'ai-agents',
    title: 'AI & Autonomous Agents Developer',
    target: 'Students Curious About AI & LLMs',
    duration: '4 Weeks',
    badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    steps: [
      { num: '01', title: 'Prompt Engineering & System Directives', desc: 'Structuring system prompts, JSON formatting, and LLM API basics.' },
      { num: '02', title: 'Embeddings & Vector Search (RAG)', desc: 'Converting text to vectors, Pinecone/Chroma DB, and document search.' },
      { num: '03', title: 'Agentic Tool Calling & Reasoning', desc: 'ReAct pattern, enabling models to execute Python code & search APIs.' },
      { num: '04', title: 'Building Multi-Agent Workflows', desc: 'Orchestrating multi-agent collaboration for automated research.' },
    ],
  },
  {
    id: 'dsa-prep',
    title: 'Off-Campus DSA & Problem Solving Track',
    target: 'Pre-Final & Final Year Students',
    duration: '8 Weeks',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    steps: [
      { num: '01', title: 'Array & String Patterns', desc: 'Two Pointers, Sliding Window, Prefix Sum, Kadanes Algorithm.' },
      { num: '02', title: 'Linear Data Structures', desc: 'Linked Lists, Stacks, Queues, and Hash Maps in C++/Java/Python.' },
      { num: '03', title: 'Trees & Graph Traversals', desc: 'Binary Trees, BSTs, BFS, DFS, Dijkstra, and Topological Sort.' },
      { num: '04', title: 'Dynamic Programming Patterns', desc: 'Memoization, Tabulation, 0/1 Knapsack, and Subsequence patterns.' },
    ],
  },
];

export default function LearningRoadmaps() {
  return (
    <section id="roadmaps" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>GUIDED STEP-BY-STEP PATHS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Structured Learning Roadmaps
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md">
            Follow clear visual progression tracks designed to eliminate confusion and take you step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {LANDING_ROADMAPS.map((rm) => (
            <div key={rm.id} className="p-6 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5 text-cyan-400 text-xs font-mono">
                    <MapPin className="w-4 h-4" />
                    <span>Track</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> {rm.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{rm.title}</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block mb-6 ${rm.badgeColor}`}>
                  Target: {rm.target}
                </span>

                {/* Step Nodes */}
                <div className="space-y-3 mb-6">
                  {rm.steps.map((step) => (
                    <div key={step.num} className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {step.num}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{step.title}</h4>
                        <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">5 Modules Included</span>
                <a
                  href="#cta"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-cyan-300 text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <span>Explore Track</span>
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
