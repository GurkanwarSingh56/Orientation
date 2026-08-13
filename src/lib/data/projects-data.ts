export interface StudentProject {
  id: string;
  title: string;
  tagline: string;
  author: { name: string; branch: string; year: string; avatar: string };
  category: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  upvotes: number;
  description: string;
  featured: boolean;
}

export const PROJECTS_DATA: StudentProject[] = [
  {
    id: 'orbit-sense-voyager',
    title: 'OrbitSense: Interactive Satellite & Voyager Tracker',
    tagline: '3D WebGL space visualizer showing live telemetry of orbital satellites and deep space probes.',
    author: { name: 'Rohan Mehta', branch: 'Electronics & Comm (ECE)', year: '3rd Year', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan' },
    category: 'Space & Satellites',
    techStack: ['Three.js', 'Next.js', 'Satellite.js API', 'TailwindCSS'],
    githubUrl: 'https://github.com/technovate/orbit-sense',
    demoUrl: 'https://orbit-sense.vercel.app',
    upvotes: 48,
    description: 'Calculates orbital positions in real-time using TLE satellite dataset and renders planetary orbits in WebGL with interactive stats.',
    featured: true
  },
  {
    id: 'campus-notes-ai',
    title: 'EduRAG: Smart Campus Document Q&A',
    tagline: 'Upload lecture slides or PDFs and ask questions in plain English powered by Gemini RAG.',
    author: { name: 'Priya Sharma', branch: 'Computer Science (CSE)', year: '2nd Year', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya' },
    category: 'AI & AI Agents',
    techStack: ['Next.js', 'Google Gemini API', 'Pinecone Vector DB', 'TypeScript'],
    githubUrl: 'https://github.com/technovate/edurag',
    demoUrl: 'https://edurag.vercel.app',
    upvotes: 62,
    description: 'Eliminates hours of manual reading by chunking lecture PDFs and performing instant semantic similarity search to generate concise answers.',
    featured: true
  }
];
