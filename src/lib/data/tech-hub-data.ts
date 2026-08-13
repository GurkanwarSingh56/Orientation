export interface TechTopic {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  summary: string; // Beginner "Zero Jargon" elevator pitch
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  prerequisites: string[];
  keyTerms: { term: string; definition: string }[];
  overviewMarkdown: string;
  codeSnippet?: { language: string; code: string; title: string };
  quiz: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  practicalApplications: string[];
}

export interface TechCategory {
  id: string;
  slug: string;
  title: string;
  iconName: string; // Lucide icon name
  badgeColor: string;
  description: string;
  topicsCount: number;
  topics: TechTopic[];
}

export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'ai-agents',
    slug: 'ai-agents',
    title: 'AI & AI Agents',
    iconName: 'Bot',
    badgeColor: 'from-cyan-500 to-blue-600',
    description: 'Explore Large Language Models, Generative AI, Retrieval-Augmented Generation (RAG), and Autonomous AI Agents that reason and build.',
    topicsCount: 7,
    topics: [
      {
        id: 'ai-agents-intro',
        slug: 'ai-agents-fundamentals',
        categorySlug: 'ai-agents',
        title: 'Autonomous AI Agents',
        summary: 'Unlike simple chatbots that answer questions, AI Agents can break down complex goals into steps, use tools (like web search or Python code), and execute tasks independently.',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        prerequisites: ['Basic Python or JS', 'Prompt Engineering basics'],
        keyTerms: [
          { term: 'Agentic Loop', definition: 'The core cycle where an AI observes state, decides the next tool to run, acts, and reflects on the result.' },
          { term: 'Tool Calling', definition: 'Giving an LLM structured functions (e.g. calculator, database query, browser) it can execute.' },
          { term: 'ReAct Framework', definition: 'Reasoning + Acting architecture popular in agent design.' }
        ],
        overviewMarkdown: `
### What is an AI Agent?
An **AI Agent** is an artificial intelligence program that senses its environment, makes autonomous decisions based on goals, and performs actions using digital tools.

#### The ReAct Pattern (Reasoning + Acting)
1. **Thought**: The model plans what step to take next.
2. **Action**: The model invokes an external tool (e.g., \`search_google("latest tech news")\`).
3. **Observation**: The system feeds the tool's result back into the model's memory.
4. **Final Answer**: When the goal is achieved, the agent responds to the user.
        `,
        codeSnippet: {
          title: 'Simple AI Agent Tool Executor Pattern',
          language: 'typescript',
          code: `async function executeAgentStep(userGoal: string) {
  const memory = [{ role: 'user', content: userGoal }];
  
  // Step 1: Model decides to call a tool
  const decision = await llm.predict({
    messages: memory,
    tools: [{ name: 'getWeather', description: 'Fetch weather by city' }]
  });
  
  if (decision.toolCall) {
    const result = await runTool(decision.toolCall.name, decision.toolCall.args);
    memory.push({ role: 'tool', content: JSON.stringify(result) });
  }
  
  return await llm.predict({ messages: memory });
}`
        },
        quiz: [
          {
            question: 'What distinguishes an AI Agent from a traditional LLM chatbot?',
            options: [
              'AI agents only run on supercomputers',
              'AI agents can use tools and take multi-step autonomous actions to achieve a goal',
              'AI agents do not use natural language',
              'AI agents cannot remember past interactions'
            ],
            answerIndex: 1,
            explanation: 'AI Agents go beyond text generation by autonomously planning, reasoning, and executing actions via tools.'
          }
        ],
        practicalApplications: ['Automated Code Generation & Debugging', 'Autonomous Market Research', 'Customer Support Bot with DB Access']
      },
      {
        id: 'rag-explained',
        slug: 'rag-retrieval-augmented-generation',
        categorySlug: 'ai-agents',
        title: 'Retrieval-Augmented Generation (RAG)',
        summary: 'RAG gives AI models access to custom documents (like college handbooks or private PDFs) without needing expensive fine-tuning.',
        difficulty: 'Beginner',
        readTime: '5 min read',
        prerequisites: ['Basic AI concepts'],
        keyTerms: [
          { term: 'Vector Database', definition: 'A database optimized for storing text embeddings and finding semantic similarities.' },
          { term: 'Embeddings', definition: 'Converting sentences or documents into numerical vectors that represent meaning.' }
        ],
        overviewMarkdown: `
### Why RAG?
LLMs are trained on past static data and don't know your private files or live updates. **RAG** bridges this gap by searching your documents first and providing them to the LLM as context.
        `,
        quiz: [
          {
            question: 'Why is RAG preferred over retraining an LLM for custom college documents?',
            options: [
              'RAG requires zero electricity',
              'RAG is much cheaper, updates instantly when docs change, and prevents hallucination',
              'Retraining is faster than RAG',
              'RAG replaces the LLM completely'
            ],
            answerIndex: 1,
            explanation: 'RAG lets you plug in fresh documents dynamically into vector search without high retraining costs.'
          }
        ],
        practicalApplications: ['College Library & Exam Helper Bot', 'Medical Paper Summarizer', 'Company Knowledge Base Search']
      }
    ]
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    title: 'Cybersecurity & Ethical Hacking',
    iconName: 'ShieldAlert',
    badgeColor: 'from-emerald-500 to-teal-700',
    description: 'Learn ethical hacking, secure coding, encryption standards, network security, and OWASP Top 10 web vulnerabilities.',
    topicsCount: 6,
    topics: [
      {
        id: 'owasp-top-10',
        slug: 'owasp-web-security',
        categorySlug: 'cybersecurity',
        title: 'OWASP Top 10 Vulnerabilities',
        summary: 'The OWASP Top 10 is a standard awareness document for developers detailing the 10 most critical security risks in web apps (like SQL Injection & XSS).',
        difficulty: 'Beginner',
        readTime: '7 min read',
        prerequisites: ['HTML basics', 'How websites handle forms'],
        keyTerms: [
          { term: 'SQL Injection (SQLi)', definition: 'Inserting malicious database queries into input fields to bypass auth or leak data.' },
          { term: 'Cross-Site Scripting (XSS)', definition: 'Injecting malicious JavaScript into pages viewed by other users.' }
        ],
        overviewMarkdown: `
### Top Vulnerabilities Explained
1. **Broken Access Control**: Users accessing admin panels without authorization.
2. **Cryptographic Failures**: Saving passwords in plain text instead of hashing with bcrypt/Argon2.
3. **Injection**: Unsanitized user inputs executed directly in databases or terminal commands.
        `,
        codeSnippet: {
          title: 'Vulnerable vs Secure SQL Query',
          language: 'javascript',
          code: `// ❌ DANGEROUS: Vulnerable to SQL Injection
const query = "SELECT * FROM users WHERE email = '" + userInput + "'";

// ✅ SECURE: Parameterized Query
const query = "SELECT * FROM users WHERE email = ?";
db.execute(query, [userInput]);`
        },
        quiz: [
          {
            question: 'How do parameterized queries prevent SQL Injection?',
            options: [
              'They encrypt the database on disk',
              'They treat user inputs strictly as literal parameters rather than executable SQL statements',
              'They hide the database port',
              'They delete malicious users automatically'
            ],
            answerIndex: 1,
            explanation: 'Parameterized queries ensure the database engine never compiles user string inputs as SQL command logic.'
          }
        ],
        practicalApplications: ['Penetration Testing', 'Bug Bounty Hunting', 'Securing Student Dashboards']
      }
    ]
  },
  {
    id: 'web-dev',
    slug: 'web-development',
    title: 'Web Development',
    iconName: 'Globe',
    badgeColor: 'from-indigo-500 to-purple-600',
    description: 'Master modern frontend & backend web technologies: React, Next.js, TypeScript, TailwindCSS, Node.js, REST APIs & Vercel deployment.',
    topicsCount: 8,
    topics: [
      {
        id: 'react-nextjs-intro',
        slug: 'nextjs-app-router-guide',
        categorySlug: 'web-development',
        title: 'Next.js App Router Architecture',
        summary: 'Next.js is a full-stack React framework that makes building fast, SEO-friendly, server-rendered web applications effortless.',
        difficulty: 'Beginner',
        readTime: '6 min read',
        prerequisites: ['Basic React & HTML/CSS'],
        keyTerms: [
          { term: 'Server Components (RSC)', definition: 'React components that execute and render on the server, sending zero JS bundle to the browser.' },
          { term: 'Client Components (\'use client\')', definition: 'Components that run in the browser to handle interactivity, state, and event listeners.' }
        ],
        overviewMarkdown: `
### Why Next.js over vanilla React?
- **Server Side Rendering (SSR)**: Pages load instantly with HTML pre-rendered on server.
- **File-based Routing**: Folders in \`src/app\` automatically become URLs (e.g. \`app/events/page.tsx\` -> \`/events\`).
- **Built-in API Routes**: Create backend endpoints inside \`app/api/route.ts\`.
        `,
        quiz: [
          {
            question: 'When should you add \'use client\' at the top of a Next.js file?',
            options: [
              'Every single file in Next.js needs it',
              'Only when using browser interactivity hooks like useState, useEffect, or click listeners',
              'To connect to a SQL database',
              'To speed up page loading'
            ],
            answerIndex: 1,
            explanation: '\'use client\' tells Next.js that the component relies on client-side React features like state or DOM events.'
          }
        ],
        practicalApplications: ['Building College Portals', 'Portfolio Websites', 'SaaS Products']
      }
    ]
  },
  {
    id: 'dsa-prep',
    slug: 'dsa-interview-prep',
    title: 'DSA & Interview Preparation',
    iconName: 'Code2',
    badgeColor: 'from-amber-500 to-orange-600',
    description: 'Structure your problem solving skills: Arrays, Linked Lists, Trees, Dynamic Programming, System Design & Technical Interview prep.',
    topicsCount: 11,
    topics: [
      {
        id: 'two-pointers-pattern',
        slug: 'array-two-pointers-technique',
        categorySlug: 'dsa-interview-prep',
        title: 'Two Pointers Technique',
        summary: 'A fundamental DSA pattern used to solve array/string problems in O(N) linear time instead of nested O(N²) loops.',
        difficulty: 'Beginner',
        readTime: '5 min read',
        prerequisites: ['Arrays basics', 'For loops'],
        keyTerms: [
          { term: 'Time Complexity O(N)', definition: 'The algorithm runs proportional to the size of the array in a single pass.' },
          { term: 'Left & Right Pointers', definition: 'Indices starting at opposite ends of a sorted array moving toward each other.' }
        ],
        overviewMarkdown: `
### How It Works
Instead of checking every pair with two nested loops ($O(N^2)$), initialize one pointer at index \`0\` and another at index \`N - 1\`. Move them inward based on condition checks.
        `,
        codeSnippet: {
          title: 'Two Sum II (Sorted Array)',
          language: 'typescript',
          code: `function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }

  return [];
}`
        },
        quiz: [
          {
            question: 'What is the time complexity of the Two Pointers technique on a sorted array?',
            options: ['O(N²)', 'O(N)', 'O(log N)', 'O(1)'],
            answerIndex: 1,
            explanation: 'Each element is visited at most once by either the left or right pointer, yielding linear O(N) time.'
          }
        ],
        practicalApplications: ['LeetCode / HackerRank Coding Rounds', 'Product Company Interviews', 'Data Stream Processing']
      }
    ]
  },
  {
    id: 'databases',
    slug: 'databases',
    title: 'Databases & Data Modeling',
    iconName: 'Database',
    badgeColor: 'from-violet-500 to-purple-800',
    description: 'Relational (PostgreSQL, MySQL) vs NoSQL (MongoDB, Firebase Firestore, Redis), schema design, indexing, and query optimization.',
    topicsCount: 7,
    topics: [
      {
        id: 'sql-vs-nosql',
        slug: 'sql-vs-nosql-database-design',
        categorySlug: 'databases',
        title: 'SQL vs NoSQL: Making the Right Choice',
        summary: 'Learn when to choose strict relational tables (PostgreSQL/MySQL) versus flexible JSON document stores (Firestore/MongoDB).',
        difficulty: 'Beginner',
        readTime: '6 min read',
        prerequisites: ['Basic data storage concepts'],
        keyTerms: [
          { term: 'ACID Compliance', definition: 'Guarantees that database transactions are processed reliably (Atomicity, Consistency, Isolation, Durability).' },
          { term: 'Document Store', definition: 'A NoSQL database that stores data as JSON documents with key-value fields.' }
        ],
        overviewMarkdown: `
### Key Comparisons
- **SQL (Relational)**: Structured tables with fixed schemas, primary keys, and foreign key JOINs. Great for financial apps & strict relations.
- **NoSQL (Document/Key-Value)**: Flexible JSON documents, scales horizontally out-of-the-box. Great for real-time chat, dashboards, and rapid prototyping.
        `,
        quiz: [
          {
            question: 'Which database type is typically best suited for complex multi-table financial transactions with ACID guarantees?',
            options: ['NoSQL Key-Value Store', 'Relational SQL Database', 'In-memory text files', 'Graph DB only'],
            answerIndex: 1,
            explanation: 'Relational SQL databases (PostgreSQL/MySQL) excel at strict ACID compliant multi-table transactions.'
          }
        ],
        practicalApplications: ['Designing Scalable Backends', 'College Management Systems', 'Real-time Chat Apps']
      }
    ]
  },
  {
    id: 'cloud-aws',
    slug: 'cloud-aws',
    title: 'Cloud Computing & AWS',
    iconName: 'Cloud',
    badgeColor: 'from-sky-500 to-blue-700',
    description: 'Discover Cloud Architecture, Amazon EC2 virtual servers, S3 storage buckets, Serverless AWS Lambda, and DevOps pipelines.',
    topicsCount: 8,
    topics: [
      {
        id: 'aws-s3-ec2-basics',
        slug: 'cloud-computing-aws-essentials',
        categorySlug: 'cloud-aws',
        title: 'Cloud Computing & AWS Essentials',
        summary: 'Cloud computing allows renting computing power, storage, and databases over the internet instead of buying physical servers.',
        difficulty: 'Beginner',
        readTime: '5 min read',
        prerequisites: ['Basic internet fundamentals'],
        keyTerms: [
          { term: 'AWS EC2', definition: 'Virtual servers in the cloud you can spin up in seconds.' },
          { term: 'AWS S3', definition: 'Scalable object storage for files, images, videos, and static site assets.' },
          { term: 'Serverless (Lambda)', definition: 'Running code on-demand without managing server infrastructure.' }
        ],
        overviewMarkdown: `
### Cloud Service Models
1. **IaaS (Infrastructure as a Service)**: Rent raw VMs (e.g. AWS EC2).
2. **PaaS (Platform as a Service)**: Deploy application code without OS setup (e.g. Vercel, Heroku).
3. **SaaS (Software as a Service)**: Use complete cloud software (e.g. Google Drive, Figma).
        `,
        quiz: [
          {
            question: 'What is AWS S3 primarily used for?',
            options: ['Running Python loops', 'Storing files, media, and static assets in object buckets', 'Compiling C++ code', 'Hosting SQL queries only'],
            answerIndex: 1,
            explanation: 'Amazon Simple Storage Service (S3) is an object storage service offering industry-leading scalability and file availability.'
          }
        ],
        practicalApplications: ['Hosting Production Applications', 'Storing User Avatars & Files', 'Scalable Microservices']
      }
    ]
  },
  {
    id: 'space-satellites',
    slug: 'space-satellites',
    title: 'Space Tech & Satellites',
    iconName: 'Rocket',
    badgeColor: 'from-purple-600 to-pink-600',
    description: 'Explore satellite communication, orbital mechanics, GPS triangulation, Earth observation, and deep space probes (Voyager 1 & 2).',
    topicsCount: 7,
    topics: [
      {
        id: 'voyager-deep-space',
        slug: 'voyager-1-space-communication',
        categorySlug: 'space-satellites',
        title: 'Voyager 1: Engineering Interstellar Communication',
        summary: 'Launched in 1977, Voyager 1 is over 24 billion kilometers away from Earth. Learn how radio signals travel across interstellar space at the speed of light.',
        difficulty: 'Beginner',
        readTime: '6 min read',
        prerequisites: ['Curiosity about physics & tech!'],
        keyTerms: [
          { term: 'Deep Space Network (DSN)', definition: 'NASA\'s international array of giant radio antennas that communicate with interplanetary space missions.' },
          { term: 'One-Way Light Time', definition: 'The ~22.5 hours it takes for radio signals to travel from Earth to Voyager 1.' },
          { term: 'Radioisotope Thermoelectric Generator (RTG)', definition: 'Plutonium power source keeping spacecraft instruments alive.' }
        ],
        overviewMarkdown: `
### How Voyager 1 Transmits Data
Voyager 1's radio transmitter emits a signal with a power of just **23 Watts** (less than a refrigerator bulb!). By the time the signal reaches NASA's Deep Space Network dishes on Earth, its power is less than a billionth of a billionth of a watt ($10^{-19}$ Watts).

#### Key Mission Specs
- **Speed**: ~61,000 km/h (17 km/s relative to the Sun)
- **Computer Memory**: 68 Kilobytes total memory!
- **Data Rate**: ~160 bits per second across interstellar space.
        `,
        quiz: [
          {
            question: 'Roughly how long does a radio signal take to travel one-way from Earth to Voyager 1?',
            options: ['8 minutes', '22.5 hours', '3 days', '1 month'],
            answerIndex: 1,
            explanation: 'At a distance of over 24 billion kilometers, radio signals traveling at light speed take ~22.5 hours one-way.'
          }
        ],
        practicalApplications: ['Satellite Data Decoding', 'Radio Astronomy', 'Low-Bandwidth Communication Engineering']
      }
    ]
  },
  {
    id: 'github-devtools',
    slug: 'github-developer-tools',
    title: 'GitHub & Developer Tools',
    iconName: 'GitBranch',
    badgeColor: 'from-gray-700 to-gray-900',
    description: 'Master Git version control, GitHub Collaboration, Pull Requests, Open Source Contributions, VS Code shortcuts & CI/CD workflows.',
    topicsCount: 8,
    topics: [
      {
        id: 'git-github-starter',
        slug: 'git-github-open-source-guide',
        categorySlug: 'github-developer-tools',
        title: 'Git Version Control & GitHub Open Source',
        summary: 'Git tracks changes in your code repository, allowing you to rollback mistakes, create feature branches, and collaborate with developers globally.',
        difficulty: 'Beginner',
        readTime: '5 min read',
        prerequisites: ['Terminal basics'],
        keyTerms: [
          { term: 'Commit', definition: 'A snapshot save point of your project at a specific moment in time.' },
          { term: 'Pull Request (PR)', definition: 'A request to merge your code changes into a main project repository.' },
          { term: 'Fork', definition: 'Making a copy of someone else\'s repository under your own account to make changes.' }
        ],
        overviewMarkdown: `
### Essential Git Commands
\`\`\`bash
# 1. Initialize local repository
git init

# 2. Add files to staging
git add .

# 3. Commit snapshot with message
git commit -m "feat: Add Technovate Navbar component"

# 4. Push to remote GitHub branch
git push origin main
\`\`\`
        `,
        quiz: [
          {
            question: 'What is the purpose of a Git Pull Request (PR)?',
            options: [
              'To download code to your laptop',
              'To propose merging your branch changes into the project repository so peers can review it',
              'To delete remote branches',
              'To run automated tests on Windows only'
            ],
            answerIndex: 1,
            explanation: 'A Pull Request is the heart of GitHub collaboration, letting teammates review and comment on proposed changes.'
          }
        ],
        practicalApplications: ['Contributing to Open Source (GSOC)', 'Team Hackathon Projects', 'Building Developer Portfolios']
      }
    ]
  }
];
