
// src/components/header.tsx
'use client'; // Keep as client component if needed for other interactivity later

import { LinkIcon } from "lucide-react";
// Removed AuthButton import

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold">LinkMagic</h1>
        </div>
        {/* Removed AuthButton */}
      </div>
    </header>
  );
}
