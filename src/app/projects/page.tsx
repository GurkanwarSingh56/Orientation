'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FolderGit2, ThumbsUp, ExternalLink, Github, PlusCircle, Search } from 'lucide-react';
import { PROJECTS_DATA } from '@/lib/data/projects-data';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = PROJECTS_DATA.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-widest mb-2">
                <FolderGit2 className="w-4 h-4" />
                <span>Student Innovation Showcase</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Projects Showcase</h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
                Discover awesome side-projects built by college peers, test live demos, and submit your own work.
              </p>
            </div>

            <Link
              href="/projects/submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg flex items-center space-x-2 shrink-0 hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Project</span>
            </Link>
          </div>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by stack or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((proj) => (
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
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300">
                      <Github className="w-4 h-4" />
                    </a>
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1">
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
