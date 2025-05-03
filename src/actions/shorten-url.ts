"use server";

interface ShortenUrlInput {
  originalUrl: string;
  customAlias?: string;
}

interface ShortenUrlOutput {
  shortUrl: string;
}

/**
 * Placeholder server action to shorten a URL.
 * In a real application, this would interact with a database
 * to store the mapping and generate a unique short code or use the custom alias.
 *
 * @param input - The original URL and optional custom alias.
 * @returns A promise resolving to the shortened URL information.
 */
export async function generateShortUrl(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
  console.log("Server Action: generateShortUrl called with:", input);

  // Basic validation (more robust validation should happen)
  if (!input.originalUrl || !input.originalUrl.startsWith('http')) {
    throw new Error("Invalid URL provided.");
  }

  // Simulate database interaction and potential alias conflict
  if (input.customAlias === "taken-alias") {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    throw new Error("Alias already exists");
  }

  // Simulate generating a short code or using the alias
  const shortCode = input.customAlias || Math.random().toString(36).substring(2, 8);
  const shortUrl = `https://linkwi.se/${shortCode}`; // Replace with your actual domain

  console.log("Server Action: generated short URL:", shortUrl);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));

  return {
    shortUrl: shortUrl,
  };
}
