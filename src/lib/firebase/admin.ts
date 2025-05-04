// src/lib/firebase/admin.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    console.log('Attempting to initialize Firebase Admin SDK...');
    let initialized = false;

    // Try initializing with environment variable (recommended for production/deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log('Found FIREBASE_SERVICE_ACCOUNT environment variable.');
        try {
            const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
            // Basic check if it looks like JSON
            if (serviceAccountJson.trim().startsWith('{') && serviceAccountJson.trim().endsWith('}')) {
                const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
                 // Validate essential properties (optional but helpful)
                 if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
                    console.error('FIREBASE_SERVICE_ACCOUNT JSON is missing essential properties (project_id, client_email, private_key).');
                 } else {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                    console.log('Firebase Admin SDK initialized successfully using FIREBASE_SERVICE_ACCOUNT.');
                    initialized = true;
                 }
            } else {
                 console.error('FIREBASE_SERVICE_ACCOUNT environment variable does not appear to be valid JSON.');
            }
        } catch (parseError: any) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', parseError.message);
        }

    } else {
        console.log('FIREBASE_SERVICE_ACCOUNT environment variable not found.');
    }

    // Fallback for environments like Google Cloud Run/Functions if first method failed
    if (!initialized && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         console.log('Attempting to initialize with Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS).');
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
         console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
         initialized = true;
    } else if (!initialized) {
        console.log('GOOGLE_APPLICATION_CREDENTIALS environment variable not found or not used.');
    }

    if (!initialized) {
         console.warn('Firebase Admin SDK could not be initialized. Neither FIREBASE_SERVICE_ACCOUNT nor GOOGLE_APPLICATION_CREDENTIALS led to successful initialization.');
    }

  } catch (error: any) {
    console.error('CRITICAL Firebase Admin SDK initialization error:', error.stack);
    // Log the error but avoid throwing here to allow the app to potentially start partially
  }
} else {
    console.log('Firebase Admin SDK already initialized.');
}


// Get the Firestore instance only if initialization was likely successful
if (admin.apps.length > 0) {
    try {
        db = admin.firestore();
        console.log('Firestore instance obtained successfully.');
    } catch (dbError: any) {
        console.error('Error obtaining Firestore instance after Admin SDK initialization:', dbError.message);
        db = null; // Ensure db is null if getting instance fails
    }
} else {
     console.warn('Skipping Firestore instance retrieval as Firebase Admin SDK is not initialized.');
     db = null;
}


export { admin, db }; // Export db (which might be null) along with admin
