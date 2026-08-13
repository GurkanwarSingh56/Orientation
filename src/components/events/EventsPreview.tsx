'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EVENTS_DATA } from '@/lib/data/events-data';

export default function EventsPreview() {
  return (
    <section className="py-20 bg-[#080C14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Campus Activities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Technovate Events & Workshops</h2>
          </div>
          <Link href="/events" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 mt-2 md:mt-0">
            View Calendar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                
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

                <p className="text-xs text-gray-400 leading-relaxed mb-4">{event.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {event.speakers.map((s) => (
                    <div key={s.name} className="flex items-center space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[9px] font-bold text-cyan-300">
                        {s.name[0]}
                      </div>
                      <span className="text-[11px] text-gray-300">{s.name}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/events`}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-90"
                >
                  RSVP Spot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
