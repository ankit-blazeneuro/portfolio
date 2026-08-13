import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ankit's Portfolio (Beta)",
  description: "Personal Portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${spaceMono.variable} h-full antialiased dark overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans overflow-x-hidden max-w-full w-full">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

