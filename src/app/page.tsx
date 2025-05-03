
'use client'; // Make this a client component to use context

import { Header } from "@/components/header";
import { UrlShortenerWithQrCode } from "@/components/url-shortener-with-qrcode";
import { QrCodeGeneratorForm } from "@/components/qr-code-generator-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkIcon, QrCodeIcon, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { Button } from "@/components/ui/button"; // Import Button
import { AuthButton } from "@/components/auth-button"; // Import AuthButton

export default function Home() {
  const { user, loading } = useAuth(); // Get user and loading state

  // Loading state is handled by AuthProvider wrapper, so we don't need a spinner here

  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {user ? (
          // User is logged in, show the tools
          <div className="w-full max-w-2xl space-y-8">
             <h2 className="text-3xl font-bold text-center text-primary">
               LinkMagic Tools
             </h2>
             <p className="text-center text-muted-foreground">
               Choose a tool below to get started.
             </p>

             <Tabs defaultValue="shortener" className="w-full">
               <TabsList className="grid w-full grid-cols-2">
                 <TabsTrigger value="shortener">
                   <LinkIcon className="mr-2 h-4 w-4" /> URL Shortener
                 </TabsTrigger>
                 <TabsTrigger value="qr-generator">
                   <QrCodeIcon className="mr-2 h-4 w-4" /> QR Code Generator
                 </TabsTrigger>
               </TabsList>
               <TabsContent value="shortener" className="mt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    Create short, memorable links and optionally generate a QR code for the shortened URL.
                  </p>
                  <UrlShortenerWithQrCode />
               </TabsContent>
               <TabsContent value="qr-generator" className="mt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    Generate a QR code for any URL.
                  </p>
                  <QrCodeGeneratorForm />
               </TabsContent>
             </Tabs>
          </div>
        ) : (
          // User is not logged in, show login prompt
          <div className="w-full max-w-md text-center space-y-6 mt-16">
            <h2 className="text-3xl font-bold text-primary">Welcome to LinkMagic!</h2>
            <p className="text-muted-foreground text-lg">
              Please sign in to access the URL shortener and QR code generator tools.
            </p>
             {/* You can reuse the AuthButton here or rely on the header's button */}
             <div className="pt-4">
                <AuthButton />
             </div>
            <p className="text-sm text-muted-foreground">
               Signing in with Google is quick and secure.
            </p>
          </div>
        )}
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm border-t">
         Built with ❤️ by <a href="http://meetsid.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sid</a> using Firebase Studio
      </footer>
    </>
  );
}
