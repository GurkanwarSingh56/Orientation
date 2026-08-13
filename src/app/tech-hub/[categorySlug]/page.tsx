'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TECH_CATEGORIES } from '@/lib/data/tech-hub-data';
import { Compass, Clock, ArrowRight, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;

  const category = TECH_CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    return (
      <main className="bg-[#0B0F19] min-h-screen text-white pt-28 px-4 text-center">
        <Navbar />
        <h1 className="text-2xl font-bold text-red-400">Category Not Found</h1>
        <Link href="/tech-hub" className="mt-4 inline-block text-cyan-400 underline">Back to Tech Hub</Link>
      </main>
    );
  }

  return (
    <main className="bg-[#0B0F19] min-h-screen text-white pt-24">
      <Navbar />

      {/* Category Header */}
      <section className="py-12 bg-gradient-to-b from-[#0F172A] to-[#0B0F19] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Compass className="w-4 h-4" />
            <Link href="/tech-hub" className="hover:underline">Tech Hub</Link>
            <span>/</span>
            <span>{category.title}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{category.title}</h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-3">{category.description}</p>
        </div>
      </section>

      {/* Topics List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Topics in this Domain ({category.topics.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.topics.map((topic) => (
              <div
                key={topic.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {topic.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> {topic.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>

                  {/* Zero Jargon Pitch Box */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 mb-4">
                    <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Zero Jargon Summary
                    </p>
                    <p className="text-xs text-gray-200 leading-relaxed">{topic.summary}</p>
                  </div>

                  {/* Key Terms Pill */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {topic.keyTerms.map((kt) => (
                      <span key={kt.term} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                        {kt.term}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/tech-hub/${category.slug}/${topic.slug}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md hover:opacity-90 transition-opacity"
                >
                  <span>Start Learning Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
