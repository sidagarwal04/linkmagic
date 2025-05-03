// src/components/header.tsx
'use client'; // Make this a client component

import { LinkIcon } from "lucide-react";
import { AuthButton } from "./auth-button"; // Import AuthButton

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold">LinkMagic</h1>
        </div>
        <div>
          <AuthButton /> {/* Add the AuthButton component here */}
        </div>
      </div>
    </header>
  );
}
