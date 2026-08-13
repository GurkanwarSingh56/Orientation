'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import QuickTopicNav from '@/components/landing/QuickTopicNav';
import ExploreTechnology from '@/components/landing/ExploreTechnology';
import FeaturedTopics from '@/components/landing/FeaturedTopics';
import LearningRoadmaps from '@/components/landing/LearningRoadmaps';
import StudentOpportunities from '@/components/landing/StudentOpportunities';
import TodayInTech from '@/components/landing/TodayInTech';
import DidYouKnow from '@/components/landing/DidYouKnow';
import StartLearningCTA from '@/components/landing/StartLearningCTA';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeTopicFilter, setActiveTopicFilter] = useState('all');

  return (
    <main className="bg-[#050814] min-h-screen text-white selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section with 3D WebGL Tech Visual & Search Bar + Popular Chips */}
      <Hero
        onSelectChip={(query) => setActiveTopicFilter(query)}
      />

      {/* 3. Quick Topic Navigation ("What are you curious about?") */}
      <QuickTopicNav
        activeTopic={activeTopicFilter}
        onSelectTopic={(topicId) => setActiveTopicFilter(topicId)}
      />

      {/* 4. Explore Technology */}
      <ExploreTechnology />

      {/* 5. Featured Topics */}
      <FeaturedTopics activeCategoryFilter={activeTopicFilter} />

      {/* 6. Learning Roadmaps */}
      <LearningRoadmaps />

      {/* 7. Student Opportunities */}
      <StudentOpportunities />

      {/* 8. Today in Tech */}
      <TodayInTech />

      {/* 9. Did You Know? */}
      <DidYouKnow />

      {/* 10. Start Learning CTA */}
      <StartLearningCTA />

      {/* 11. Footer */}
      <Footer />
    </main>
  );
}
