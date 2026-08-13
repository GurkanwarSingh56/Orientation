import fs from 'fs';
import path from 'path';

// Load .env.local synchronously BEFORE importing Firebase config
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const k = key.trim();
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      if (k) {
        process.env[k] = val;
      }
    }
  });
}

async function runVerification() {
  const { default: app, auth, db, rtdb, getApps } = await import('../lib/firebase/config');
  const { ALL_QUIZ_QUESTIONS } = await import('../lib/data/quiz-questions');

  console.log('🔥 Starting Firebase Integration Verification...\n');
  const errors: string[] = [];

  // 1. Check Singleton Firebase App Initialization
  const activeApps = getApps();
  if (activeApps.length !== 1) {
    errors.push(`❌ Expected exactly 1 active Firebase app instance, found ${activeApps.length}.`);
  } else {
    console.log(`✅ Singleton Firebase App initialized successfully: "${app.name}"`);
  }

  // 2. Verify Config Environment Variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`❌ Missing environment variable: ${varName}`);
    }
  });

  if (errors.length === 0) {
    console.log('✅ All required NEXT_PUBLIC_FIREBASE_* environment variables are set.');
    console.log(`   - Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    console.log(`   - Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);
    console.log(`   - Database URL: ${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}`);
  }

  // 3. Verify SDK Services
  if (!auth) errors.push('❌ Firebase Auth service is not initialized.');
  else console.log('✅ Firebase Auth service initialized.');

  if (!db) errors.push('❌ Cloud Firestore service is not initialized.');
  else console.log('✅ Cloud Firestore service initialized.');

  if (!rtdb) errors.push('❌ Realtime Database service is not initialized.');
  else console.log('✅ Realtime Database service initialized.');

  // 4. Verify 70 Questions dataset readiness for Firestore
  if (ALL_QUIZ_QUESTIONS.length === 70) {
    console.log('✅ All 70 quiz questions ready for Firestore document seeding.');
  } else {
    errors.push(`❌ Quiz questions count mismatch: ${ALL_QUIZ_QUESTIONS.length}/70`);
  }

  console.log('\n====================================');
  if (errors.length === 0) {
    console.log('🎉 FIREBASE INTEGRATION VERIFIED PERFECTLY!');
    console.log('====================================\n');
    return true;
  } else {
    console.error(`💥 FIREBASE VERIFICATION FAILED WITH ${errors.length} ERROR(S):`);
    errors.forEach((err) => console.error(`  - ${err}`));
    console.log('====================================\n');
    process.exit(1);
  }
}

runVerification();
