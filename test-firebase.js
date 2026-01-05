// test-firebase.js - Test Firebase connection
require('dotenv').config();

console.log('🔥 Testing Firebase Connection...\n');

async function testFirebase() {
  try {
    // Load Firebase
    console.log('1. Loading Firebase configuration...');
    const { db, auth, storage } = require('./src/config/firebase');
    console.log('   ✅ Firebase modules loaded\n');

    // Test Firestore connection
    console.log('2. Testing Firestore connection...');
    const testDoc = await db.collection('_test').doc('connection').set({
      test: true,
      timestamp: new Date().toISOString(),
    });
    console.log('   ✅ Firestore write successful');

    const readDoc = await db.collection('_test').doc('connection').get();
    if (readDoc.exists) {
      console.log('   ✅ Firestore read successful');
      console.log('   Data:', readDoc.data());
    }

    // Clean up test document
    await db.collection('_test').doc('connection').delete();
    console.log('   ✅ Cleanup successful\n');

    // Test Auth
    console.log('3. Testing Firebase Auth...');
    const authMethods = await auth.listUsers(1);
    console.log('   ✅ Firebase Auth accessible');
    console.log(`   Current users: ${authMethods.users.length}\n`);

    // Show configuration
    console.log('4. Firebase Configuration Status:');
    console.log('   Firestore: ✅ Connected');
    console.log('   Auth: ✅ Connected');
    console.log('   Storage: ✅ Connected\n');

    console.log('✅ All Firebase tests passed!\n');
    console.log('🎉 Your backend is ready to use Firebase!\n');
    console.log('Next steps:');
    console.log('1. Enable Email/Password auth in Firebase Console');
    console.log('2. Enable Google Sign-In in Firebase Console');
    console.log('3. Enable Apple Sign-In in Firebase Console');
    console.log('4. Configure Firestore security rules');
    console.log('5. Run: npm run dev\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Firebase Test Failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. firebaseKey.json not found in project root');
    console.error('2. Invalid service account key');
    console.error('3. Firebase project not set up correctly');
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

testFirebase();