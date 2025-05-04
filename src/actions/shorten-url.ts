
"use server";

interface ShortenUrlInput {
  originalUrl: string;
  // Removed customAlias field
}

interface ShortenUrlOutput {
  shortUrl: string;
}

/**
 * Placeholder server action to shorten a URL.
 * In a real application, this would interact with a database
 * to store the mapping between the original URL and the generated
 * short code, ensuring the short code is unique.
 * **Currently, storage is NOT implemented.**
 *
 * @param input - The original URL.
 * @returns A promise resolving to the shortened URL information.
 */
export async function generateShortUrl(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
  console.log("Server Action: generateShortUrl called with:", input);

  // Basic validation (more robust validation should happen)
  if (!input.originalUrl || !input.originalUrl.startsWith('http')) {
    throw new Error("Invalid URL provided.");
  }

  // Simulate generating a short code
  // **Important:** In a real app, ensure this code is unique and store the mapping.
  const shortCode = Math.random().toString(36).substring(2, 8);

  // **Important:** Replace 'linkmagic.meetsid.dev' with your actual deployed domain
  // or dynamically fetch the host if needed.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://linkmagic.meetsid.dev'; // Example: Use env variable or hardcode
  const shortUrl = `${baseUrl}/${shortCode}`;

  console.log("Server Action: generated short URL:", shortUrl);

  // Simulate database write delay (remove in real app)
  await new Promise(resolve => setTimeout(resolve, 700));

  // **Missing Step:** Store { shortCode: shortCode, originalUrl: input.originalUrl } in a database.

  return {
    shortUrl: shortUrl,
  };
}
