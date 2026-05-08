import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Start Your Song Check — MusicRight.AI" };

export default function StartPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
        <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white mb-3">
            Check one song.<br />
            <span className="text-[#00d4aa]">See what you&apos;re missing.</span>
          </h1>
          <p className="text-[#555] text-sm leading-relaxed">
            Free — takes about 2 minutes. We&apos;ll show you every royalty channel
            that&apos;s missing or broken for your song.
          </p>
        </div>

        {/* Single CTA into song intake */}
        <Link href="/start/first-time"
          className="flex items-center justify-between w-full rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 hover:border-[#00d4aa]/30 transition-all group mb-3">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center text-xl">🎵</div>
            <div className="text-left">
              <div className="text-white font-bold text-base group-hover:text-[#00d4aa] transition-colors">Run a free song check</div>
              <p className="text-[#555] text-sm">Enter your song. Get your Royalty Health Score.</p>
            </div>
          </div>
          <span className="text-[#00d4aa] text-xl ml-3">→</span>
        </Link>

        <Link href="/early-access"
          className="flex items-center justify-between w-full rounded-2xl border border-[#a78bfa]/20 bg-[#a78bfa]/5 p-6 hover:border-[#a78bfa]/40 transition-all group mb-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-xl">💜</div>
            <div className="text-left">
              <div className="text-white font-bold text-base group-hover:text-[#a78bfa] transition-colors">Place $5 Early Access</div>
              <p className="text-[#555] text-sm">Reserve your spot. We handle the setup for you.</p>
            </div>
          </div>
          <span className="text-[#a78bfa] text-xl ml-3">→</span>
        </Link>

        <p className="text-center text-[#555] text-xs">
          Free song check · No credit card · 2 minutes
        </p>
      </div>
    </div>
  );
}
