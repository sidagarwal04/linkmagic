// src/app/[shortCode]/page.tsx
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

// Define metadata generation function for dynamic routes
export async function generateMetadata({ params }: { params: { shortCode: string } }): Promise<Metadata> {
  const shortCode = params.shortCode;
  // In a real app, fetch metadata based on the short code if needed
  return {
    title: `Redirecting from ${shortCode}... | LinkMagic`,
    description: `Redirecting from the shortened link ${shortCode}.`,
  };
}

// This is now an async Server Component
export default async function ShortCodePage({ params }: { params: { shortCode: string } }) {
  const shortCode = params.shortCode;

  console.log(`Server: Attempting to redirect for short code: ${shortCode}`);

  // --- Placeholder Database Lookup ---
  // In a real application, you would:
  // 1. Connect to your database (e.g., Firestore).
  // 2. Query the database for the document matching `shortCode`.
  // 3. Retrieve the `originalUrl` from the document.

  let originalUrl: string | null = null;

  // Simulate lookup (replace with actual database call)
  // Example: originalUrl = await getOriginalUrlFromDb(shortCode);

  // Since we don't have a database, the lookup will always fail.
  // We'll simulate this by keeping originalUrl as null.

  if (originalUrl) {
    console.log(`Server: Found original URL for ${shortCode}: ${originalUrl}. Redirecting...`);
    // Perform server-side redirect using Next.js redirect function
    redirect(originalUrl);
  } else {
    console.log(`Server: No mapping found for short code: ${shortCode}. Redirecting to homepage.`);
    // If no mapping is found, redirect to the homepage.
    // You could also redirect to a custom 404 or an error page.
    redirect('/');
  }

  // --- This part will likely not be reached due to redirects ---
  // It's good practice to have a fallback UI in case redirection fails unexpectedly,
  // though `redirect()` should handle it.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Redirecting...</p>
      {shortCode && (
        <p className="text-sm text-muted-foreground mt-2">Looking for code: {shortCode}</p>
      )}
       <p className="text-xs text-center mt-4 text-muted-foreground">(Note: URL redirection requires database integration, which is not yet implemented.)</p>
    </div>
  );
}
