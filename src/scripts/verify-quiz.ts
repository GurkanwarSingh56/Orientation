import { ALL_QUIZ_QUESTIONS } from '../lib/data/quiz-questions';
import { DomainSlug, QuizDifficulty } from '../lib/types/quiz';

const REQUIRED_DOMAINS: DomainSlug[] = [
  'cybersecurity',
  'web-development',
  'dsa',
  'databases',
  'cloud-aws',
  'space-satellites',
  'github-tools',
];

const VALID_DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard'];

export function runQuizValidation() {
  console.log('🔍 Starting Programmatic Quiz Validation...\n');
  const errors: string[] = [];

  // 1. Total Count Verification
  if (ALL_QUIZ_QUESTIONS.length !== 70) {
    errors.push(`❌ Total question count is ${ALL_QUIZ_QUESTIONS.length}, expected exactly 70.`);
  } else {
    console.log('✅ Total question count: 70');
  }

  // 2. ID Uniqueness Check
  const idSet = new Set<string>();
  ALL_QUIZ_QUESTIONS.forEach((q, idx) => {
    if (!q.id) {
      errors.push(`❌ Question at index ${idx} is missing an ID.`);
    } else if (idSet.has(q.id)) {
      errors.push(`❌ Duplicate question ID found: "${q.id}"`);
    } else {
      idSet.add(q.id);
    }
  });

  if (idSet.size === 70) {
    console.log('✅ All 70 question IDs are unique.');
  }

  // 3. Per-Domain & Difficulty Validation
  REQUIRED_DOMAINS.forEach((domain) => {
    const domainQuestions = ALL_QUIZ_QUESTIONS.filter((q) => q.domain === domain);
    
    if (domainQuestions.length !== 10) {
      errors.push(`❌ Domain "${domain}" has ${domainQuestions.length} questions, expected exactly 10.`);
    } else {
      console.log(`✅ Domain "${domain}": 10 questions`);
    }

    // Difficulty breakdown per domain
    const easyCount = domainQuestions.filter((q) => q.difficulty === 'easy').length;
    const mediumCount = domainQuestions.filter((q) => q.difficulty === 'medium').length;
    const hardCount = domainQuestions.filter((q) => q.difficulty === 'hard').length;

    if (easyCount !== 3 || mediumCount !== 4 || hardCount !== 3) {
      errors.push(
        `❌ Domain "${domain}" difficulty distribution mismatch! Found (${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard), expected (3 Easy, 4 Medium, 3 Hard).`
      );
    }
  });

  // 4. Detailed Question Content Validation
  ALL_QUIZ_QUESTIONS.forEach((q, idx) => {
    // Check 4 options
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`❌ Question "${q.id}" does not have exactly 4 options.`);
    } else {
      q.options.forEach((opt, optIdx) => {
        if (typeof opt !== 'string' || opt.trim().length === 0) {
          errors.push(`❌ Question "${q.id}" option at index ${optIdx} is empty.`);
        }
      });
    }

    // Check valid correct answer
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      errors.push(`❌ Question "${q.id}" has invalid correctAnswer: ${q.correctAnswer} (must be 0, 1, 2, or 3).`);
    }

    // Check explanation
    if (typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
      errors.push(`❌ Question "${q.id}" is missing an explanation.`);
    }

    // Check difficulty
    if (!VALID_DIFFICULTIES.includes(q.difficulty)) {
      errors.push(`❌ Question "${q.id}" has invalid difficulty: "${q.difficulty}".`);
    }
  });

  console.log('\n====================================');
  if (errors.length === 0) {
    console.log('🎉 ALL VALIDATIONS PASSED PERFECTLY!');
    console.log('====================================\n');
    return true;
  } else {
    console.error(`💥 VALIDATION FAILED WITH ${errors.length} ERROR(S):`);
    errors.forEach((err) => console.error(`  - ${err}`));
    console.log('====================================\n');
    process.exit(1);
  }
}

// Execute if run directly
runQuizValidation();
