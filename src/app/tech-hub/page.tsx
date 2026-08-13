'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TechHubCategoryGrid from '@/components/tech-hub/TechHubCategoryGrid';
import { Compass, Search, Sparkles, Filter } from 'lucide-react';
import { TECH_CATEGORIES } from '@/lib/data/tech-hub-data';
import Link from 'next/link';

export default function TechHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filteredCategories = TECH_CATEGORIES.map(cat => ({
    ...cat,
    topics: cat.topics.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cat.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = selectedDifficulty === 'All' || t.difficulty === selectedDifficulty;
      return matchesSearch && matchesDiff;
    })
  })).filter(cat => cat.topics.length > 0 || searchQuery === '');

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header Banner */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Compass className="w-4 h-4" />
            <span>Technovate Knowledge Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Technology Hub</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
            Master difficult technical concepts with zero-jargon explanations, key term glossaries, interactive quizzes, and practical applications.
          </p>

          {/* Search & Filter Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 max-w-3xl">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics (e.g. AI Agents, Voyager 1, RAG, SQL, Two Pointers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories & Topics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery === '' ? (
            <TechHubCategoryGrid />
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">{cat.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.topics.map((t) => (
                      <Link
                        key={t.id}
                        href={`/tech-hub/${t.categorySlug}/${t.slug}`}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 transition-all block group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">{t.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                            {t.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-2">{t.summary}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
