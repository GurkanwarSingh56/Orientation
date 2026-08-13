'use conflict';

import { BookOpen, Hammer, Briefcase, Sparkles, ExternalLink, ShieldAlert } from 'lucide-react';

export const OPPORTUNITY_PILLARS = [
  {
    pillar: 'LEARN',
    icon: BookOpen,
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    description: 'Free developer student packs, cloud credits, and learning access.',
    items: [
      {
        title: 'GitHub Student Developer Pack',
        provider: 'GitHub Education',
        details: 'Free access to GitHub Copilot, Canva Pro, JetBrains IDEs, and $200 Domain/Hosting credits.',
        eligibility: 'All Enrolled College Students',
        link: 'https://education.github.com/pack',
      },
      {
        title: 'AWS Educate Cloud Access',
        provider: 'Amazon Web Services',
        details: 'Free hands-on cloud labs, AWS promotional credits, and cloud career pathway badges.',
        eligibility: '1st - 4th Year Students',
        link: 'https://aws.amazon.com/education/awseducate',
      },
    ],
  },
  {
    pillar: 'BUILD',
    icon: Hammer,
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-500/10',
    description: 'Compete in hackathons and contribute to open-source software.',
    items: [
      {
        title: 'Student Hackathons & Sprints',
        provider: 'Major League Hacking & ISRO',
        details: '24-hour team hackathons with mentor guidance, cash prizes, and product building experience.',
        eligibility: 'All Branches & Backgrounds',
        link: 'https://mlh.io',
      },
      {
        title: 'Open Source Mentorships (GSoC)',
        provider: 'Google Summer of Code & Linux Foundation',
        details: 'Contribute to global production software under experienced open-source organization mentors.',
        eligibility: 'Beginning & Advanced Coders',
        link: 'https://summerofcode.withgoogle.com',
      },
    ],
  },
  {
    pillar: 'START YOUR CAREER',
    icon: Briefcase,
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    description: 'Internships, industry certifications, and placement preparation.',
    items: [
      {
        title: 'Off-Campus Internships',
        provider: 'Tech Companies & Startups',
        details: 'Paid software engineering, AI, and cybersecurity internship opportunities for pre-final years.',
        eligibility: 'Pre-Final & Final Year Students',
        link: '#',
      },
      {
        title: 'Free Industry Certifications',
        provider: 'Google, Microsoft & AWS',
        details: 'Student vouchers for Google Cloud Digital Leader, Microsoft Azure Fundamentals & AWS Cloud Practitioner.',
        eligibility: 'All College Students',
        link: '#',
      },
    ],
  },
];

export default function StudentOpportunities() {
  return (
    <section id="opportunities" className="py-16 sm:py-20 bg-[#050814] relative border-t border-cyan-500/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>STUDENT GROWTH RADAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Opportunities Students Should Know About
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl leading-relaxed">
            Your degree is only one part of your journey.
          </p>
        </div>

        {/* 3 Visual Pillars: LEARN, BUILD, START YOUR CAREER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {OPPORTUNITY_PILLARS.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.pillar}
                className="p-6 rounded-3xl bg-[#0B1124] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/10">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border inline-block ${col.badgeColor}`}>
                        {col.pillar}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">{col.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {col.items.map((item) => (
                      <div key={item.title} className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition-all">
                        <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                        <p className="text-xs text-cyan-400 font-semibold mb-2">{item.provider}</p>
                        <p className="text-xs text-gray-300 leading-relaxed mb-3">{item.details}</p>
                        
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-2 border-t border-white/10">
                          <span>{item.eligibility}</span>
                          {item.link !== '#' && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 font-bold flex items-center gap-1 hover:underline"
                            >
                              <span>Official Site</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
