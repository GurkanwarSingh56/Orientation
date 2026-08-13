'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, CheckCircle2, ShieldAlert, PlusCircle, Users, Calendar, FolderGit2, Sparkles, X } from 'lucide-react';
import { TECH_CATEGORIES } from '@/lib/data/tech-hub-data';
import { PROJECTS_DATA } from '@/lib/data/projects-data';
import { EVENTS_DATA } from '@/lib/data/events-data';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'events'>('content');
  const [isSuccessMsg, setIsSuccessMsg] = useState('');

  const triggerSuccess = (msg: string) => {
    setIsSuccessMsg(msg);
    setTimeout(() => setIsSuccessMsg(''), 3000);
  };

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-10 bg-gradient-to-b from-[#1E1B4B] to-[#0B0F19] border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-widest mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Technovate Executive Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Admin Control Panel</h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            Curate technical topics, approve pending student projects, publish events, and moderate community discussions.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 flex space-x-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Content Management ({TECH_CATEGORIES.length} Categories)
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'projects'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Project Approvals ({PROJECTS_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Event Management ({EVENTS_DATA.length})
            </button>
          </div>
        </div>
      </section>

      {/* Admin Panel Body */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isSuccessMsg}
              </span>
              <button onClick={() => setIsSuccessMsg('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Curated Tech Categories & Topics</h2>
                <button
                  onClick={() => triggerSuccess('Topic editor draft created successfully!')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Topic Guide
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TECH_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-cyan-400">{cat.title}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                        {cat.topicsCount} Topics
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2 mb-3">{cat.description}</p>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => triggerSuccess(`Opened editor for ${cat.title}`)}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-gray-200 font-semibold"
                      >
                        Edit Domain
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Student Project Submissions Queue</h2>
              <div className="space-y-4">
                {PROJECTS_DATA.map((proj) => (
                  <div key={proj.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                          {proj.category}
                        </span>
                        <span className="text-xs text-gray-400">By {proj.author.name} ({proj.author.branch})</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{proj.title}</h3>
                      <p className="text-xs text-gray-300 mt-1">{proj.tagline}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => triggerSuccess(`Project "${proj.title}" approved!`)}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30"
                      >
                        Approve & Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Technovate Events & Workshops</h2>
                <button
                  onClick={() => triggerSuccess('New event draft created!')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Create Workshop / Event
                </button>
              </div>

              <div className="space-y-4">
                {EVENTS_DATA.map((event) => (
                  <div key={event.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                        {event.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">{event.title}</h3>
                      <p className="text-xs text-gray-400">{event.date} • {event.venue}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => triggerSuccess(`Managing RSVPs for ${event.title}`)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-gray-200 border border-white/15 text-xs font-bold hover:bg-white/15"
                      >
                        Manage {event.rsvpCount} RSVPs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
