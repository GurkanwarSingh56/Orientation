'use client';

export interface QuickTopicNavProps {
  activeTopic?: string;
  onSelectTopic?: (topicId: string) => void;
}

export const TOPIC_NAV_ITEMS = [
  { id: 'ai-agents', emoji: '🤖', name: 'AI & AI Agents', href: '#topics' },
  { id: 'cybersecurity', emoji: '🔐', name: 'Cybersecurity', href: '#topics' },
  { id: 'web-dev', emoji: '🌐', name: 'Web Development', href: '#topics' },
  { id: 'dsa-prep', emoji: '🧠', name: 'DSA', href: '#topics' },
  { id: 'databases', emoji: '🗄️', name: 'Databases', href: '#topics' },
  { id: 'cloud-aws', emoji: '☁️', name: 'Cloud & AWS', href: '#topics' },
  { id: 'space-satellites', emoji: '🛰️', name: 'Space', href: '#topics' },
  { id: 'github-tools', emoji: '🐙', name: 'GitHub', href: '#topics' },
];

export default function QuickTopicNav({ activeTopic = 'all', onSelectTopic }: QuickTopicNavProps) {
  return (
    <section className="py-8 bg-[#050814] border-y border-cyan-500/20 backdrop-blur-xl relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              What are you curious about?
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Jump into a technology and start exploring.
            </p>
          </div>
        </div>

        {/* Compact Navigation Bar - Horizontally Scrollable on Mobile with Zero Overflow */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {TOPIC_NAV_ITEMS.map((item) => {
            const isSelected = activeTopic === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (onSelectTopic) onSelectTopic(item.id);
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-[#0B1124] hover:bg-white/10 text-gray-300 hover:text-white border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
