export interface TechFact {
  id: string;
  category: string;
  title: string;
  fact: string;
  source: string;
  date: string;
  iconName: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  problemStatement: string;
  exampleInput: string;
  exampleOutput: string;
  hint: string;
}

export const TECH_FACTS_DATA: TechFact[] = [
  {
    id: 'fact-1',
    category: 'Space Tech',
    title: 'Voyager 1 Transmits at 23 Watts',
    fact: 'Voyager 1 communicates with NASA across 24 billion kilometers using a radio transmitter powered at just 23 Watts — less power than a standard refrigerator light bulb!',
    source: 'NASA Jet Propulsion Laboratory',
    date: '2026-08-13',
    iconName: 'Rocket'
  },
  {
    id: 'fact-2',
    category: 'Cybersecurity',
    title: 'The Origin of the Term "Bug"',
    fact: 'In 1947, Grace Hopper recorded the first actual computer "bug" — a real moth trapped inside Relay #70 of the Harvard Mark II electromechanical computer!',
    source: 'Smithsonian National Museum',
    date: '2026-08-13',
    iconName: 'Bug'
  },
  {
    id: 'fact-3',
    category: 'AI & Machine Learning',
    title: 'GPT Models & Matrix Multiplication',
    fact: 'Over 95% of the compute power used during LLM neural network training is spent performing simple 2D matrix multiplications ($A \\times B$) at massive GPU scale.',
    source: 'NVIDIA Research',
    date: '2026-08-13',
    iconName: 'Cpu'
  },
  {
    id: 'fact-4',
    category: 'Web & Networking',
    title: '99% of Global Internet Runs on Subsea Cables',
    fact: 'Contrary to popular belief, over 99% of international internet traffic travels through fiber-optic cables laid on the ocean floor, not satellites!',
    source: 'Telegeography Submarine Cable Map',
    date: '2026-08-13',
    iconName: 'Globe'
  }
];

export const DAILY_CHALLENGE_DATA: DailyChallenge = {
  id: 'daily-2026-08-13',
  title: 'Valid Palindrome (Ignore Non-Alphanumeric)',
  difficulty: 'Easy',
  category: 'Strings & Two Pointers',
  problemStatement: 'Given a string `s`, return `true` if it is a palindrome after converting all uppercase letters into lowercase and removing all non-alphanumeric characters.',
  exampleInput: 's = "A man, a plan, a canal: Panama"',
  exampleOutput: 'true ("amanaplanacanalpanama" reads same forward and backward)',
  hint: 'Use the Two Pointers technique from opposite ends, skipping spaces and punctuation!'
};
