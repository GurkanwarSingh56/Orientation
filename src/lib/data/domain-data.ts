import { Bot, ShieldAlert, Globe, Code2, Database, Cloud, Rocket, GitBranch, LucideIcon } from 'lucide-react';

export interface DomainItem {
  id: string;
  quizSlug: string;
  title: string;
  icon: LucideIcon;
  shortDescription: string;
  explanation: string;
  subtopics: string[];
  accentColor?: string;
  badge?: string;
}

export const FEATURED_DOMAIN: DomainItem = {
  id: 'ai-agents',
  quizSlug: 'ai-agents',
  title: 'AI & AI Agents',
  icon: Bot,
  shortDescription: 'Understand Large Language Models, Generative AI, Retrieval-Augmented Generation (RAG), and autonomous agents that reason and execute multi-step tasks.',
  explanation: 'Artificial Intelligence enables computing systems to emulate human intelligence, reason through complex problems, process natural language, and perform autonomous task workflows using digital tools.',
  subtopics: ['AI Fundamentals', 'LLMs', 'Generative AI', 'RAG Systems', 'AI Agents'],
  badge: 'Featured Domain',
};

export const DOMAIN_ITEMS: DomainItem[] = [
  {
    id: 'cybersecurity',
    quizSlug: 'cybersecurity',
    title: 'Cybersecurity',
    icon: ShieldAlert,
    shortDescription: 'Explore ethical hacking, web vulnerabilities, authentication, encryption, OWASP, and network protection.',
    explanation: 'Cybersecurity is the practice of protecting systems, networks, applications and data from unauthorized access, attacks and misuse.',
    subtopics: ['Authentication', 'Encryption', 'Network Security', 'OWASP', 'Ethical Hacking'],
    accentColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'web-dev',
    quizSlug: 'web-development',
    title: 'Web Development',
    icon: Globe,
    shortDescription: 'Build modern applications with modern frontend frameworks and scalable backends.',
    explanation: 'Web Development encompasses creating and maintaining web applications, spanning client-side user interfaces, browser APIs, server architecture, and web performance optimization.',
    subtopics: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Backend APIs'],
    accentColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: 'dsa-prep',
    quizSlug: 'dsa',
    title: 'DSA & Interview Prep',
    icon: Code2,
    shortDescription: 'Master core data structures and algorithmic patterns for problem solving.',
    explanation: 'Data Structures and Algorithms form the foundation of computer science, providing efficient methods to organize, store, process, and analyze complex datasets during technical problem solving.',
    subtopics: ['Arrays', 'Strings', 'Sorting', 'Linked Lists', 'Trees', 'Graphs'],
    accentColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'databases',
    quizSlug: 'databases',
    title: 'Databases',
    icon: Database,
    shortDescription: 'Learn relational tables vs document stores, schema design, and query optimization.',
    explanation: 'Database engineering deals with persistent data storage, transactional integrity (ACID principles), query optimization, indexing strategies, and scaling across relational and non-relational database management systems.',
    subtopics: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'],
    accentColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'cloud-aws',
    quizSlug: 'cloud-aws',
    title: 'Cloud & AWS',
    icon: Cloud,
    shortDescription: 'Understand cloud computing infrastructure, virtual servers, S3 storage, and serverless.',
    explanation: 'Cloud Computing provides on-demand access to virtualized computing resources, cloud storage, serverless functions, and infrastructure services to scale software systems globally.',
    subtopics: ['Cloud', 'EC2', 'S3', 'Lambda', 'IAM'],
    accentColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
  {
    id: 'space-satellites',
    quizSlug: 'space-satellites',
    title: 'Space & Satellites',
    icon: Rocket,
    shortDescription: 'Discover satellite orbits, GPS triangulation, and interstellar space communication telemetry.',
    explanation: 'Space & Satellite Engineering focuses on orbital mechanics, telemetry communications, GPS positioning, satellite constellations, and aerospace software systems.',
    subtopics: ['Satellites', 'GPS', 'Voyager 1', 'Voyager 2', 'Space Communication'],
    accentColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  },
  {
    id: 'github-tools',
    quizSlug: 'github-tools',
    title: 'GitHub & Developer Tools',
    icon: GitBranch,
    shortDescription: 'Master Git version control, collaboration, Pull Requests, and open-source programs.',
    explanation: 'Developer tools and version control systems enable software engineers to track code history, collaborate asynchronously via Pull Requests, execute CI/CD automation, and contribute to open-source software.',
    subtopics: ['Git', 'GitHub', 'GitHub Education', 'Open Source', 'Developer Tools'],
    accentColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
];
