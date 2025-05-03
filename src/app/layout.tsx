import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkMagic - Simplify Your Links",
  description: "Create custom shortened URLs and generate QR codes for free with LinkMagic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
         <AuthProvider> {/* Wrap content with AuthProvider */}
           {children}
           <Toaster />
         </AuthProvider>
      </body>
    </html>
  );
}
