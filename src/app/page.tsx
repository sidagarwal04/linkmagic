
import { Header } from "@/components/header";
import { UrlShortenerWithQrCode } from "@/components/url-shortener-with-qrcode"; // Renamed component
import { QrCodeGeneratorForm } from "@/components/qr-code-generator-form"; // New component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkIcon, QrCodeIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
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
                {/* Content for URL Shortener */}
                <p className="text-center text-muted-foreground mb-4">
                  Create short, memorable links and optionally generate a QR code for the shortened URL.
                </p>
                <UrlShortenerWithQrCode />
             </TabsContent>
             <TabsContent value="qr-generator" className="mt-6">
                {/* Content for QR Code Generator */}
                <p className="text-center text-muted-foreground mb-4">
                  Generate a QR code for any URL.
                </p>
                <QrCodeGeneratorForm />
             </TabsContent>
           </Tabs>
        </div>
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm border-t">
        Developed by <a href="http://meetsid.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sid</a>
      </footer>
    </>
  );
}
