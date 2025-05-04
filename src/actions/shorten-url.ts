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

  if (!db) {
      console.error("Firestore Admin DB instance is not available. Initialization might have failed.");
      throw new Error("Server configuration error. Unable to connect to the database.");
  }

  // Basic validation
  if (!input.originalUrl || !input.originalUrl.startsWith('http')) {
    throw new Error("Invalid URL provided. Must start with http or https.");
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
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      try {
        // Document doesn't exist, save the mapping
        await docRef.set({
          originalUrl: input.originalUrl,
          shortCode: shortCode,
          createdAt: FieldValue.serverTimestamp(), // Add a timestamp
        });
        console.log(`Firestore: Successfully saved mapping for ${shortCode} -> ${input.originalUrl}`);
        success = true; // Exit the loop
      } catch (error) {
        console.error(`Firestore: Error saving mapping for ${shortCode}:`, error);
        // Let the loop retry or eventually throw an error
      }
    } else {
        // Document exists, log collision and retry (loop continues)
        console.warn(`Firestore: Short code collision detected for ${shortCode}. Retrying...`);
    }
  }

  if (!success) {
    console.error(`Failed to generate a unique short code after ${MAX_RETRIES} attempts.`);
    throw new Error("Failed to generate a unique short link. Please try again.");
  }

  // Construct the short URL using an environment variable or fallback
  // Ensure NEXT_PUBLIC_BASE_URL is set in your Vercel/Netlify/Firebase environment variables
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'; // Fallback for local dev
  const shortUrl = `${baseUrl}/${shortCode}`;

  console.log("Server Action: generated and saved short URL:", shortUrl);

  return {
    shortUrl: shortUrl,
  };
}
