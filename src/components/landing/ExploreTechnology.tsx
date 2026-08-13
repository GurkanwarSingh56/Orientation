'use client';

import { Bot, ShieldAlert, Globe, Code2, Database, Cloud, Rocket, GitBranch, ArrowRight, Sparkles, Zap } from 'lucide-react';

export interface ExploreTechnologyProps {
  activeCategoryFilter?: string;
  onSelectCategory?: (id: string) => void;
}

export default function ExploreTechnology({ activeCategoryFilter, onSelectCategory }: ExploreTechnologyProps) {
  const featuredCategory = {
    id: 'ai-agents',
    title: 'AI & AI Agents',
    icon: Bot,
    description: 'Understand Large Language Models, Generative AI, Retrieval-Augmented Generation (RAG), and autonomous agents that reason and execute multi-step tasks.',
    topics: ['AI Fundamentals', 'LLMs', 'Generative AI', 'RAG Systems', 'AI Agents'],
    badge: 'Featured Domain',
  };

  const supportingCategories = [
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      icon: ShieldAlert,
      description: 'Explore ethical hacking, web vulnerabilities, authentication, and network protection.',
      topics: ['Authentication', 'Encryption', 'Network Security', 'OWASP', 'Ethical Hacking'],
      accentColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      icon: Globe,
      description: 'Build modern applications with modern frontend frameworks and scalable backends.',
      topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Backend APIs'],
      accentColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      id: 'dsa-prep',
      title: 'DSA & Interview Prep',
      icon: Code2,
      description: 'Master core data structures and algorithmic patterns for problem solving.',
      topics: ['Arrays', 'Strings', 'Sorting', 'Linked Lists', 'Trees', 'Graphs'],
      accentColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      id: 'databases',
      title: 'Databases',
      icon: Database,
      description: 'Learn relational tables vs document stores, schema design, and query optimization.',
      topics: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'],
      accentColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
    {
      id: 'cloud-aws',
      title: 'Cloud & AWS',
      icon: Cloud,
      description: 'Understand cloud computing infrastructure, virtual servers, S3 storage, and serverless.',
      topics: ['Cloud', 'EC2', 'S3', 'Lambda', 'IAM'],
      accentColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    },
    {
      id: 'space-satellites',
      title: 'Space & Satellites',
      icon: Rocket,
      description: 'Discover satellite orbits, GPS triangulation, and interstellar space communication telemetry.',
      topics: ['Satellites', 'GPS', 'Voyager 1', 'Voyager 2', 'Space Communication'],
      accentColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    },
    {
      id: 'github-tools',
      title: 'GitHub & Developer Tools',
      icon: GitBranch,
      description: 'Master Git version control, collaboration, Pull Requests, and open-source programs.',
      topics: ['Git', 'GitHub', 'GitHub Education', 'Open Source', 'Developer Tools'],
      accentColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
  ];

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
                  <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" /> {featuredCategory.badge}
                </span>
                <featuredCategory.icon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {featuredCategory.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                {featuredCategory.description}
              </p>

              <div className="mb-6">
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">Learn about:</span>
                <div className="flex flex-wrap gap-2">
                  {featuredCategory.topics.map((t) => (
                    <span key={t} className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-200 border border-cyan-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="#topics"
              onClick={() => onSelectCategory && onSelectCategory(featuredCategory.id)}
              className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
            >
              <span>Explore AI & AI Agents</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 7 Supporting Categories Grid (Spans 7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {supportingCategories.map((cat) => {
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
                      {cat.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.topics.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#topics"
                    onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2 border-t border-white/10"
                  >
                    <span>Explore Domain</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
