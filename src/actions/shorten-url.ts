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
      // Throw a more specific error if DB is the issue
      throw new Error("Database connection error. Please contact support.");
  }

  // Check 2: Basic validation (Client-side Zod should catch this first)
  if (!input.originalUrl || !input.originalUrl.startsWith('http')) {
    console.warn("Invalid URL passed to server action:", input.originalUrl);
    throw new Error("Invalid URL provided.");
  }

  let shortCode = '';
  let attempts = 0;
  let success = false;

  // Generate a unique short code and attempt to save it
  while (attempts < MAX_RETRIES && !success) {
    attempts++;
    shortCode = Math.random().toString(36).substring(2, 8);
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
         throw new Error("Error communicating with the database. Please try again later.");
      }
      // If not the last attempt, the loop will continue and try again
    }
  }

  // Check 5: Did the loop succeed?
  if (!success) {
    // This path is reached if MAX_RETRIES is hit due to collisions OR if the last attempt failed in the catch block above but didn't throw immediately
    console.error(`Failed to generate a unique short code or save to Firestore after ${MAX_RETRIES} attempts.`);
    // Keep the original generic error message here as it covers multiple failure modes within the loop
    throw new Error("Failed to generate a unique short link. Please try again.");
  }

  // Construct the short URL using an environment variable or fallback
  // Use NEXT_PUBLIC_BASE_URL if available, otherwise rely on HOST header or fallback
  // Note: process.env access might be limited in edge functions. Consider passing base URL if needed.
  const host = process.env.HOST || 'localhost:9002'; // process.env.HOST might not be reliable everywhere
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const defaultBaseUrl = `${protocol}://${host}`; // Fallback might not be accurate behind proxies
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || defaultBaseUrl; // Prioritize explicit env var

  const shortUrl = `${baseUrl}/${shortCode}`;

  console.log("Server Action: generated and saved short URL:", shortUrl);

  return {
    shortUrl: shortUrl,
  };
}
