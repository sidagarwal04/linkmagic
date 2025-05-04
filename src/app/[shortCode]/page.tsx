'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This component handles requests for shortened URLs (e.g., /abc123)
export default function ShortCodePage() {
  const router = useRouter();
  const params = useParams();
  const shortCode = params.shortCode as string; // Extract shortCode from URL

  useEffect(() => {
    if (shortCode) {
      console.log(`Attempting to redirect for short code: ${shortCode}`);
      // --- Placeholder Logic ---
      // In a real application, you would:
      // 1. Fetch the original URL associated with `shortCode` from your database.
      // 2. If found, redirect using `router.replace(originalUrl)`.
      // 3. If not found, potentially redirect to a 404 page or the homepage.

      // For now, since we don't store mappings, we'll redirect to the homepage after a short delay.
      const timer = setTimeout(() => {
        console.log('Shortened URL mapping not implemented. Redirecting to homepage.');
        router.replace('/'); // Redirect to the homepage
      }, 1500); // Simulate a short delay

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    } else {
      // If no shortCode is present for some reason, redirect home immediately
      router.replace('/');
    }
  }, [shortCode, router]);

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
