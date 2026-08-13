'use client';

import { Rocket, Bot, GitBranch, MapPin, Globe, Database, Cloud, Sparkles, Clock, ArrowRight, BookOpen } from 'lucide-react';

export interface FeaturedTopicsProps {
  activeCategoryFilter?: string;
}

export default function FeaturedTopics({ activeCategoryFilter = 'all' }: FeaturedTopicsProps) {
  const dominantTopic = {
    id: 'voyager-1',
    category: 'Space & Telemetry',
    title: 'Voyager 1 Deep Space Telemetry',
    question: 'How is a spacecraft launched in 1977 still communicating with Earth across 24 billion kilometers?',
    explanation: 'Voyager 1 uses NASA Deep Space Network giant parabolic dishes to capture its 23-Watt radio signal traveling at light speed for ~22.5 hours across interstellar space.',
    readingTime: '5 min read',
    difficulty: 'Curiosity Driven',
    icon: Rocket,
  };

  const supportingTopics = [
    {
      id: 'ai-agents',
      category: 'AI & Agents',
      title: 'Autonomous AI Agents',
      question: 'What makes an AI system capable of taking actions instead of simply generating text?',
      explanation: 'AI Agents use ReAct tool calling to evaluate state, write code, query databases, and autonomously execute multi-step goals.',
      readingTime: '6 min read',
      difficulty: 'Intermediate',
      icon: Bot,
    },
    {
      id: 'git-commit',
      category: 'Developer Tools',
      title: 'Inside Git Commit Objects',
      question: 'What actually happens when you run git commit?',
      explanation: 'Git creates a compressed DAG snapshot object containing tree hashes, author timestamps, and parent commit pointer references.',
      readingTime: '4 min read',
      difficulty: 'Beginner',
      icon: GitBranch,
    },
    {
      id: 'gps-triangulation',
      category: 'Space & Satellites',
      title: 'Satellite GPS Triangulation',
      question: 'How can your phone determine where you are anywhere on Earth?',
      explanation: 'By calculating the microsecond time-of-arrival delay of atomic-clock radio signals from at least 4 orbital GPS satellites.',
      readingTime: '5 min read',
      difficulty: 'Beginner',
      icon: MapPin,
    },
    {
      id: 'web-navigation',
      category: 'Web Development',
      title: 'The Lifecycle of a Web Request',
      question: 'What happens after you type a URL and press Enter in your browser?',
      explanation: 'DNS lookup resolves IP, TLS handshake establishes encryption, HTTP GET returns HTML, and browser DOM engine renders CSS/JS.',
      readingTime: '6 min read',
      difficulty: 'Beginner',
      icon: Globe,
    },
    {
      id: 'sql-vs-nosql',
      category: 'Databases',
      title: 'SQL vs NoSQL Architecture',
      question: 'Why do different applications use different kinds of databases?',
      explanation: 'SQL guarantees multi-table ACID transactions, whereas NoSQL document stores offer flexible horizontal scaling for JSON feeds.',
      readingTime: '5 min read',
      difficulty: 'Beginner',
      icon: Database,
    },
    {
      id: 'aws-ec2',
      category: 'Cloud Computing',
      title: 'Virtual Servers & AWS EC2',
      question: 'What does renting a computer in the cloud actually mean?',
      explanation: 'AWS runs physical hypervisor servers that allocate virtualized CPU cores, RAM, and EBS virtual hard drives on-demand.',
      readingTime: '4 min read',
      difficulty: 'Beginner',
      icon: Cloud,
    },
    {
      id: 'rag-systems',
      category: 'AI & Systems',
      title: 'Retrieval-Augmented Generation (RAG)',
      question: 'How can an AI system use external documents when answering questions?',
      explanation: 'RAG converts private PDFs into vector embeddings, performs similarity search, and injects relevant context directly into the prompt.',
      readingTime: '5 min read',
      difficulty: 'Intermediate',
      icon: Sparkles,
    },
  ];

  return (
    <section id="topics" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>EDITORIAL EXPLANATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Things Worth Knowing
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
            Short explanations of the technology behind the things you use every day.
          </p>
        </div>

        {/* Editorial Layout: Dominant Topic + Supporting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Dominant Featured Topic (Voyager 1) */}
          <div className="lg:col-span-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#131C38] via-[#0E172F] to-[#131C38] border border-pink-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-pink-400" /> {dominantTopic.category}
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> {dominantTopic.readingTime}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {dominantTopic.title}
              </h3>
              <p className="text-sm font-semibold text-cyan-300 mb-3 leading-relaxed">
                "{dominantTopic.question}"
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {dominantTopic.explanation}
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="#today"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-pink-500/20 hover:opacity-90 transition-opacity"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 7 Supporting Editorial Topic Cards */}
          {supportingTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {topic.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> {topic.readingTime}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-xs font-semibold text-cyan-400 mb-2 leading-relaxed">
                    "{topic.question}"
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {topic.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">{topic.difficulty}</span>
                  <a
                    href="#roadmaps"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Read Explanation</span>
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
