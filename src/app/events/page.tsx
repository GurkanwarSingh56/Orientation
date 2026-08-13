'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Users, CheckCircle2, Clock, Sparkles, X } from 'lucide-react';
import { EVENTS_DATA, TechnovateEvent } from '@/lib/data/events-data';

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<TechnovateEvent | null>(null);
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRsvpSuccess(true);
    setTimeout(() => {
      setIsRsvpSuccess(false);
      setSelectedEvent(null);
    }, 2500);
  };

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Calendar className="w-4 h-4" />
            <span>Technovate Activities & Workshops</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Events & Hackathons</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-2">
            Participate in hands-on AI agent workshops, 24-hour campus hackathons, and guest speaker sessions.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EVENTS_DATA.map((event) => (
              <div
                key={event.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> {event.rsvpCount} / {event.maxCapacity} RSVPs
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">{event.title}</h2>

                  <div className="space-y-1.5 mb-4 text-xs text-gray-300">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{event.date} • {event.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{event.venue}</span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-4">{event.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {event.topicsCovered.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                >
                  RSVP Spot Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {isRsvpSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">RSVP Confirmed!</h3>
                <p className="text-xs text-gray-300">Your spot for {selectedEvent.title} is secured. Ticket saved to your profile!</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Confirm RSVP: {selectedEvent.title}</h3>
                <p className="text-xs text-gray-400">{selectedEvent.date} @ {selectedEvent.venue}</p>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Your Student Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurkawar Singh"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">College Roll No. / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. student@college.edu"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg hover:opacity-90"
                >
                  Generate Ticket & Reserve Spot
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
