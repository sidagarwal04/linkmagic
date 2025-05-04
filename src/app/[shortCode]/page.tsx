// src/app/[shortCode]/page.tsx
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase/admin'; // Import Firestore admin instance

// Define metadata generation function for dynamic routes
export async function generateMetadata({ params }: { params: { shortCode: string } }): Promise<Metadata> {
  const shortCode = params.shortCode;
  // You could fetch metadata here if needed, e.g., original URL title
  return {
    title: `Redirecting from ${shortCode}... | LinkMagic`,
    description: `Redirecting from the shortened link ${shortCode}.`,
    // Prevent indexing of redirect pages
    robots: { index: false, follow: false },
  };
}

// This is an async Server Component
export default async function ShortCodePage({ params }: { params: { shortCode: string } }) {
  const shortCode = params.shortCode;

  console.log(`Server: Attempting to redirect for short code: ${shortCode}`);

  if (!db) {
    console.error("Firestore Admin DB instance is not available on redirect page.");
    // Handle error gracefully - maybe redirect to an error page or homepage
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <Loader2 className="h-12 w-12 animate-spin text-destructive mb-4" />
          <p className="text-lg text-destructive-foreground">Server Configuration Error</p>
          <p className="text-sm text-muted-foreground mt-2">Could not connect to the database.</p>
           <p className="text-xs text-center mt-4 text-muted-foreground">Code: {shortCode}</p>
        </div>
      );
  }


  let originalUrl: string | null = null;

  try {
    const docRef = db.collection('shortenedUrls').doc(shortCode);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      originalUrl = docSnap.data()?.originalUrl; // Access 'originalUrl' field
      console.log(`Server: Found original URL for ${shortCode}: ${originalUrl}`);
    } else {
      console.log(`Server: No document found for short code: ${shortCode}.`);
    }
  } catch (error) {
    console.error(`Server: Error fetching document for ${shortCode} from Firestore:`, error);
    // Don't redirect yet, show error or fallback UI
    // You might want a more specific error page here
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <Loader2 className="h-12 w-12 animate-spin text-destructive mb-4" />
          <p className="text-lg text-destructive-foreground">Error Looking Up Link</p>
          <p className="text-sm text-muted-foreground mt-2">An error occurred while trying to find the original URL.</p>
           <p className="text-xs text-center mt-4 text-muted-foreground">Code: {shortCode}</p>
        </div>
      );
  }


  if (originalUrl && (originalUrl.startsWith('http://') || originalUrl.startsWith('https://'))) {
    // Perform server-side redirect using Next.js redirect function
    redirect(originalUrl);
  } else {
     if (originalUrl) {
         console.warn(`Server: Invalid original URL found for ${shortCode}: ${originalUrl}. Redirecting to homepage.`);
     } else {
        console.log(`Server: No valid mapping found for short code: ${shortCode}. Redirecting to homepage.`);
     }
    // If no mapping is found or URL is invalid, redirect to the homepage.
    redirect('/');
  }

  // --- Fallback UI (should not be reached if redirect works) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Processing Redirect...</p>
      {shortCode && (
        <p className="text-sm text-muted-foreground mt-2">Looking for code: {shortCode}</p>
      )}
    </div>
  );
}
