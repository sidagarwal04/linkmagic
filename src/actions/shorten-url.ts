"use server";

import { db } from '@/lib/firebase/admin'; // Import Firestore instance
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue for timestamp

interface ShortenUrlInput {
  originalUrl: string;
}

interface ShortenUrlOutput {
  shortUrl: string;
}

const MAX_RETRIES = 5; // Maximum attempts to generate a unique short code
const SHORT_CODE_LENGTH = 6; // Define length for the short code

/**
 * Server action to shorten a URL and store the mapping in Firestore.
 *
 * @param input - The original URL.
 * @returns A promise resolving to the shortened URL information.
 * @throws {Error} If a unique short code cannot be generated or Firestore operation fails.
 */
export async function generateShortUrl(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
  console.log("Server Action: generateShortUrl called with:", input);

  // Check 1: Is Firestore Admin DB initialized?
  if (!db) {
      console.error("Firestore Admin DB instance is not available. Initialization might have failed.");
      // Provide a more informative error for configuration issues
      throw new Error("Server configuration error: Unable to connect to the database. Ensure Firebase Admin credentials (FIREBASE_SERVICE_ACCOUNT environment variable) are correctly configured for the server environment.");
  }

  // Check 2: Basic validation (Client-side Zod should catch this first)
  if (!input.originalUrl || (!input.originalUrl.startsWith('http://') && !input.originalUrl.startsWith('https://'))) {
    console.warn("Invalid URL passed to server action:", input.originalUrl);
    throw new Error("Invalid URL provided. Please enter a URL starting with http:// or https://.");
  }

  let shortCode = '';
  let attempts = 0;
  let success = false;

  // Generate a unique short code and attempt to save it
  while (attempts < MAX_RETRIES && !success) {
    attempts++;
    shortCode = Math.random().toString(36).substring(2, 2 + SHORT_CODE_LENGTH); // Use defined length
    console.log(`Attempt ${attempts}: Generated short code: ${shortCode}`);

    const docRef = db.collection('shortenedUrls').doc(shortCode);

    try {
      // Check 3: Firestore interaction
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        // Document doesn't exist, save the mapping
        await docRef.set({
          originalUrl: input.originalUrl,
          shortCode: shortCode,
          createdAt: FieldValue.serverTimestamp(), // Add a timestamp
        });
        console.log(`Firestore: Successfully saved mapping for ${shortCode} -> ${input.originalUrl}`);
        success = true; // Exit the loop
      } else {
          // Document exists, log collision and retry (loop continues)
          console.warn(`Firestore: Short code collision detected for ${shortCode}. Retrying...`);
      }
    } catch (error) {
      // Check 4: Firestore errors during get() or set()
      console.error(`Firestore: Error during interaction for ${shortCode}:`, error);
      // Allow retry loop to continue unless it's the last attempt
      if (attempts === MAX_RETRIES) {
         // If it fails on the last attempt, throw a specific Firestore error
         throw new Error("Error communicating with the database after multiple attempts. Please try again later.");
      }
      // If not the last attempt, the loop will continue and try again
    }
  }

  // Check 5: Did the loop succeed?
  if (!success) {
    // This path is reached if MAX_RETRIES is hit due to collisions OR if the last attempt failed in the catch block above but didn't throw immediately
    console.error(`Failed to generate a unique short code or save to Firestore after ${MAX_RETRIES} attempts.`);
    // Keep the original generic error message here as it covers multiple failure modes within the loop
    throw new Error("Failed to generate a unique short link due to high traffic or database issues. Please try again.");
  }

  // Construct the short URL using NEXT_PUBLIC_BASE_URL or fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL environment variable is not set. Cannot construct full short URL.");
    throw new Error("Server configuration error: Base URL is not defined.");
  }

  // Ensure baseUrl doesn't have a trailing slash before appending the code
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const shortUrl = `${cleanBaseUrl}/${shortCode}`;

  console.log("Server Action: generated and saved short URL:", shortUrl);

  return {
    shortUrl: shortUrl,
  };
}
