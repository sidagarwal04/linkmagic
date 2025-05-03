import { LinkIcon } from "lucide-react";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Consider a magic wand or sparkle icon later if desired */}
          <LinkIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold">LinkMagic</h1>
        </div>
        {/* Placeholder for potential future navigation or actions */}
        {/* <div>
          <Button variant="ghost">Login</Button>
        </div> */}
      </div>
    </header>
  );
}
