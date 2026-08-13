'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, MapPin, Bookmark, Award, Calendar, FolderGit2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ROADMAPS_DATA } from '@/lib/data/roadmaps-data';
import { EVENTS_DATA } from '@/lib/data/events-data';

export default function StudentDashboardPage() {
  const { user, userProfile } = useAuth();

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header Banner */}
      <section className="py-10 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-cyan-500/20">
                {userProfile?.name ? userProfile.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'S'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {userProfile?.name || 'Student Innovator'}!
                </h1>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">
                  {userProfile?.branch || 'Electrical Eng'} • {userProfile?.year || '1st Year'} • Technovate Member
                </p>
              </div>
            </div>

            <Link
              href="/tech-hub"
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center space-x-2 shrink-0 hover:bg-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Explore Tech Hub</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Workspace Dashboard Body */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-xs text-gray-400 font-mono">Roadmaps Active</p>
              <p className="text-2xl font-extrabold text-cyan-400 mt-1">2 Tracks</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-xs text-gray-400 font-mono">Bookmarked Topics</p>
              <p className="text-2xl font-extrabold text-purple-400 mt-1">5 Guides</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-xs text-gray-400 font-mono">Event RSVPs</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">1 Confirmed</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <p className="text-xs text-gray-400 font-mono">Reputation Points</p>
              <p className="text-2xl font-extrabold text-pink-400 mt-1">120 PTS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Active Learning Roadmaps */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Your Active Learning Roadmaps</span>
              </h2>

              {ROADMAPS_DATA.slice(0, 2).map((rm) => (
                <div key={rm.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                      {rm.badge}
                    </span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">40% Complete</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{rm.title}</h3>
                  <p className="text-xs text-gray-300 mt-1 mb-4">{rm.description}</p>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 w-[40%]" />
                  </div>

                  <Link
                    href={`/roadmaps/${rm.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:underline"
                  >
                    <span>Resume Learning Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Event Ticket & Badges */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Confirmed Event Ticket</span>
                </h2>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-500/40">
                  <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase px-2 py-0.5 rounded bg-emerald-500/20">
                    Workshop Ticket
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2">{EVENTS_DATA[0].title}</h3>
                  <p className="text-xs text-gray-300 mt-1">{EVENTS_DATA[0].date} @ {EVENTS_DATA[0].time}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{EVENTS_DATA[0].venue}</p>
                  <div className="mt-4 pt-3 border-t border-white/10 text-center font-mono text-[11px] text-emerald-400">
                    Ticket Code: #TECH-2026-8942
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-400" />
                  <span>Technovate Badges</span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Pioneer Member
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Web Dev Explorer
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
