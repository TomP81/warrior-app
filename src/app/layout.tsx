import type { Metadata } from "next";
import { Geist, Geist_Mono, Knewave } from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";

const knewave = Knewave({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-knewave",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warrior",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${knewave.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <MusicPlayer />
        {children}
      </body>
    </html>
  );
}