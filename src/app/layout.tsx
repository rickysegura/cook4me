import "./globals.css";

import { FaXTwitter } from "react-icons/fa6";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";

import type { Metadata } from "next";

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

        <footer className="bg-black py-8 text-center text-white text-sm">
          <p>Made with love ❤️</p>
          <p>&copy; 2024 cook4me. All rights reserved.</p>
          <a href="https://x.com/cookformeapp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4">
            <span>Follow us on</span>
            <FaXTwitter size={18} />
          </a>
        </footer>
      </body>
    </html>
  );
}
