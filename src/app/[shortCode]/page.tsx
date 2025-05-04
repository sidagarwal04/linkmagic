// src/app/[shortCode]/page.tsx
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Loader2, AlertTriangle } from 'lucide-react'; // Import AlertTriangle
import { db } from '@/lib/firebase/admin'; // Import Firestore admin instance

// Define metadata generation function for dynamic routes
export async function generateMetadata({ params }: { params: { shortCode: string } }): Promise<Metadata> {
  const shortCode = params.shortCode;
  // You could fetch metadata here if needed, e.g., original URL title
  return {
    title: `Redirecting... | LinkMagic`, // Keep title generic
    description: `Redirecting from the shortened link ${shortCode}.`,
    // Prevent indexing of redirect pages
    robots: { index: false, follow: false },
  };
}

// This is an async Server Component
export default async function ShortCodePage({ params }: { params: { shortCode: string } }) {
  const shortCode = params.shortCode;

  console.log(`Server: Attempting to redirect for short code: ${shortCode}`);

  // Check 1: Is Firestore DB available?
  if (!db) {
    console.error(`Server: Firestore Admin DB instance is not available on redirect page for code: ${shortCode}. Check server configuration (environment variables).`);
    // Handle error gracefully - show an error message instead of just loading
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive-foreground">Server Configuration Error</p>
          <p className="text-sm text-center text-muted-foreground mt-2">Could not connect to the link database. Please try again later or contact support.</p>
           <p className="text-xs text-center mt-4 text-muted-foreground">Code: {shortCode}</p>
        </div>
      );
  }


  let originalUrl: string | null = null;

  try {
    console.log(`Server: Accessing Firestore collection 'shortenedUrls' for doc: ${shortCode}`);
    const docRef = db.collection('shortenedUrls').doc(shortCode);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      originalUrl = data?.originalUrl; // Access 'originalUrl' field
      if (originalUrl) {
          console.log(`Server: Found mapping for ${shortCode} -> ${originalUrl}`);
      } else {
          console.warn(`Server: Document found for ${shortCode}, but 'originalUrl' field is missing or empty.`);
      }
    } else {
      console.log(`Server: No document found in Firestore for short code: ${shortCode}. Redirecting to homepage.`);
       // Redirect to homepage immediately if not found
      redirect('/');
      // Note: The code below this redirect won't execute.
    }
  } catch (error) {
    console.error(`Server: Error fetching document for ${shortCode} from Firestore:`, error);
    // Show a specific error page for database fetch issues
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive-foreground">Error Looking Up Link</p>
          <p className="text-sm text-center text-muted-foreground mt-2">An error occurred while trying to retrieve the original URL. Please try again.</p>
           <p className="text-xs text-center mt-4 text-muted-foreground">Code: {shortCode}</p>
        </div>
      );
  }


  // Check 2: Is the retrieved URL valid?
  if (originalUrl && (originalUrl.startsWith('http://') || originalUrl.startsWith('https://'))) {
    // Perform server-side redirect using Next.js redirect function
    console.log(`Server: Valid URL found. Redirecting ${shortCode} to ${originalUrl}`);
    redirect(originalUrl);
    // Note: The code below this redirect won't execute.
  } else {
     // This case handles:
     // 1. originalUrl was null/undefined from Firestore (field missing).
     // 2. originalUrl was not a valid http/https URL.
     if (originalUrl) {
         console.warn(`Server: Invalid original URL format found for ${shortCode}: ${originalUrl}. Redirecting to homepage.`);
     } else {
        // This case should ideally not be reached if the check after Firestore fetch is correct,
        // but kept as a fallback.
        console.log(`Server: No valid mapping found or URL field missing for code: ${shortCode}. Redirecting to homepage.`);
     }
    // Redirect to the homepage if no valid URL was found or format is wrong
    redirect('/');
     // Note: The code below this redirect won't execute.
  }

  // --- Fallback UI (Only shown briefly if redirect is slow, should ideally not be seen) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Processing Redirect...</p>
      {shortCode && (
        <p className="text-sm text-muted-foreground mt-2">Code: {shortCode}</p>
      )}
    </div>
  );
}
