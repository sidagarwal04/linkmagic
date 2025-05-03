
"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, QrCodeIcon, Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Import cn utility

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, // Import FormLabel from ui/form
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for more content
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateQrCode, type QrCodeData } from "@/services/qr-code";
import { Label } from "@/components/ui/label"; // Import Label from ui/label for direct use outside FormField


const formSchema = z.object({
  data: z.string().min(1, { message: "Please enter text or a URL." }).max(500, { message: "Input cannot exceed 500 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface QrCodeResult {
  qrCodeUrl: string;
  data: string; // Store the original data used
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
         if (error instanceof Error && error.message.includes("exceeds maximum length")) {
           errorMessage = error.message;
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
                  <FormLabel>Text or URL</FormLabel> {/* Use FormLabel from ui/form */}
                  <FormControl>
                    <Textarea
                      placeholder="Enter the text or URL you want to encode..."
                      {...field}
                      className="min-h-[100px]" // Give it a bit more height
                      aria-label="Text or URL Input for QR Code"
                    />
                  </FormControl>
                   <FormMessage />
                   <p className="text-xs text-muted-foreground text-right">
                    {form.watch('data').length} / 500 characters
                   </p>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" // Use primary color
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
                  <Label className="text-sm font-medium">Encoded Data</Label> {/* Use Label from ui/label */}
                  <p className="text-muted-foreground text-sm rounded-md border bg-background p-3 break-all"> {/* Allow long text to break */}
                     {result.data}
                  </p>
                </div>

               <div className="flex flex-col items-center space-y-2 pt-4">
                  <Label className="text-sm font-medium">Generated QR Code</Label> {/* Use Label from ui/label */}
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
                    <a href={result.qrCodeUrl} download={`qrcode-${Date.now()}.png`}> {/* Generic filename */}
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
