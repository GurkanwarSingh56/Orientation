'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, HelpCircle, Loader2, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DOMAIN_ITEMS, FEATURED_DOMAIN, DomainItem } from '@/lib/data/domain-data';
import { ALL_QUIZ_QUESTIONS, evaluateQuizSubmission } from '@/lib/data/quiz-questions';
import { DomainSlug } from '@/lib/types/quiz';
import { signInAnonymouslyUser } from '@/lib/firebase/auth';
import { saveCompleteQuizSubmission } from '@/lib/firebase/firestore';

export default function QuizPage({ params }: { params: { domain: string } }) {
  const router = useRouter();
  const domainSlug = params.domain as DomainSlug;

  // Find domain metadata
  const domain: DomainItem = [FEATURED_DOMAIN, ...DOMAIN_ITEMS].find(
    (d) => d.quizSlug === domainSlug || d.id === domainSlug
  ) || {
    id: domainSlug,
    quizSlug: domainSlug,
    title: domainSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: HelpCircle,
    shortDescription: `Test your knowledge in ${domainSlug}.`,
    explanation: `Educational quiz for ${domainSlug}.`,
    subtopics: ['General Concepts', 'Core Knowledge'],
  };

  // Exactly 10 questions for this domain
  const questions = ALL_QUIZ_QUESTIONS.filter((q) => q.domain === domainSlug);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [studentName, setStudentName] = useState('');
  const [nameEntered, setNameEntered] = useState(false);
  const [participantId, setParticipantId] = useState<string>('');
  const [startedAtIso, setStartedAtIso] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Anonymous Auth and timestamps on mount
  useEffect(() => {
    setStartedAtIso(new Date().toISOString());

    // Check saved student name
    const savedName = localStorage.getItem('technovate_student_name');
    if (savedName) {
      setStudentName(savedName);
      setNameEntered(true);
    }

    signInAnonymouslyUser()
      .then((user) => {
        setParticipantId(user.uid);
      })
      .catch((err) => {
        console.warn('Anonymous Auth fallback:', err);
        const fallbackId = 'anon_' + Math.random().toString(36).substring(2, 9);
        setParticipantId(fallbackId);
      });
  }, []);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim().length > 0) {
      localStorage.setItem('technovate_student_name', studentName.trim());
      setNameEntered(true);
    }
  };

  const currentQuestion = questions[currentStep] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitting) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const submissionsList = Object.entries(selectedAnswers).map(([qId, sOpt]) => ({
        questionId: qId,
        selectedOption: sOpt,
      }));

      // Evaluate score
      const evalRes = evaluateQuizSubmission(domainSlug, submissionsList);

      // Save to Firestore & local fallback
      const savedResult = await saveCompleteQuizSubmission(
        attemptId,
        domainSlug,
        domain.title,
        participantId || 'anon_user',
        studentName || 'Student',
        submissionsList,
        evalRes.score,
        evalRes.maxScore,
        evalRes.earnedPoints,
        evalRes.totalPoints,
        startedAtIso || new Date().toISOString()
      );

      // Persist in localStorage for instant refresh resilience
      const fullPayload = {
        attemptId,
        result: savedResult,
        submissions: submissionsList,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      };

      try {
        localStorage.setItem(`technovate_quiz_attempt_${attemptId}`, JSON.stringify(fullPayload));
        localStorage.setItem('technovate_latest_attempt_id', attemptId);

        // Append to local history array
        const existingHistStr = localStorage.getItem('technovate_quiz_history');
        const existingHist = existingHistStr ? JSON.parse(existingHistStr) : [];
        const updatedHist = [savedResult, ...existingHist.filter((h: any) => h.attemptId !== attemptId)];
        localStorage.setItem('technovate_quiz_history', JSON.stringify(updatedHist));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }

      // Navigate to result page
      router.push(`/result?attemptId=${attemptId}`);
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setErrorMsg(err.message || 'Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  const IconComponent = domain.icon;

  return (
    <main className="bg-[#050814] min-h-screen text-white flex flex-col justify-between selection:bg-cyan-400 selection:text-black">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Top Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/#explore"
            className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
            <span>Domain:</span>
            <span className="text-cyan-300 font-bold">{domain.title}</span>
          </div>
        </div>

        {/* Name Prompt Step if name not entered yet */}
        {!nameEntered ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/30 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <IconComponent className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Technovate Student Quiz
                </span>
                <h1 className="text-2xl font-extrabold text-white">{domain.title} Quiz</h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Welcome! Please enter your name to personalize your quiz result certificate and record your progress.
            </p>

            <form onSubmit={handleStartQuiz} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Gurkanwar Singh"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
              >
                <span>Start {domain.title} Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Header & Progress Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0D152D] via-[#111A38] to-[#0D152D] border border-cyan-500/30 shadow-2xl mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                      {domain.title} Quiz
                    </h1>
                    <p className="text-xs text-gray-300">
                      Student: <span className="text-cyan-300 font-semibold">{studentName}</span> • Question {currentStep + 1} of {totalQuestions}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Current Question Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1124] border border-white/10 shadow-xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  <span className="text-cyan-400 font-mono mr-2">{currentStep + 1}.</span>
                  {currentQuestion.question}
                </h2>
              </div>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const isOptionSelected = selectedAnswers[currentQuestion.id] === optIdx;

                  let optionStyle =
                    'bg-white/5 border-white/10 hover:border-cyan-500/40 hover:bg-white/10 text-gray-200';
                  if (isOptionSelected) {
                    optionStyle = 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-semibold shadow-glow';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      disabled={isSubmitting}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className="w-7 h-7 rounded-lg bg-white/10 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optionText}</span>
                      </div>
                      {isOptionSelected && (
                        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stepper Navigation Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="text-xs font-mono text-gray-400">
                  {Object.keys(selectedAnswers).length} of {totalQuestions} Answered
                </div>

                {currentStep < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting || Object.keys(selectedAnswers).length < totalQuestions}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Result...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Quiz</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
