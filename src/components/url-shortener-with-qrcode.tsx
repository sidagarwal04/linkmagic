
"use client";

import type { ChangeEvent } from "react";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link2, Loader2, QrCodeIcon, Scissors, Copy, Check, Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateShortUrl } from "@/actions/shorten-url";
import { generateQrCode, type QrCodeData } from "@/services/qr-code";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Import Switch component

const formSchema = z.object({
  longUrl: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ShortenedUrlResult {
  shortUrl: string;
  originalUrl: string;
  qrCodeUrl: string | null; // Allow QR code URL to be null
}

export function UrlShortenerWithQrCode() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ShortenedUrlResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [generateQr, setGenerateQr] = useState(false); // State for the QR code toggle
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      longUrl: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setResult(null); // Clear previous results
    setCopied(false); // Reset copied state

    startTransition(async () => {
      let shortUrlData: { shortUrl: string } | null = null; // Define outside try block
      try {
        // 1. Generate Short URL
        shortUrlData = await generateShortUrl({
          originalUrl: values.longUrl,
        });

        let qrCodeImageUrl: string | null = null;

        // 2. Generate QR Code *only if* the switch is toggled on
        if (generateQr && shortUrlData) { // Check shortUrlData exists
          const qrCodeData: QrCodeData = { data: shortUrlData.shortUrl };
          const qrCodeResult = await generateQrCode(qrCodeData);
          qrCodeImageUrl = qrCodeResult.imageUrl;
           toast({
             title: "Success!",
             description: "Your shortened URL and QR code have been generated.",
           });
        } else if (shortUrlData) { // Short URL generated, but no QR
           toast({
            title: "Success!",
            description: "Your shortened URL has been generated.",
           });
        }


        // 3. Set Result State (only if short URL succeeded)
        if (shortUrlData) {
            setResult({
              shortUrl: shortUrlData.shortUrl,
              originalUrl: values.longUrl,
              qrCodeUrl: qrCodeImageUrl, // Store null if QR wasn't generated
            });
        }


      } catch (error) {
        console.error("Error processing URL:", error);
        let errorMessage = "An error occurred. Please try again.";
        if (error instanceof Error) {
           if (error.message.includes("Invalid URL")) {
             errorMessage = "The URL provided seems invalid. Please check and try again.";
           } else if (generateQr && error.message.includes("QR code")) { // Check if error happened during QR generation
              errorMessage = "Failed to generate QR code. Short URL might still be created.";
              // Set partial result if short URL succeeded but QR failed
              if (shortUrlData) {
                 setResult({ shortUrl: shortUrlData.shortUrl, originalUrl: values.longUrl, qrCodeUrl: null });
              }
           } else {
              errorMessage = "Failed to shorten URL. Please try again.";
           }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        // Ensure result is cleared if shortening failed completely
        if (!shortUrlData) {
            setResult(null);
        }
      }
    });
  }

  const handleCopy = () => {
    if (result?.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl).then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Shortened URL copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Error",
          description: "Failed to copy URL.",
          variant: "destructive",
        });
      });
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">URL Shortener</CardTitle>
         <CardDescription className="text-center text-muted-foreground">
           Enter a long URL to create a shorter version. Optionally generate a QR code.
         </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="longUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="https://example.com/very/long/url/to/shorten"
                        {...field}
                        className="pl-10"
                        aria-label="Long URL Input"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* QR Code Toggle Switch */}
             <div className="flex items-center space-x-2 pt-2">
               <Switch
                 id="generate-qr-code"
                 checked={generateQr}
                 onCheckedChange={setGenerateQr}
                 aria-label="Toggle QR code generation"
               />
               <Label htmlFor="generate-qr-code" className="cursor-pointer">Generate QR Code for Shortened URL</Label>
             </div>


            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full transition-all duration-300 ease-in-out transform hover:scale-105",
                 "bg-primary hover:bg-primary/90 text-primary-foreground" // Always use primary color
               )}
              aria-label={generateQr ? "Shorten URL and Generate QR Code Button" : "Shorten URL Button"}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : generateQr ? (
                 <QrCodeIcon className="mr-2 h-4 w-4" /> // Show QR icon when toggled
              ) : (
                <Scissors className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Processing..." : generateQr ? "Shorten & Get QR Code" : "Shorten URL"}
            </Button>
          </form>
        </Form>

        {isPending && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {result && !isPending && (
          <Card className="mt-8 bg-secondary shadow-inner">
            <CardHeader>
              <CardTitle className="text-center text-xl text-primary">
                 {result.qrCodeUrl ? "Your Link & QR Code" : "Your Link"}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Shortened URL</Label>
                 <div className="flex items-center gap-2 rounded-md border bg-background p-3">
                   <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow truncate text-primary hover:underline" // Use primary color for link
                      aria-label="Shortened URL Link"
                    >
                      {result.shortUrl}
                    </a>
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={handleCopy}
                     className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                     aria-label="Copy Shortened URL"
                    >
                      {/* Use primary color for the check icon when copied */}
                      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                 </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-sm font-medium">Original URL</Label>
                  <p className="truncate text-muted-foreground text-sm rounded-md border bg-background p-3">
                     {result.originalUrl}
                  </p>
                </div>

               {/* Conditionally render QR Code section */}
               {result.qrCodeUrl && (
                 <div className="flex flex-col items-center space-y-2 pt-4">
                    <Label className="text-sm font-medium">QR Code (for Shortened URL)</Label>
                    <div className="rounded-lg border p-2 bg-background shadow-sm">
                       <Image
                          src={result.qrCodeUrl}
                          alt="QR Code for shortened URL"
                          width={150}
                          height={150}
                          data-ai-hint="qr code short link"
                          aria-label="QR Code Image for Shortened URL"
                        />
                     </div>
                   <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground" // Use primary for download button too
                      aria-label="Download QR Code Button"
                      onClick={async (e) => {
                        e.preventDefault(); // Prevent default anchor behavior if wrapped
                        try {
                          const response = await fetch(result.qrCodeUrl!); // Add non-null assertion
                          const blob = await response.blob();
                          saveAs(blob, "linkmagic-qr.png");
                        } catch (error) {
                          console.error("Failed to download QR code:", error);
                           toast({
                             title: "Error",
                             description: "Failed to download QR code.",
                             variant: "destructive",
                           });
                        }
                      }}
                    >
                         <Download className="mr-2 h-4 w-4" />
                         Download QR
                    </Button>
                  </div>
               )}

            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
