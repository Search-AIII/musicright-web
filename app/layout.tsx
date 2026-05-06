import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.musicright.ai"),
  title: "MusicRight.AI — See What's Blocking Your Royalties",
  description:
    "Add one song. MusicRight shows you missing registrations, blocked royalty routes, and a step-by-step plan to get paid. Free song check in 60 seconds.",
  keywords: "music royalties, royalty setup, ASCAP, BMI, MLC, SoundExchange, YouTube Content ID, music rights, royalty health score, song registration",
  openGraph: {
    title: "MusicRight.AI — See What's Blocking Your Royalties",
    description:
      "Add one song. See missing registrations, blocked royalty routes, and what to do next. Free song check in 60 seconds.",
    type: "website",
    url: "https://www.musicright.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "MusicRight.AI — See What's Blocking Your Royalties",
    description: "Add one song. See missing registrations, blocked royalty routes, and what to do next.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
