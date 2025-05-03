
"use client";

import type { ChangeEvent } from "react";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link2, Loader2, QrCodeIcon, Scissors, Copy, Check, Download } from "lucide-react";
import Image from "next/image";

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

const formSchema = z.object({
  longUrl: z.string().url({ message: "Please enter a valid URL." }),
  customAlias: z
    .string()
    .optional()
    .refine((alias) => !alias || /^[a-zA-Z0-9_-]+$/.test(alias), {
      message: "Alias can only contain letters, numbers, hyphens, and underscores.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface ShortenedUrlResult {
  shortUrl: string;
  originalUrl: string;
  qrCodeUrl: string;
}

export function UrlShortenerWithQrCode() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ShortenedUrlResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      longUrl: "",
      customAlias: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setResult(null); // Clear previous results
    setCopied(false); // Reset copied state

    startTransition(async () => {
      try {
        // 1. Generate Short URL
        const shortUrlData = await generateShortUrl({
          originalUrl: values.longUrl,
          customAlias: values.customAlias || undefined,
        });

        // 2. Generate QR Code for the *shortened* URL
        const qrCodeData: QrCodeData = { data: shortUrlData.shortUrl };
        const qrCodeResult = await generateQrCode(qrCodeData);

        // 3. Set Result State
        setResult({
          shortUrl: shortUrlData.shortUrl,
          originalUrl: values.longUrl,
          qrCodeUrl: qrCodeResult.imageUrl,
        });

        toast({
          title: "Success!",
          description: "Your shortened URL and QR code have been generated.",
        });

      } catch (error) {
        console.error("Error shortening URL:", error);
        let errorMessage = "Failed to shorten URL. Please try again.";
        if (error instanceof Error) {
          if (error.message.includes("Alias already exists")) {
             errorMessage = "That custom alias is already taken. Please try another.";
          } else if (error.message.includes("Invalid URL")) {
             errorMessage = "The URL provided seems invalid. Please check and try again.";
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setResult(null);
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

  const handleAliasChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, '-');
    form.setValue('customAlias', value, { shouldValidate: true });
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">Enter Long URL</CardTitle>
         <CardDescription className="text-center text-muted-foreground">
           Optionally provide a custom alias. Generates a QR code for the short link.
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
            <FormField
              control={form.control}
              name="customAlias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Alias (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                        linkwi.se/
                       </span>
                       <Input
                         placeholder="my-cool-link"
                         {...field}
                         onChange={handleAliasChange} // Use custom handler
                         value={field.value ?? ''} // Ensure value is controlled
                         className="pl-20" // Adjust padding for prefix
                         aria-label="Custom Alias Input"
                       />
                    </div>
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-105"
              aria-label="Shorten URL Button"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Scissors className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Shortening..." : "Shorten & Get QR Code"}
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
              <CardTitle className="text-center text-xl text-primary">Your Link & QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-sm font-medium">Shortened URL</Label>
                 <div className="flex items-center gap-2 rounded-md border bg-background p-3">
                   <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow truncate text-accent hover:underline"
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
                      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    </Button>
                 </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-sm font-medium">Original URL</Label>
                  <p className="truncate text-muted-foreground text-sm rounded-md border bg-background p-3">
                     {result.originalUrl}
                  </p>
                </div>

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
                    asChild // Use asChild to make the button a download link
                    className="mt-2"
                    aria-label="Download QR Code Button"
                  >
                    <a href={result.qrCodeUrl} download={`${result.shortUrl.split('/').pop() || 'qrcode'}.png`}>
                       <Download className="mr-2 h-4 w-4" /> {/* Changed icon */}
                       Download QR
                     </a>
                  </Button>
                </div>

            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

// Add Label component if not globally available (already defined in url-shortener-form, but good practice)
const Label = React.forwardRef<
  React.ElementRef<typeof FormLabel>,
  React.ComponentPropsWithoutRef<typeof FormLabel>
>(({ className, ...props }, ref) => {
  return (
    <FormLabel
      ref={ref}
      className={cn("block", className)} // Ensure it's block for layout
      {...props}
    />
  );
});
Label.displayName = 'Label';
