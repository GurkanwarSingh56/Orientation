'use client'

import { EVENTS_DATA } from '@/lib/data/events-data'

const eventEmojis = ['🚀', '🤖', '⛓️', '💼', '☁️', '⚡', '🎯', '💻', '🌟', '🔥']

export default function Events() {
  const upcomingEvents = EVENTS_DATA.filter((e) => e.isRegistrationOpen)
  const pastEvents = EVENTS_DATA.filter((e) => !e.isRegistrationOpen)

  return (
    <section id="events" className="py-16 bg-[#050814] border-t border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">Events</span>
          </h2>
          <p className="text-gray-300 text-sm max-w-2xl mx-auto mt-3">
            Join us for exciting events, workshops, and hackathons throughout the year
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <span className="w-2 h-8 bg-cyan-400 mr-3 rounded-full"></span>
            Upcoming Events
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className="p-6 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all">
                <div className="text-5xl mb-4">{eventEmojis[index % eventEmojis.length]}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold">
                    Open
                  </span>
                  <span className="text-xs text-gray-400">{event.date}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                <p className="text-gray-300 text-xs mb-4 leading-relaxed">{event.description}</p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfs__fYZoaMAVqv-Io1bwobVGle5nC9FSXEzN6rRS4rpyer0g/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-bold text-xs text-center shadow-md hover:opacity-90 transition-opacity"
                >
                  Register Now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <span className="w-2 h-8 bg-gray-500 mr-3 rounded-full"></span>
              Past Events
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <div key={event.id} className="p-6 rounded-2xl bg-[#0B1124] border border-white/10 opacity-75 hover:opacity-100 transition-all">
                  <div className="text-5xl mb-4 grayscale">{eventEmojis[index % eventEmojis.length]}</div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-semibold">
                      Completed
                    </span>
                    <span className="text-xs text-gray-400">{event.date}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                  <p className="text-gray-300 text-xs mb-4 leading-relaxed">{event.description}</p>
                  <button className="w-full py-2.5 px-4 bg-gray-800 text-gray-400 rounded-xl font-bold text-xs cursor-not-allowed">
                    Event Concluded
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
