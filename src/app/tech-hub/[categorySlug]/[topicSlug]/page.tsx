'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECH_CATEGORIES } from '@/lib/data/tech-hub-data';
import { Compass, Clock, Sparkles, CheckCircle2, HelpCircle, Code, Rocket, BookOpen, ArrowLeft } from 'lucide-react';

export default function TopicLearningPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;
  const topicSlug = params?.topicSlug as string;

  const category = TECH_CATEGORIES.find((c) => c.slug === categorySlug);
  const topic = category?.topics.find((t) => t.slug === topicSlug);

  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  if (!category || !topic) {
    return (
      <main className="bg-[#0B0F19] min-h-screen text-white pt-28 px-4 text-center">
        <Navbar />
        <h1 className="text-2xl font-bold text-red-400">Topic Not Found</h1>
        <Link href="/tech-hub" className="mt-4 inline-block text-cyan-400 underline">Back to Tech Hub</Link>
      </main>
    );
  }

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setShowResults((prev) => ({ ...prev, [qIndex]: true }));
  };

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Navigation Breadcrumb & Header */}
      <section className="py-10 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Link href="/tech-hub" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Tech Hub
            </Link>
            <span>/</span>
            <Link href={`/tech-hub/${category.slug}`} className="hover:underline">{category.title}</Link>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{topic.title}</h1>

          <div className="mt-4 flex items-center space-x-4 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono font-bold">
              {topic.difficulty}
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> {topic.readTime}
            </span>
          </div>

          {/* Zero Jargon Pitch Card */}
          <div className="mt-6 p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 shadow-xl backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" /> Zero Jargon Summary
            </h3>
            <p className="text-sm text-gray-100 leading-relaxed">{topic.summary}</p>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Key Terms Section */}
          {topic.keyTerms && topic.keyTerms.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Key Terms & Glossary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.keyTerms.map((kt) => (
                  <div key={kt.term} className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-xs font-mono font-bold text-cyan-300 mb-1">{kt.term}</h4>
                    <p className="text-xs text-gray-300">{kt.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Snippet (if any) */}
          {topic.codeSnippet && (
            <div className="p-6 rounded-2xl bg-[#090D16] border border-cyan-500/30 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                  <Code className="w-4 h-4" /> {topic.codeSnippet.title}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-gray-300">
                  {topic.codeSnippet.language}
                </span>
              </div>
              <pre className="font-mono text-xs text-cyan-100 overflow-x-auto p-4 rounded-xl bg-black/50 border border-white/10 leading-relaxed">
                <code>{topic.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Practical Applications */}
          {topic.practicalApplications && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-400" />
                <span>Real-World Applications</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {topic.practicalApplications.map((app) => (
                  <span key={app} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-200 border border-purple-500/30">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Quiz & Self Assessment */}
          {topic.quiz && topic.quiz.length > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border border-indigo-500/40 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Test Your Understanding</span>
              </h3>
              <p className="text-xs text-gray-300 mb-6">Select an answer to reveal instant feedback and explanation:</p>

              {topic.quiz.map((q, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <h4 className="text-sm font-bold text-white">{q.question}</h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedQuizAnswers[qIdx] === optIdx;
                      const isCorrect = optIdx === q.answerIndex;
                      const hasAnswered = showResults[qIdx];

                      let btnStyle = 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10';
                      if (hasAnswered) {
                        if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                        else if (isSelected) btnStyle = 'border-red-500 bg-red-500/20 text-red-200';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {showResults[qIdx] && (
                    <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs text-gray-200 leading-relaxed mt-2">
                      <span className="font-bold text-cyan-400">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
