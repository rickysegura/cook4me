import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cook4Me: AI Recipe Generator",
  description: "Munch is an AI recipe generator created by Ricky Segura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>

        <footer className="bg-black py-12 px-4 text-center text-white text-sm">
          <p>Created by <a href="https://rickysegura.dev/" className="text-sky-500 hover:text-sky-300">Ricky Segura</a><br/>Los Angeles, CA</p>
        </footer>
      </body>
    </html>
  );
}
