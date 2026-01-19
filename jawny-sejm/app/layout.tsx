import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";

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
    <html lang="pl" data-theme="dark">
      <body className={inter.variable}>
        <div className="mesh-background" />
        <Navbar />
        <main className="pt-20 px-6 h-screen overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
