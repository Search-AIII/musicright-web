import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusicRight.AI — The Royalty Operating System for Music Creators",
  description:
    "Process song registrations, organize rights, activate royalty channels, and turn your music catalog into a cleaner financial asset. Free song check in 60 seconds.",
  keywords: "music royalties, royalty setup, ASCAP, BMI, MLC, SoundExchange, YouTube Content ID, music rights, royalty operating system, music IP banking",
  openGraph: {
    title: "MusicRight.AI — The Royalty Operating System for Music Creators",
    description:
      "Process song registrations, organize rights, activate royalty channels, and turn your music catalog into a cleaner financial asset.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
