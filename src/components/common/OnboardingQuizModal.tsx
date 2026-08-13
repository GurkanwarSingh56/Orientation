'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingQuizModal({ isOpen, onClose }: OnboardingQuizModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [year, setYear] = useState('1st Year');
  const [branch, setBranch] = useState('Non-CSE (Electrical / Mechanical / Civil / Other)');
  const [goal, setGoal] = useState('Explore tech with zero pressure');

  if (!isOpen) return null;

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const branches = [
    'Non-CSE (Electrical / Mechanical / Civil / Biotech)',
    'Computer Science / IT',
    'Electronics & Communication (ECE)',
    'Other Branch'
  ];
  const goals = [
    { title: 'Explore tech from absolute scratch', desc: 'No coding background needed. Start with visual guides.', targetUrl: '/tech-hub/web-development' },
    { title: 'Learn AI & Autonomous Agents', desc: 'Discover LLMs, Prompting, and build AI apps.', targetUrl: '/tech-hub/ai-agents' },
    { title: 'Follow a Guided Step-by-Step Roadmap', desc: 'Structured progress tracks with zero confusion.', targetUrl: '/roadmaps/web-dev-starter' },
    { title: 'Prepare for Off-Campus Internships & DSA', desc: 'Coding patterns, resume prep, and student opportunities.', targetUrl: '/roadmaps/dsa-interview-prep' }
  ];

  const handleComplete = (targetUrl: string) => {
    onClose();
    router.push(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-bold text-white">Find Your Technovate Path</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full mx-1 transition-all ${
                s <= step ? 'bg-gradient-to-r from-cyan-400 to-blue-600' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Academic Year */}
        {step === 1 && (
          <div>
            <h4 className="text-base font-semibold text-white mb-1">What year of college are you in?</h4>
            <p className="text-xs text-gray-400 mb-4">We customize content recommendations based on your current stage.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    year === y
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-90"
            >
              <span>Next: Select Branch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Branch */}
        {step === 2 && (
          <div>
            <h4 className="text-base font-semibold text-white mb-1">Which branch are you studying in?</h4>
            <p className="text-xs text-gray-400 mb-4">Technovate is built for ALL branches — not just Computer Science!</p>

            <div className="space-y-2.5 mb-6">
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => setBranch(b)}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    branch === b
                      ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 hover:opacity-90"
              >
                <span>Next: Choose Your Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goal & Path Selection */}
        {step === 3 && (
          <div>
            <h4 className="text-base font-semibold text-white mb-1">What is your primary goal right now?</h4>
            <p className="text-xs text-gray-400 mb-4">Select where you want to dive in first:</p>

            <div className="space-y-3 mb-6">
              {goals.map((g) => (
                <button
                  key={g.title}
                  onClick={() => handleComplete(g.targetUrl)}
                  className="w-full p-3.5 rounded-xl border border-cyan-500/30 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-400 text-left transition-all group flex items-start justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-cyan-300">{g.title}</h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">{g.desc}</p>
                  </div>
                  <Rocket className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2 mt-1" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Back to Branch Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
