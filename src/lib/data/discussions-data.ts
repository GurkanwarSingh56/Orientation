export interface DiscussionAnswer {
  id: string;
  author: { name: string; avatar: string; role: string };
  body: string;
  createdAt: string;
  upvotes: number;
  isAccepted: boolean;
}

export interface DiscussionPost {
  id: string;
  title: string;
  category: string;
  author: { name: string; avatar: string; branch: string; year: string };
  body: string;
  tags: string[];
  views: number;
  upvotes: number;
  answersCount: number;
  isSolved: boolean;
  createdAt: string;
  answers?: DiscussionAnswer[];
}

export const DISCUSSIONS_DATA: DiscussionPost[] = [
  {
    id: 'disc-1',
    title: 'As a 1st-year Electrical student, should I start with C++ DSA or Web Development first?',
    category: 'Student Advice',
    author: { name: 'Aarav Gupta', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav', branch: 'Electrical Eng (EE)', year: '1st Year' },
    body: 'Hi everyone! I just joined college and I have zero prior programming background. I want to build projects but also prepare for off-campus internships later. What sequence do seniors recommend?',
    tags: ['Beginner', 'Career', 'WebDev', 'DSA'],
    views: 240,
    upvotes: 35,
    answersCount: 3,
    isSolved: true,
    createdAt: '2026-08-10',
    answers: [
      {
        id: 'ans-1',
        author: { name: 'Gurkawar Singh', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gurkawar', role: 'Technovate Lead' },
        body: 'Welcome to Technovate! For 1st year non-CSE students, we strongly recommend starting with **Web Development (HTML/CSS/JS)** for 3-4 weeks. Building visual things boosts your confidence fast! Once comfortable with JS logic, pick C++ or Python to start basic DSA (Arrays/Strings).',
        createdAt: '2026-08-10',
        upvotes: 28,
        isAccepted: true
      }
    ]
  },
  {
    id: 'disc-2',
    title: 'How do NASA Deep Space antennas decode low-power signals from Voyager 1?',
    category: 'Space Tech',
    author: { name: 'Sneha Patel', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha', branch: 'ECE', year: '2nd Year' },
    body: 'I read on Technovate Tech Hub that Voyager 1 transmits at 23 Watts. How does the Deep Space Network separate that signal from cosmic noise?',
    tags: ['SpaceTech', 'Networking', 'Physics'],
    views: 180,
    upvotes: 22,
    answersCount: 1,
    isSolved: false,
    createdAt: '2026-08-12'
  }
];
