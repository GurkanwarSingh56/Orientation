'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Search, PlusCircle, User } from 'lucide-react';
import { DISCUSSIONS_DATA } from '@/lib/data/discussions-data';

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDiscussions = DISCUSSIONS_DATA.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-widest mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Student Community & Knowledge Exchange</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Student Discussions</h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
                Ask questions, share advice with seniors, discuss tech trends, and find study partners.
              </p>
            </div>

            <Link
              href="/discussions/new"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg flex items-center space-x-2 shrink-0 hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ask Question / Post</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Thread List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {filteredDiscussions.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 backdrop-blur-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {post.category}
                  </span>
                  {post.isSolved && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Solved
                    </span>
                  )}
                </div>

                <Link href={`/discussions/${post.id}`} className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
                  {post.title}
                </Link>

                <p className="text-xs text-gray-300 mt-1 line-clamp-2">{post.body}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[9px] font-bold text-cyan-300">
                      {post.author.name[0]}
                    </div>
                    <span className="text-gray-300 font-medium">{post.author.name} ({post.author.branch})</span>
                  </div>
                  <span>•</span>
                  <span>{post.createdAt}</span>
                </div>
              </div>

              {/* Stats Column */}
              <div className="flex items-center space-x-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 text-xs text-gray-300 font-mono">
                <div className="text-center">
                  <p className="font-bold text-cyan-400">{post.upvotes}</p>
                  <p className="text-[10px] text-gray-400">Votes</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-purple-400">{post.answersCount}</p>
                  <p className="text-[10px] text-gray-400">Answers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-400">{post.views}</p>
                  <p className="text-[10px] text-gray-400">Views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
