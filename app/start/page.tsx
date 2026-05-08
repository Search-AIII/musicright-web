import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Start Your Song Check — MusicRight.AI" };

export default function StartPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M10 2v7.5C10 10.9 8.8 12 7.2 12c-1.7 0-2.9-1-2.9-2.3C4.3 8.4 5.5 7.5 7.2 7.5c.6 0 1.1.1 1.8.4V2H10z" fill="#fff"/>
            </svg>
          </div>
        <span className="font-bold text-sm text-[#0a0a0a]">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a] mb-3">
            Check one song.<br />
            <span className="gradient-text">See what you&apos;re missing.</span>
          </h1>
          <p className="text-[#888] text-sm leading-relaxed">
            Free — takes about 2 minutes. We&apos;ll show you every royalty channel
            that&apos;s missing or broken for your song.
          </p>
        </div>

        <Link href="/start/first-time"
          className="flex items-center justify-between w-full rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-6 hover:border-[#00d4aa]/50 hover:shadow-sm transition-all group mb-3">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center text-xl">🎵</div>
            <div className="text-left">
              <div className="text-[#0a0a0a] font-bold text-base group-hover:text-[#00b894] transition-colors">Run a free song check</div>
              <p className="text-[#888] text-sm">Enter your song. Get your Royalty Health Score.</p>
            </div>
          </div>
          <span className="text-[#00d4aa] text-xl ml-3">→</span>
        </Link>

        <Link href="/early-access"
          className="flex items-center justify-between w-full rounded-2xl border border-[#ede9fe] bg-[#faf5ff] p-6 hover:border-[#7c3aed]/30 hover:shadow-sm transition-all group mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center text-xl">💜</div>
            <div className="text-left">
              <div className="text-[#0a0a0a] font-bold text-base group-hover:text-[#7c3aed] transition-colors">Place $5 Early Access</div>
              <p className="text-[#888] text-sm">Reserve your spot. We handle the setup for you.</p>
            </div>
          </div>
          <span className="text-[#7c3aed] text-xl ml-3">→</span>
        </Link>

        <p className="text-center text-[#bbb] text-xs">
          Free song check · No credit card · 2 minutes
        </p>
      </div>
    </div>
  );
}
