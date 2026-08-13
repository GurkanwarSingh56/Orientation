export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  level: 'Starter' | 'Core' | 'Advanced';
  estimatedHours: number;
  topicSlug?: string;
  categorySlug?: string;
  resources: { title: string; url: string; type: 'Article' | 'Video' | 'Documentation' | 'Practice' }[];
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  badge: string;
  description: string;
  targetAudience: string;
  iconName: string;
  estimatedDuration: string;
  nodes: RoadmapNode[];
}

export const ROADMAPS_DATA: Roadmap[] = [
  {
    id: 'web-dev-starter',
    slug: 'web-dev-starter',
    title: 'Zero to Full-Stack Web Developer',
    badge: 'Beginner Friendly',
    description: 'Designed specifically for non-CSE & 1st-year college students. Learn HTML, CSS, JavaScript, React, Next.js, and deploy your first website.',
    targetAudience: '1st & 2nd Year Students (All Branches)',
    iconName: 'Globe',
    estimatedDuration: '6 Weeks (5 hrs/week)',
    nodes: [
      {
        id: 'node-1',
        title: 'HTML5 & Semantic Web Structure',
        description: 'Understand elements, tags, forms, tables, accessibility, and modern semantic markup.',
        level: 'Starter',
        estimatedHours: 4,
        categorySlug: 'web-development',
        topicSlug: 'nextjs-app-router-guide',
        resources: [
          { title: 'MDN HTML Beginner Guide', url: 'https://developer.mozilla.org', type: 'Documentation' },
          { title: 'Technovate HTML Interactive Sandbox', url: '#', type: 'Practice' }
        ]
      },
      {
        id: 'node-2',
        title: 'Modern CSS3 & Flexbox / Grid',
        description: 'Style pages with custom layouts, gradients, animations, and responsive mobile-first rules.',
        level: 'Starter',
        estimatedHours: 6,
        categorySlug: 'web-development',
        resources: [
          { title: 'CSS Tricks Flexbox Complete Guide', url: 'https://css-tricks.com', type: 'Article' }
        ]
      },
      {
        id: 'node-3',
        title: 'JavaScript Essentials (ES6+)',
        description: 'Variables, arrow functions, promises, async/await, array methods (map, filter, reduce), and DOM manipulation.',
        level: 'Core',
        estimatedHours: 10,
        categorySlug: 'web-development',
        resources: [
          { title: 'JavaScript.info Guide', url: 'https://javascript.info', type: 'Documentation' }
        ]
      },
      {
        id: 'node-4',
        title: 'React & Component Architecture',
        description: 'JSX, Props, State (useState, useEffect), Component lifecycle, and custom hooks.',
        level: 'Core',
        estimatedHours: 12,
        categorySlug: 'web-development',
        resources: [
          { title: 'React Official Documentation', url: 'https://react.dev', type: 'Documentation' }
        ]
      },
      {
        id: 'node-5',
        title: 'Next.js App Router & Deployment',
        description: 'Full-stack React with server rendering, dynamic routing, Tailwind CSS, and Vercel cloud deployment.',
        level: 'Advanced',
        estimatedHours: 15,
        categorySlug: 'web-development',
        topicSlug: 'nextjs-app-router-guide',
        resources: [
          { title: 'Next.js Official Learn Track', url: 'https://nextjs.org/learn', type: 'Documentation' }
        ]
      }
    ]
  },
  {
    id: 'ai-agents-engineer',
    slug: 'ai-agents-engineer',
    title: 'AI & Autonomous Agents Developer',
    badge: 'Trending Domain',
    description: 'Master Large Language Models, Prompt Engineering, RAG vector pipelines, and build agentic software with tool-calling capabilities.',
    targetAudience: 'Students interested in AI & Automation',
    iconName: 'Bot',
    estimatedDuration: '4 Weeks',
    nodes: [
      {
        id: 'ai-node-1',
        title: 'Prompt Engineering & LLM API Fundamentals',
        description: 'Learn system prompts, few-shot prompting, JSON output formatting, and Gemini / OpenAI API integration.',
        level: 'Starter',
        estimatedHours: 5,
        categorySlug: 'ai-agents',
        resources: [{ title: 'Google Gemini API Docs', url: 'https://ai.google.dev', type: 'Documentation' }]
      },
      {
        id: 'ai-node-2',
        title: 'RAG Systems & Vector Databases',
        description: 'Text embeddings, chunking strategies, Pinecone/Chroma DB, and similarity search for document Q&A.',
        level: 'Core',
        estimatedHours: 8,
        categorySlug: 'ai-agents',
        topicSlug: 'rag-retrieval-augmented-generation',
        resources: [{ title: 'RAG Architecture Whitepaper', url: '#', type: 'Article' }]
      },
      {
        id: 'ai-node-3',
        title: 'Agentic Tool Calling & Autonomous Workflows',
        description: 'Building multi-step reasoning agents that execute code, query APIs, and complete complex user instructions.',
        level: 'Advanced',
        estimatedHours: 12,
        categorySlug: 'ai-agents',
        topicSlug: 'ai-agents-fundamentals',
        resources: [{ title: 'LangChain & LlamaIndex Guides', url: 'https://python.langchain.com', type: 'Documentation' }]
      }
    ]
  },
  {
    id: 'dsa-interview-master',
    slug: 'dsa-interview-prep',
    title: 'Off-Campus DSA & Problem Solving Track',
    badge: 'Interview Prep',
    description: 'Step-by-step roadmap to master data structures, algorithm patterns (Two Pointers, Sliding Window, DP), and crack technical interviews.',
    targetAudience: 'Pre-Final & Final Year Students',
    iconName: 'Code2',
    estimatedDuration: '8 Weeks',
    nodes: [
      {
        id: 'dsa-node-1',
        title: 'Array & String Patterns',
        description: 'Two Pointers, Sliding Window, Prefix Sum, Kadanes Algorithm.',
        level: 'Starter',
        estimatedHours: 10,
        categorySlug: 'dsa-interview-prep',
        topicSlug: 'array-two-pointers-technique',
        resources: [{ title: 'LeetCode 75 Curated Sheet', url: 'https://leetcode.com', type: 'Practice' }]
      },
      {
        id: 'dsa-node-2',
        title: 'Trees, Binary Search Trees & Graphs',
        description: 'BFS, DFS, Dijkstra Algorithm, Topological Sorting, Graph Traversals.',
        level: 'Core',
        estimatedHours: 15,
        categorySlug: 'dsa-interview-prep',
        resources: [{ title: 'Visualgo Algorithm Visualizer', url: 'https://visualgo.net', type: 'Video' }]
      },
      {
        id: 'dsa-node-3',
        title: 'Dynamic Programming Patterns',
        description: 'Memoization, Tabulation, 0/1 Knapsack, Longest Common Subsequence.',
        level: 'Advanced',
        estimatedHours: 20,
        categorySlug: 'dsa-interview-prep',
        resources: [{ title: 'NeetCode DP Playlist', url: 'https://neetcode.io', type: 'Video' }]
      }
    ]
  }
];
