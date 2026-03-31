import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JasnaSprawa.pl",
  description: "Transparentny monitoring polskiego parlamentu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <StoreProvider>
          <div className="mesh-background" />
          <Navbar />
          <main className="pt-20 px-6">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
