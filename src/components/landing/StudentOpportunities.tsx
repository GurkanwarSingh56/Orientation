'use client';

import { Briefcase, ExternalLink, Calendar, MapPin, Sparkles } from 'lucide-react';

export const LANDING_OPPORTUNITIES = [
  {
    id: 'gsoc-2026',
    title: 'Google Summer of Code (GSoC) 2026',
    organization: 'Google Open Source',
    category: 'Open Source',
    eligibility: 'All College Students (18+)',
    location: 'Remote',
    deadline: 'March 2026',
    stipend: '$1,500 - $3,000 Stipend',
    tags: ['Open Source', 'Mentorship', 'Global'],
    applyUrl: 'https://summerofcode.withgoogle.com',
    description: 'A global online program focused on bringing new student developers into open source software organizations with experienced mentors.',
  },
  {
    id: 'mlh-fellowship',
    title: 'MLH Software Engineering Fellowship',
    organization: 'Major League Hacking',
    category: 'Fellowship',
    eligibility: 'All Branches & Years',
    location: 'Remote',
    deadline: 'April 2026',
    stipend: 'Stipend + Professional Mentorship',
    tags: ['Software Engineering', 'Open Source'],
    applyUrl: 'https://fellowship.mlh.io',
    description: 'A 12-week internship alternative for aspiring software engineers to contribute to production open source software used by millions.',
  },
  {
    id: 'isro-space-challenge',
    title: 'ISRO Student Space Payload Challenge',
    organization: 'ISRO / Space Application Centre',
    category: 'Hackathon',
    eligibility: 'Engineering Undergraduates',
    location: 'Hybrid',
    deadline: 'May 2026',
    stipend: '₹1,500,000 Total Cash Prizes',
    tags: ['Space Tech', 'Satellites', 'Robotics'],
    applyUrl: 'https://www.isro.gov.in',
    description: 'Design innovative micro-satellite payload concepts and space communication solutions judged by ISRO scientists.',
  },
  {
    id: 'mlsa-program',
    title: 'Microsoft Learn Student Ambassador',
    organization: 'Microsoft',
    category: 'Community Grant',
    eligibility: '1st & 2nd Year Students Preferred',
    location: 'Remote',
    deadline: 'Rolling Basis',
    stipend: 'Azure Credits + LinkedIn Premium + Swag',
    tags: ['Community', 'Cloud', 'AI'],
    applyUrl: 'https://mvp.microsoft.com/studentambassadors',
    description: 'Lead technical workshops, learn cloud technologies on Azure, and connect with global student tech leaders.',
  },
];

export default function StudentOpportunities() {
  return (
    <section id="opportunities" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CAREER & OFF-CAMPUS RADAR</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Student Opportunity Radar
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md">
            Curated internships, global open-source mentorships, hackathons, and fellowship grants for college students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LANDING_OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className="p-6 rounded-2xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {opp.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Deadline: {opp.deadline}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{opp.title}</h3>
                <p className="text-xs text-cyan-400 font-bold mb-3">{opp.organization} • {opp.stipend}</p>

                <div className="flex items-center gap-3 text-xs text-gray-300 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {opp.location}
                  </span>
                  <span>•</span>
                  <span className="text-gray-300">Eligibility: {opp.eligibility}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-6">{opp.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {opp.tags.map((t) => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gray-400 border border-white/10">
                      #{t}
                    </span>
                  ))}
                </div>

                <a
                  href={opp.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center space-x-1 shrink-0 ml-2"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
