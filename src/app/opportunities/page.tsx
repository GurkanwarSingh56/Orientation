'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Briefcase, Search, ExternalLink, MapPin, Calendar, Sparkles } from 'lucide-react';
import { OPPORTUNITIES_DATA } from '@/lib/data/opportunities-data';

export default function OpportunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOpportunities = OPPORTUNITIES_DATA.filter((opp) => {
    const matchesCat = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesQuery = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Student Career & Growth Radar</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Student Opportunities Radar</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
            Curated internships, global open source programs (GSoC, MLH), student hackathons, and fellowship grants for all college branches.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 max-w-3xl">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search programs (e.g. GSoC, ISRO, Microsoft, MLH)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Open Source', 'Hackathon', 'Grant / Fellowship'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Cards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {opp.category}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Deadline: {opp.deadline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{opp.title}</h3>
                  <p className="text-xs text-emerald-400 font-bold mb-2">{opp.organization} • {opp.stipendOrPrize}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-300 mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {opp.location}</span>
                    <span>•</span>
                    <span className="text-cyan-300">Eligibility: {opp.eligibility}</span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-6">{opp.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {opp.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Apply Official Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
