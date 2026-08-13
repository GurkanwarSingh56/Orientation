export interface StudentOpportunity {
  id: string;
  title: string;
  organization: string;
  logoUrl?: string;
  category: 'Internship' | 'Hackathon' | 'Open Source' | 'Grant / Fellowship';
  eligibility: string; // e.g. "1st - 4th Year Students"
  location: 'Remote' | 'On-site' | 'Hybrid';
  deadline: string;
  stipendOrPrize: string;
  tags: string[];
  applyUrl: string;
  description: string;
  featured: boolean;
}

export const OPPORTUNITIES_DATA: StudentOpportunity[] = [
  {
    id: 'gsoc-2026',
    title: 'Google Summer of Code (GSoC) 2026',
    organization: 'Google Open Source',
    category: 'Open Source',
    eligibility: 'All College Students (18+)',
    location: 'Remote',
    deadline: '2026-03-24',
    stipendOrPrize: '$1,500 - $3,000 Stipend',
    tags: ['Open Source', 'Mentorship', 'Global'],
    applyUrl: 'https://summerofcode.withgoogle.com',
    description: 'A global online program focused on bringing new student developers into open source software organizations with experienced mentors.',
    featured: true
  },
  {
    id: 'mlh-fellowship',
    title: 'MLH Software Engineering Fellowship',
    organization: 'Major League Hacking',
    category: 'Grant / Fellowship',
    eligibility: 'All Branches & Years',
    location: 'Remote',
    deadline: '2026-04-15',
    stipendOrPrize: 'Stipend + Professional Mentorship',
    tags: ['Software Engineering', 'Open Source', 'Fellowship'],
    applyUrl: 'https://fellowship.mlh.io',
    description: 'A 12-week internship alternative for aspiring software engineers to contribute to production open source software used by millions.',
    featured: true
  },
  {
    id: 'isro-student-space-hackathon',
    title: 'ISRO Student Space Payload & Tech Challenge',
    organization: 'ISRO / Space Application Centre',
    category: 'Hackathon',
    eligibility: 'Engineering Undergraduates',
    location: 'Hybrid',
    deadline: '2026-05-10',
    stipendOrPrize: '₹1,500,000 Total Cash Prizes + Lab Tour',
    tags: ['Space Tech', 'Satellites', 'Robotics'],
    applyUrl: 'https://www.isro.gov.in',
    description: 'Design innovative micro-satellite payload concepts and space communication solutions judged by ISRO scientists.',
    featured: true
  },
  {
    id: 'microsoft-learn-ambassador',
    title: 'Microsoft Learn Student Ambassador (MLSA)',
    organization: 'Microsoft',
    category: 'Grant / Fellowship',
    eligibility: '1st & 2nd Year Students Preferred',
    location: 'Remote',
    deadline: 'Rolling Basis',
    stipendOrPrize: 'Free Azure Credits + LinkedIn Premium + Swag',
    tags: ['Community', 'Cloud', 'AI'],
    applyUrl: 'https://mvp.microsoft.com/studentambassadors',
    description: 'Lead technical workshops, learn cloud technologies on Azure, and connect with global student tech leaders.',
    featured: false
  }
];
