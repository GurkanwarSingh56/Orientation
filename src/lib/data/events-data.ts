export interface TechnovateEvent {
  id: string;
  slug: string;
  title: string;
  category: 'Workshop' | 'Hackathon' | 'Webinar' | 'Tech Fest';
  date: string; // ISO date string
  time: string;
  venue: string;
  speakers: { name: string; role: string; avatar: string }[];
  description: string;
  topicsCovered: string[];
  bannerUrl?: string;
  maxCapacity: number;
  rsvpCount: number;
  isRegistrationOpen: boolean;
}

export const EVENTS_DATA: TechnovateEvent[] = [
  {
    id: 'ai-agent-build-night',
    slug: 'ai-agent-build-night-2026',
    title: 'Hands-on AI Agent & RAG Workshop',
    category: 'Workshop',
    date: '2026-08-25',
    time: '4:00 PM - 7:00 PM IST',
    venue: 'Technovate Innovation Lab (Room 302, Academic Block B)',
    speakers: [
      { name: 'Gurkawar Singh', role: 'President & Tech Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gurkawar' },
      { name: 'Ananya Sharma', role: 'AI Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya' }
    ],
    description: 'Learn how to build your first autonomous AI agent using Google Gemini API, TypeScript, and vector search. Bring your laptops!',
    topicsCovered: ['Gemini API', 'Prompt Engineering', 'Vector DB', 'Tool Calling'],
    maxCapacity: 60,
    rsvpCount: 42,
    isRegistrationOpen: true
  },
  {
    id: 'hack-technovate-2026',
    slug: 'hack-technovate-2026',
    title: 'HackTechnovate 2026: 24-Hour Campus Hackathon',
    category: 'Hackathon',
    date: '2026-09-12',
    time: '9:00 AM (24 Hours)',
    venue: 'Main Auditorium & Campus Hub',
    speakers: [
      { name: 'Siddharth Verma', role: 'SDE-II @ Microsoft (Alumnus)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sid' }
    ],
    description: 'Build innovative tech solutions across 4 tracks: AI for Education, Space Data Visualizer, Cybersecurity Tools, and Open Track. Cash prizes worth ₹100,000!',
    topicsCovered: ['Rapid Prototyping', 'Full Stack', 'AI Models', 'Hardware/IoT'],
    maxCapacity: 200,
    rsvpCount: 135,
    isRegistrationOpen: true
  }
];
