import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import { CompareProvider } from "@/lib/contexts/CompareContext";
import { DatabaseStatusWrapper } from "@/components/DatabaseStatusWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OpenState",
  description: "Transparentny monitoring działalności publicznej.",
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <CompareProvider>
          <div className="mesh-background" />
          <Suspense fallback={<div className="h-16 bg-surface-color" />}>
            <Navbar />
          </Suspense>
          <main className="pt-20 px-6">
            <Suspense fallback={null}>
              <DatabaseStatusWrapper />
            </Suspense>
            {children}
          </main>
        </CompareProvider>
      </body>
    </html>
  );
}
