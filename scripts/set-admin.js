// Script to set a user as admin
// Usage: node scripts/set-admin.js <user-email>

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json'); // You'll need this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setUserAsAdmin(email) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // Update role in Firestore
    await db.collection('users').doc(uid).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Successfully set ${email} (${uid}) as admin`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/set-admin.js <user-email>');
  process.exit(1);
}

setUserAsAdmin(email).then(() => process.exit(0));
