import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Free Music Business Tools — Split Sheets, Invoices, Release Checklists",
  description: "Free tools for independent music creators: split sheet generator, release checklist, artist invoice, song copyright guide, producer contract templates, and more.",
};

const TOOLS = [
  {
    slug: "release-checklist",
    icon: "📋",
    title: "Release Checklist",
    desc: "Set your release date and get a personalized, back-calculated timeline. Every deadline — distributor, PRO, editorial pitch, PR, pre-save — auto-calculated.",
    tags: ["Free", "Interactive", "Saves to dashboard"],
    live: true,
    keyword: "music release checklist",
  },
  {
    slug: "split-sheet",
    icon: "✍️",
    title: "Split Sheet Generator",
    desc: "Document songwriter splits before you leave the session. Add collaborators, assign percentages, download as PDF. Links directly to PRO and MLC registration.",
    tags: ["Free", "PDF export", "PRO-ready"],
    live: true,
    keyword: "split sheet music",
  },
  {
    slug: "artist-invoice",
    icon: "🧾",
    title: "Artist Invoice",
    desc: "Music-native invoicing: session fees, beat licenses, sync fees, gig payments, producer points. Not a generic template — built for how music deals actually work.",
    tags: ["Free", "PDF export", "Music-native"],
    live: true,
    keyword: "artist invoice template",
  },
  {
    slug: "song-copyright",
    icon: "©️",
    title: "Song Copyright Guide",
    desc: "Honest guide to protecting your music. Understand what automatic copyright covers, when to file with the U.S. Copyright Office, and how to do it step by step.",
    tags: ["Free guide", "USCO walkthrough"],
    live: true,
    keyword: "how to copyright a song",
  },
  {
    slug: "producer-contract",
    icon: "📄",
    title: "Producer Contract Builder",
    desc: "Music-native contract templates: beat leases, exclusive purchase, co-production, work-for-hire. Includes producer points, credit language, and sync carve-outs.",
    tags: ["Coming soon"],
    live: false,
    keyword: "music producer contract",
  },
  {
    slug: "song-metadata",
    icon: "🔍",
    title: "Song Metadata Checker",
    desc: "Scan your releases for metadata errors — wrong credits, missing ISRCs, duplicate artist pages. Bad metadata = lost royalties. Find and fix issues fast.",
    tags: ["Coming soon"],
    live: false,
    keyword: "song metadata",
  },
  {
    slug: "studio-booking",
    icon: "🎙️",
    title: "Studio Session Tracker",
    desc: "Log your studio sessions, track costs against project budget, and keep session dates in your release timeline. Never lose track of what you recorded and when.",
    tags: ["Coming soon"],
    live: false,
    keyword: "studio booking",
  },
  {
    slug: "music-royalty",
    icon: "💰",
    title: "Royalty Health Check",
    desc: "Submit one song and see your Royalty Health Score: what channels are active, what's missing, what's blocking collection — across all 9 royalty streams.",
    tags: ["Free", "Full diagnosis"],
    live: true,
    href: "/start",
    keyword: "music royalty",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
            FREE MUSIC BUSINESS TOOLS
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Everything you need<br />
            <span className="gradient-text">to run your music business.</span>
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Free tools built for independent artists — not generic freelance templates.
            Split sheets, invoices, release timelines, and royalty checks that actually understand music.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const href = tool.href ?? (tool.live ? `/tools/${tool.slug}` : undefined);
            const Card = (
              <div className={`rounded-2xl border p-6 flex flex-col gap-4 h-full transition-all group ${
                tool.live
                  ? "border-[#1a1a1a] bg-[#0e0e0e] hover:border-[#00d4aa]/20 cursor-pointer"
                  : "border-[#111] bg-[#0a0a0a] opacity-60 cursor-default"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-2xl group-hover:bg-[#00d4aa]/10 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {tool.tags.map(t => (
                      <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t === "Free" ? "border-[#00d4aa]/30 text-[#00d4aa] bg-[#00d4aa]/5"
                        : t === "Coming soon" ? "border-[#2e2e2e] text-[#555]"
                        : "border-[#2e2e2e] text-[#555]"
                      }`}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-black text-lg mb-2 group-hover:text-[#00d4aa] transition-colors">{tool.title}</h2>
                  <p className="text-[#555] text-sm leading-relaxed">{tool.desc}</p>
                </div>
                {tool.live && (
                  <div className="text-[#00d4aa] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Open tool →
                  </div>
                )}
              </div>
            );
            return href ? (
              <Link key={tool.slug} href={href}>{Card}</Link>
            ) : (
              <div key={tool.slug}>{Card}</div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8 text-center">
          <h2 className="text-2xl font-black mb-3">Already have accounts? Check your royalty gaps.</h2>
          <p className="text-[#a0a0a0] text-base mb-6 max-w-xl mx-auto">
            Run a free Song Check to see your Royalty Health Score across all 9 earning channels — PRO, MLC, SoundExchange, distributor, YouTube, and more.
          </p>
          <Link href="/start" className="inline-flex h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-base items-center hover:bg-[#00b894] transition-colors glow">
            Run Free Royalty Check →
          </Link>
        </div>
      </div>
    </div>
  );
}
