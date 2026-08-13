'use client';

import { Bot, ShieldAlert, Globe, Code2, Database, Cloud, Rocket, GitBranch, ArrowRight, Sparkles } from 'lucide-react';

export interface FeaturedTopicsProps {
  activeCategoryFilter?: string;
}

export const FEATURED_TOPIC_CARDS = [
  {
    id: 'ai-agents',
    title: 'AI & AI Agents',
    icon: Bot,
    topicsCount: 7,
    difficulty: 'Beginner to Advanced',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    summary: 'Explore LLMs, Generative AI, Retrieval-Augmented Generation (RAG), and Autonomous AI Agents that reason and execute tasks using digital tools.',
    keyTerms: ['LLMs', 'Prompt Engineering', 'RAG Vector Search', 'Tool Calling', 'ReAct Pattern'],
    popularTopic: 'How AI Agents use tools to write & debug code'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: ShieldAlert,
    topicsCount: 6,
    difficulty: 'Beginner Friendly',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    summary: 'Master ethical hacking, secure authentication, password hashing, network security, and the OWASP Top 10 web vulnerabilities.',
    keyTerms: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'Encryption', 'OWASP Top 10', 'Cyber Hygiene'],
    popularTopic: 'Understanding SQL Injection & Parameterized Queries'
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    icon: Globe,
    topicsCount: 8,
    difficulty: 'All Levels',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-500/10',
    summary: 'Build modern responsive websites with HTML5, CSS3, JavaScript ES6+, React, Next.js App Router, REST APIs, and Vercel cloud deployment.',
    keyTerms: ['HTML/CSS', 'JavaScript ES6+', 'React Components', 'Next.js App Router', 'REST APIs'],
    popularTopic: 'Zero to Full-Stack Web Development Starter Path'
  },
  {
    id: 'dsa-prep',
    title: 'DSA & Interview Preparation',
    icon: Code2,
    topicsCount: 11,
    difficulty: 'Intermediate',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    summary: 'Master fundamental data structures and algorithmic problem-solving patterns required for technical interviews and off-campus placements.',
    keyTerms: ['Two Pointers', 'Sliding Window', 'Binary Trees', 'Graphs (BFS/DFS)', 'Dynamic Programming'],
    popularTopic: 'Two Pointers Technique for Linear O(N) Array Operations'
  },
  {
    id: 'databases',
    title: 'Databases & Data Architecture',
    icon: Database,
    topicsCount: 7,
    difficulty: 'Beginner Friendly',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
    summary: 'Learn relational tables (PostgreSQL, MySQL) vs document NoSQL stores (MongoDB, Firestore, Redis), indexing, and schema design.',
    keyTerms: ['SQL Queries', 'Relational Schema', 'NoSQL JSON', 'ACID Transactions', 'Indexing'],
    popularTopic: 'SQL vs NoSQL: When to choose Relational or Document Stores'
  },
  {
    id: 'cloud-aws',
    title: 'Cloud & AWS Architecture',
    icon: Cloud,
    topicsCount: 8,
    difficulty: 'Beginner Friendly',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-500/10',
    summary: 'Discover cloud computing fundamentals, AWS EC2 virtual servers, S3 object storage buckets, and serverless Lambda functions.',
    keyTerms: ['Cloud Computing', 'AWS EC2', 'Amazon S3', 'AWS Lambda', 'Cloud Security'],
    popularTopic: 'Hosting Assets & Web Applications on AWS Cloud'
  },
  {
    id: 'space-satellites',
    title: 'Space & Satellites',
    icon: Rocket,
    topicsCount: 7,
    difficulty: 'Curiosity Driven',
    badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-500/10',
    summary: 'Explore satellite communications, orbital telemetry, GPS triangulation, Earth observation, and deep space probes like Voyager 1 & 2.',
    keyTerms: ['Deep Space Network', 'Voyager 1 Telemetry', 'GPS Triangulation', 'Orbital Mechanics'],
    popularTopic: 'Voyager 1: Transmitting across 24B km at 23 Watts'
  },
  {
    id: 'github-tools',
    title: 'GitHub & Developer Tools',
    icon: GitBranch,
    topicsCount: 8,
    difficulty: 'Essential Starter',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
    summary: 'Master Git version control, GitHub collaboration, Pull Requests, Open Source contributions (GSoC), and terminal developer workflows.',
    keyTerms: ['Git Commit', 'Pull Requests', 'Repository Forking', 'Open Source (GSoC)', 'VS Code'],
    popularTopic: 'Git Version Control & Making Your First Open Source PR'
  }
];

export default function FeaturedTopics({ activeCategoryFilter = 'all' }: FeaturedTopicsProps) {
  const filteredTopics = FEATURED_TOPIC_CARDS.filter((topic) => {
    if (activeCategoryFilter === 'all') return true;
    return topic.id === activeCategoryFilter;
  });

  return (
    <section id="topics" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CURATED KNOWLEDGE ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Explore Technology Domains
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md">
            Zero-jargon explanations, key terms, and visual breakdowns for 8 core technology categories.
          </p>
        </div>

        {/* 8 Category Cards Grid - Highly Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                className="group p-5 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${topic.badgeColor}`}>
                      {topic.topicsCount} Topics
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {topic.title}
                  </h3>
                  
                  <span className="text-[10px] font-mono text-gray-400 block mb-3">
                    Level: {topic.difficulty}
                  </span>

                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {topic.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 mb-4">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-400" /> Highlighted Guide
                    </span>
                    <p className="text-xs text-gray-200 font-medium">{topic.popularTopic}</p>
                  </div>

                  {/* Key Terms Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {topic.keyTerms.map((term) => (
                      <span
                        key={term}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Non-CSE Friendly</span>
                  <a
                    href="#roadmaps"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>View Track</span>
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
