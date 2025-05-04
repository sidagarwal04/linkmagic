// src/lib/firebase/admin.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin SDK...');
    // Try initializing with environment variables (recommended for production/deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized with service account from environment variable.');

    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         // Fallback for environments like Google Cloud Run/Functions
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
         console.log('Firebase Admin SDK initialized with Application Default Credentials.');
    } else {
         console.warn('Firebase Admin SDK not initialized. Missing FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS environment variable.');
    }


  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    // Avoid throwing error during build/dev time if env vars are missing
    // Instead, log the error and let operations fail gracefully later if SDK is needed
  }
} else {
    console.log('Firebase Admin SDK already initialized.');
}


// Get the Firestore instance (only if initialized)
const db = admin.apps.length > 0 ? admin.firestore() : null;

export { admin, db }; // Export db along with admin
