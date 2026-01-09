import "./globals.css";

import Link from "next/link";

import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md"
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
  title: "cook4me: AI Recipe Generator",
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

        <div className="bg-black text-white text-sm">
          <div className="max-w-6xl mx-auto py-10">
            {/* Top sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              
              {/* Brand */}
              <div>
                <h3 className="text-base font-semibold mb-2">cook4me</h3>
                <p className="text-gray-400">
                  Made with ❤️
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <a
                  href="mailto:support@cook4me.app"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <MdEmail size={16} />
                  hello@cook4me.xyz
                </a>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-semibold mb-2">Social</h4>
                <a
                  href="https://x.com/cookformeapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <FaXTwitter size={16} />
                  Follow on X
                </a>
              </div>

            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-8" />

            {/* Bottom bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
              <p>&copy; 2024 cook4me. All rights reserved.</p>

              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
                <span className="text-white/20">•</span>
                <Link
                  href="/terms"
                  className="hover:text-white transition"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
