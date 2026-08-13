'use client';

import Link from 'next/link';
import { FolderGit2, ThumbsUp, ExternalLink, Github, ArrowRight, User } from 'lucide-react';
import { PROJECTS_DATA } from '@/lib/data/projects-data';

export default function ProjectsPreview() {
  return (
    <section className="py-20 bg-[#0B0F19] relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Student Innovation</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Projects Showcase</h2>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link
              href="/projects/submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-90"
            >
              Submit Your Project
            </Link>
            <Link href="/projects" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS_DATA.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {proj.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-cyan-400 font-bold bg-white/5 px-2.5 py-1 rounded-full">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{proj.upvotes}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5">{proj.title}</h3>
                <p className="text-xs text-cyan-300 font-medium mb-3">{proj.tagline}</p>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">{proj.description}</p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                    {proj.author.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{proj.author.name}</p>
                    <p className="text-[10px] text-gray-400">{proj.author.branch} ({proj.author.year})</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300">
                    <Github className="w-4 h-4" />
                  </a>
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
