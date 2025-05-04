// src/lib/firebase/admin.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;
let adminInitializationError: Error | null = null;

console.log('--- Firebase Admin Module Start ---');

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    console.log('Attempting to initialize Firebase Admin SDK...');
    let initialized = false;
    const serviceAccountEnvVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    const gcpCredentialsEnvVar = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // 1. Try initializing with FIREBASE_SERVICE_ACCOUNT environment variable
    if (serviceAccountEnvVar) {
        console.log('Found FIREBASE_SERVICE_ACCOUNT environment variable.');
        try {
            const serviceAccountJson = serviceAccountEnvVar;
            // Basic check if it looks like JSON
            if (serviceAccountJson.trim().startsWith('{') && serviceAccountJson.trim().endsWith('}')) {
                console.log('Attempting to parse FIREBASE_SERVICE_ACCOUNT JSON...');
                const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
                console.log('FIREBASE_SERVICE_ACCOUNT JSON parsed successfully.');

                 // Validate essential properties (optional but helpful)
                 if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
                    console.error('FIREBASE_SERVICE_ACCOUNT JSON is missing essential properties (project_id, client_email, private_key).');
                    adminInitializationError = new Error('FIREBASE_SERVICE_ACCOUNT JSON is missing essential properties.');
                 } else {
                    console.log('Attempting admin.initializeApp with parsed service account...');
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                    console.log('Firebase Admin SDK initialized successfully using FIREBASE_SERVICE_ACCOUNT.');
                    initialized = true;
                 }
            } else {
                 console.error('FIREBASE_SERVICE_ACCOUNT environment variable does not appear to be valid JSON.');
                 adminInitializationError = new Error('FIREBASE_SERVICE_ACCOUNT value is not valid JSON.');
            }
        } catch (parseError: any) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', parseError.message);
            adminInitializationError = new Error(`Error parsing FIREBASE_SERVICE_ACCOUNT: ${parseError.message}`);
        }

    } else {
        console.log('FIREBASE_SERVICE_ACCOUNT environment variable not found.');
    }

    // 2. Fallback for environments like Google Cloud Run/Functions if first method failed
    if (!initialized && gcpCredentialsEnvVar) {
         console.log('Attempting to initialize with Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS found).');
         try {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
             console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
             initialized = true;
         } catch (adcError: any) {
             console.error('Error initializing with Application Default Credentials:', adcError.message);
             // Don't overwrite previous error if FIREBASE_SERVICE_ACCOUNT was tried and failed
             if (!adminInitializationError) {
                 adminInitializationError = new Error(`Error initializing with Application Default Credentials: ${adcError.message}`);
             }
         }
    } else if (!initialized) {
        console.log('GOOGLE_APPLICATION_CREDENTIALS environment variable not found or not used.');
    }

    // 3. Final check if initialized
    if (!initialized) {
         console.warn('Firebase Admin SDK could not be initialized. Neither FIREBASE_SERVICE_ACCOUNT nor GOOGLE_APPLICATION_CREDENTIALS led to successful initialization.');
         // Ensure error object exists if none was set before
         if (!adminInitializationError) {
            adminInitializationError = new Error('Failed to initialize Firebase Admin SDK. No valid credentials found or provided.');
         }
    }

  } catch (error: any) {
    console.error('CRITICAL Firebase Admin SDK initialization error:', error.stack);
    adminInitializationError = error; // Store the top-level error
  }
} else {
    console.log('Firebase Admin SDK already initialized.');
}


// Get the Firestore instance only if initialization was likely successful and no error occurred
if (admin.apps.length > 0 && !adminInitializationError) {
    try {
        db = admin.firestore();
        console.log('Firestore instance obtained successfully.');
    } catch (dbError: any) {
        console.error('Error obtaining Firestore instance after Admin SDK initialization:', dbError.message);
        db = null; // Ensure db is null if getting instance fails
        // Optionally store this specific error, although the action handler checks for null db
    }
} else {
     if (adminInitializationError) {
         console.warn(`Skipping Firestore instance retrieval due to Admin SDK initialization error: ${adminInitializationError.message}`);
     } else if (admin.apps.length === 0) {
         console.warn('Skipping Firestore instance retrieval as Firebase Admin SDK is not initialized (admin.apps.length is 0).');
     }
     db = null;
}

console.log(`--- Firebase Admin Module End (db is ${db ? 'initialized' : 'null'}) ---`);

export { admin, db }; // Export db (which might be null) along with admin
