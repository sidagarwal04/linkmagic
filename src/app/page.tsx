import { UrlShortenerForm } from "@/components/url-shortener-form";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          <h2 className="text-3xl font-bold text-center text-primary">
            Shorten Your Links, Expand Your Reach
          </h2>
          <p className="text-center text-muted-foreground">
            Create short, memorable links and QR codes for easy sharing.
          </p>
          <UrlShortenerForm />
        </div>
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm border-t">
        Built with ❤️ by Firebase Studio
      </footer>
    </>
  );
}
