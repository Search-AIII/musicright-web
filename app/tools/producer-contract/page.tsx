"use client";
import { useState } from "react";
import Link from "next/link";

const TEMPLATES = [
  { name: "Beat Lease (Non-Exclusive)", desc: "Artist can use the beat in one project. You retain ownership and can lease to others." },
  { name: "Exclusive Beat Purchase", desc: "Artist buys exclusive rights. You can no longer sell this beat to anyone else." },
  { name: "Co-Production Agreement", desc: "Split credits and royalties between two or more producers on one track." },
  { name: "Work for Hire", desc: "Client owns all rights to the finished recording. You waive your claim entirely." },
  { name: "Producer Points Deal", desc: "You receive a backend percentage of royalties in addition to a flat fee." },
];

export default function ProducerContractPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "producer-contract-tool" }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <Link href="/tools" className="text-[#555] text-sm hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-8">
          <Link href="/tools" className="text-[#555] text-sm hover:text-[#a0a0a0] mb-4 block">← All Tools</Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ffb800]/30 bg-[#ffb800]/5 text-[#ffb800] text-xs font-semibold mb-4">
            Coming Soon
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Producer Contract Builder</h1>
          <p className="text-[#a0a0a0] text-base">
            Music-native contract templates — beat leases, exclusive purchases, co-production deals,
            work-for-hire, and producer points. Built by musicians, reviewed by entertainment attorneys.
          </p>
        </div>

        {/* Template preview */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 mb-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">What&apos;s included</h2>
          <div className="flex flex-col gap-3">
            {TEMPLATES.map((t) => (
              <div key={t.name} className="flex items-start gap-3 py-3 border-b border-[#111] last:border-0">
                <div className="w-2 h-2 rounded-full bg-[#00d4aa]/40 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-[#555] text-xs mt-0.5 leading-relaxed">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email capture */}
        <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-6">
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-[#00d4aa] text-2xl mb-3">✓</div>
              <div className="text-white font-bold mb-1">You&apos;re on the list.</div>
              <div className="text-[#555] text-sm">We&apos;ll email you when Producer Contract Builder launches.</div>
            </div>
          ) : (
            <>
              <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-wider mb-2">Get early access</div>
              <h3 className="text-white font-black text-lg mb-1">Be first when this launches.</h3>
              <p className="text-[#555] text-sm mb-4">Drop your email and we&apos;ll notify you the day it goes live.</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                  className="flex-1 h-11 bg-[#0e0e0e] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 transition-colors" />
                <button type="submit"
                  className="h-11 px-5 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors whitespace-nowrap">
                  Notify Me
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href="/tools/split-sheet"
            className="h-10 px-5 rounded-lg border border-[#1a1a1a] bg-[#0e0e0e] text-[#a0a0a0] text-sm font-semibold flex items-center hover:text-white transition-colors">
            Split Sheet Generator →
          </Link>
          <Link href="/tools/artist-invoice"
            className="h-10 px-5 rounded-lg border border-[#1a1a1a] bg-[#0e0e0e] text-[#a0a0a0] text-sm font-semibold flex items-center hover:text-white transition-colors">
            Artist Invoice →
          </Link>
        </div>
      </div>
    </div>
  );
}
