import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CRIFS Admin — Investment Platform",
    template: "%s | CRIFS Admin",
  },
  description:
    "Administrative dashboard for the CRIFS Investment Platform — manage companies, investors, funding requests, and governance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          <TooltipProvider delay={200}>
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
