
"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, QrCodeIcon, Download, Link2 } from "lucide-react"; // Added Link2 Icon
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Use Input instead of Textarea
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateQrCode, type QrCodeData } from "@/services/qr-code";
import { Label } from "@/components/ui/label";


// Update schema to only accept valid URLs
const formSchema = z.object({
  data: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

interface QrCodeResult {
  qrCodeUrl: string;
  data: string; // Store the original URL used
}

export function QrCodeGeneratorForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<QrCodeResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setResult(null); // Clear previous results

    startTransition(async () => {
      try {
        const qrCodeData: QrCodeData = { data: values.data };
        const qrCodeResult = await generateQrCode(qrCodeData);

        setResult({
          qrCodeUrl: qrCodeResult.imageUrl,
          data: values.data,
        });

        toast({
          title: "Success!",
          description: "Your QR code has been generated.",
        });

      } catch (error) {
        console.error("Error generating QR code:", error);
        let errorMessage = "Failed to generate QR code. Please try again.";
         if (error instanceof Error && error.message.includes("exceeds maximum length")) { // Keep size validation if needed
           errorMessage = error.message;
         } else if (error instanceof Error && error.message.includes("QR code size")) {
             errorMessage = error.message; // Keep size validation error
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

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">Generate QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL to Encode</FormLabel> {/* Updated Label */}
                  <FormControl>
                     <div className="relative"> {/* Added relative container for icon */}
                       <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> {/* Added Link Icon */}
                       <Input // Changed to Input component
                         placeholder="Enter the URL you want to encode..."
                         {...field}
                         className="pl-10" // Add padding for icon
                         aria-label="URL Input for QR Code"
                       />
                     </div>
                  </FormControl>
                   <FormMessage />
                   {/* Removed character counter as it's less relevant for URLs */}
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="Generate QR Code Button"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <QrCodeIcon className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Generating..." : "Generate QR Code"}
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
              <CardTitle className="text-center text-xl text-primary">Your QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label className="text-sm font-medium">Encoded URL</Label> {/* Updated Label */}
                  <p className="text-muted-foreground text-sm rounded-md border bg-background p-3 break-all">
                     {result.data}
                  </p>
                </div>

               <div className="flex flex-col items-center space-y-2 pt-4">
                  <Label className="text-sm font-medium">Generated QR Code</Label>
                  <div className="rounded-lg border p-2 bg-background shadow-sm">
                     <Image
                        src={result.qrCodeUrl}
                        alt="Generated QR Code"
                        width={150}
                        height={150}
                        data-ai-hint="qr code generated"
                        aria-label="Generated QR Code Image"
                      />
                   </div>
                 <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="mt-2"
                    aria-label="Download QR Code Button"
                  >
                    <a href={result.qrCodeUrl} download={`qrcode-${Date.now()}.png`}>
                       <Download className="mr-2 h-4 w-4" />
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
