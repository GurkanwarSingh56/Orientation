'use client';

import { useState } from 'react';
import { Search, Compass, MapPin, Sparkles, ArrowRight, Bot, ShieldAlert, Code2, Cloud, Rocket, GitBranch, Database } from 'lucide-react';
import Tech3DVisual from '@/components/landing/Tech3DVisual';

export interface HeroProps {
  onSearch?: (query: string) => void;
  onSelectChip?: (chipName: string) => void;
}

export default function Hero({ onSearch, onSelectChip }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const popularChips = [
    { name: 'AI Agents', icon: Bot, query: 'ai-agents' },
    { name: 'DSA', icon: Code2, query: 'dsa-prep' },
    { name: 'GitHub Education', icon: GitBranch, query: 'github-tools' },
    { name: 'AWS', icon: Cloud, query: 'cloud-aws' },
    { name: 'Cybersecurity', icon: ShieldAlert, query: 'cybersecurity' },
    { name: 'Voyager 1', icon: Rocket, query: 'space-satellites' },
  ];

  const handleChipClick = (chip: { name: string; query: string }) => {
    setActiveChip(chip.name);
    setSearchQuery(chip.name);
    if (onSelectChip) onSelectChip(chip.query);
    if (onSearch) onSearch(chip.name);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#050814] text-white">
      {/* Background Radial Glow Gradients & Grid Lines */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Content & Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Eyebrow */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                TECHNOVATE TECH HUB
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Explore.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500">
                Learn. Build. Connect.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
              Discover technologies, understand how the world around you works, find what to learn next, and explore opportunities beyond the classroom.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href="#topics"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Technology</span>
              </a>

              <a
                href="#roadmaps"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all backdrop-blur-md"
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Explore Roadmaps</span>
              </a>
            </div>

            {/* Hero Large Search Bar */}
            <div className="pt-4 max-w-xl">
              <div className="relative group">
                <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-pink-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search AI, DSA, GitHub, AWS, satellites..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B1124]/90 border border-cyan-500/30 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-2xl backdrop-blur-xl transition-all"
                />
              </div>

              {/* Popular Chips */}
              <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-gray-400 font-semibold mr-1">Popular:</span>
                {popularChips.map((chip) => {
                  const Icon = chip.icon;
                  const isSelected = activeChip === chip.name;
                  return (
                    <button
                      key={chip.name}
                      onClick={() => handleChipClick(chip)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/30 border border-cyan-400'
                          : 'bg-white/5 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{chip.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive WebGL Tech Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Tech3DVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
