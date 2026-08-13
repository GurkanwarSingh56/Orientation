'use client';

import Link from 'next/link';
import { 
  Bot, 
  ShieldAlert, 
  Globe, 
  Code2, 
  Database, 
  Cloud, 
  Rocket, 
  GitBranch, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TECH_CATEGORIES } from '@/lib/data/tech-hub-data';

const iconMap: Record<string, any> = {
  Bot,
  ShieldAlert,
  Globe,
  Code2,
  Database,
  Cloud,
  Rocket,
  GitBranch,
};

export default function TechHubCategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {TECH_CATEGORIES.map((cat) => {
        const IconComponent = iconMap[cat.iconName] || Globe;
        return (
          <div
            key={cat.id}
            className="group relative rounded-2xl p-6 bg-white/5 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${cat.badgeColor} text-white shadow-md`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {cat.topicsCount} Topics
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                {cat.title}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Non-CSE Friendly
              </span>
              <Link
                href={`/tech-hub/${cat.slug}`}
                className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                <span>Learn</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
