import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusicRight.AI — Find Your Missing Royalties",
  description:
    "The royalty operations platform for independent artists. Audit your rights, close revenue gaps, and collect every dollar you've earned.",
  keywords: "music royalties, ASCAP, BMI, MLC, SoundExchange, DMCA, music rights, royalty audit",
  openGraph: {
    title: "MusicRight.AI — Find Your Missing Royalties",
    description: "Audit your rights, close revenue gaps, collect every dollar you've earned.",
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
