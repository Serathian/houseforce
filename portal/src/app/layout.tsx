import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ViewTransitions } from 'next-view-transitions';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HouseForce Portal",
  description: "Customer portal for HouseForce properties.",
};

import SupportCTA from "@/components/SupportCTA";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
          {children}
          <SupportCTA />
        </body>
      </html>
    </ViewTransitions>
  );
}
