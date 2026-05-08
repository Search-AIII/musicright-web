"use client";
import { useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    desc: "Sign in once so MusicRight can connect your song packet, $5 Early Access place and Creator Wallet status.",
    tag: "Free",
    tagColor: "#00d4aa",
  },
  {
    n: "02",
    title: "Add one song",
    desc: "Submit title, credits, lyrics, audio link, release status, identifiers and splits in a guided packet.",
    tag: "Intake",
    tagColor: "#00b4d8",
  },
  {
    n: "03",
    title: "Place $5 with MusicRight",
    desc: "Reserve Early Access, join the first-user list and unlock future Creator Wallet rewards when the full product opens.",
    tag: "$5",
    tagColor: "#a78bfa",
  },
  {
    n: "04",
    title: "Track the Creator Wallet",
    desc: "Each paid step becomes a structured rights record for status, rewards, discounts and future catalog growth.",
    tag: "Wallet",
    tagColor: "#ffb800",
  },
];

const ROUTING = [
  { icon: "©", label: "Copyright Office", desc: "Tracked as a filing task after checkout." },
  { icon: "♪", label: "PRO", desc: "Tracked as a filing task after checkout." },
  { icon: "≋", label: "MLC", desc: "Tracked as a filing task after checkout." },
  { icon: "≋", label: "SoundExchange", desc: "Tracked as a filing task after checkout." },
  { icon: "≋", label: "Distributor / ISRC", desc: "Tracked as a filing task after checkout." },
  { icon: "≋", label: "YouTube CID", desc: "Tracked as a filing task after checkout." },
];

export default function EarlyAccessPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-black/8 bg-white/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-[#888] text-sm hover:text-[#0a0a0a] transition-colors">
              Sign in
            </Link>
            <Link href="/auth/login" className="h-8 px-4 rounded-lg border border-[#d8d8d8] text-[#0a0a0a] text-xs font-semibold hover:border-[#00d4aa]/40 transition-colors">
              Create account
            </Link>
            <button onClick={handleCheckout} disabled={loading}
              className="h-8 px-4 rounded-lg bg-[#00d4aa] text-white text-xs font-bold hover:bg-[#00b894] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "…" : "Place $5 Early Access"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">

        {/* Hero — 2 col */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold mb-6">
              ✦ CREATOR WALLET GUIDE
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              Create your<br />account.<br />
              <span className="text-[#00d4aa]">Place $5.</span><br />
              <span className="text-[#666]">Start one song.</span>
            </h1>
            <p className="text-[#666] text-base leading-relaxed mb-8 max-w-md">
              MusicRight.AI turns scattered rights portals into a guided Creator Wallet workflow.
              Create an account, reserve Early Access with $5, then start a one-song packet
              so the team can route the next rights tasks clearly.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-[#ff4757]/10 border border-[#ff4757]/20 text-[#ff4757] text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/auth/login"
                className="h-12 px-6 rounded-xl border border-[#d8d8d8] bg-[#fafafa] text-[#0a0a0a] font-semibold text-sm flex items-center justify-center gap-2 hover:border-[#00d4aa]/40 transition-all">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Create account first
              </Link>
              <button onClick={handleCheckout} disabled={loading}
                className="h-12 px-8 rounded-xl bg-[#00d4aa] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00b894] transition-all glow disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Opening checkout…" : "Place $5 with MusicRight →"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/start"
                className="h-10 px-5 rounded-lg border border-[#e8e8e8] text-[#888] text-sm font-semibold flex items-center justify-center hover:text-[#0a0a0a] hover:border-[#d8d8d8] transition-colors">
                Start the guided song workflow
              </Link>
              <Link href="#how-it-works"
                className="h-10 px-5 rounded-lg border border-[#e8e8e8] text-[#888] text-sm font-semibold flex items-center justify-center hover:text-[#0a0a0a] hover:border-[#d8d8d8] transition-colors">
                See the guide flow
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "$5", label: "EARLY ACCESS\nPLACE STARTS THE\nRELATIONSHIP\nWITH MUSICRIGHT" },
                { val: "4 steps", label: "ACCOUNT, SONG\nPACKET,\nCHECKOUT AND\nROUTING" },
                { val: "1 song", label: "FOCUSED MVP\nSCOPE THAT\nMAKES THE FIRST\nACTION EASY" },
              ].map(s => (
                <div key={s.val} className="rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-4">
                  <div className="text-2xl font-black text-[#0a0a0a] mb-2">{s.val}</div>
                  <div className="text-[#888] text-[9px] font-bold uppercase tracking-[0.1em] leading-relaxed whitespace-pre-line">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Guided brief panel */}
          <div className="rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[#888] text-[10px] font-bold uppercase tracking-[0.15em]">MUSICRIGHT GUIDED BRIEF</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d8d8d8] text-[#888]">Guide</span>
            </div>

            {/* Inputs */}
            <div className="mb-6">
              <div className="text-[#888] text-[10px] font-bold uppercase tracking-[0.12em] mb-3">INPUTS</div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "📄", title: "Song facts", desc: "Title, artist, owner, lyrics, audio and release status" },
                  { icon: "🏛️", title: "Rights accounts", desc: "Copyright, PRO, MLC, SoundExchange and distributor readiness" },
                  { icon: "👛", title: "Creator Wallet", desc: "Payment status, early rewards and future rights records" },
                ].map(i => (
                  <div key={i.title} className="rounded-xl border border-[#e8e8e8] bg-[#f2f2f2] p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{i.icon}</span>
                      <div>
                        <div className="text-[#0a0a0a] text-sm font-semibold">{i.title}</div>
                        <div className="text-[#888] text-xs mt-0.5">{i.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right summary */}
            <div className="rounded-xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-4 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#00d4aa] text-sm">✦</span>
                </div>
                <div>
                  <div className="text-[#0a0a0a] font-bold text-sm">Your rights summary, simplified.</div>
                  <p className="text-[#888] text-xs mt-1 leading-relaxed">
                    Instead of asking creators to decode agencies and acronyms first,
                    the Guide explains what to do, why it matters, and where the paid workflow goes next.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-2">
              {[
                { n: "1", title: "Create an account first", desc: "Create an account first so your Creator Wallet has an owner.", tag: "Learn", color: "#00d4aa" },
                { n: "2", title: "Start with one song", desc: "Start with one song so the next step is obvious.", tag: "Learn", color: "#00b4d8" },
                { n: "3", title: "Place $5 with MusicRight", desc: "Place $5 with MusicRight to reserve Early Access and rewards.", tag: "$5", color: "#a78bfa" },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3 p-3 rounded-xl border border-[#e8e8e8] bg-[#f2f2f2]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ background: s.color + "20", color: s.color }}>
                    {s.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[#0a0a0a] text-xs font-semibold">Guide step {s.n}</div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: s.color + "20", color: s.color }}>{s.tag}</span>
                    </div>
                    <div className="text-[#888] text-xs mt-0.5 leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Early Access readiness bar */}
            <div className="mt-4 rounded-xl border border-[#e8e8e8] bg-[#f2f2f2] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[#888] text-xs">Early Access readiness</div>
                <div className="text-[#00d4aa] font-black text-sm">$5</div>
              </div>
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#a78bfa]" />
              </div>
              <p className="text-[#888] text-xs leading-relaxed">
                Create an account, place $5 with MusicRight, and your first-song workflow becomes easier to follow.
              </p>
            </div>
          </div>
        </div>

        {/* How it works — 4 steps */}
        <div id="how-it-works" className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[#00d4aa] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">STEP 1 OF THE CREATOR WALLET</div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                A simpler path from account<br />to paid rights work.
              </h2>
            </div>
            <p className="text-[#888] text-sm max-w-sm leading-relaxed">
              The MVP stays focused: create an account, place $5 for Early Access, register one song, file and track.
              The larger Creator Wallet grows from completed orders, discount codes, gifts and verified rights records.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map(s => (
              <div key={s.n} className="rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black mb-4" style={{ background: s.tagColor + "20", color: s.tagColor }}>
                  {s.n}
                </div>
                <h3 className="text-[#0a0a0a] font-bold text-base mb-2">{s.title}</h3>
                <p className="text-[#888] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rights terminal */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e8e8e8] text-[#888] text-xs font-semibold mb-5">
              🔑 MUSICRIGHT RIGHTS TERMINAL
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              From scattered registrations<br />to one operational record.
            </h2>
            <p className="text-[#666] text-base leading-relaxed">
              Music rights are split across agencies, portals and identifiers.
              The MVP gives the MusicRight team a visible backend queue so the artist
              can stop guessing where the work stands.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ROUTING.map(r => (
              <div key={r.label} className="rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-4">
                <div className="w-8 h-8 rounded-lg bg-[#00b4d8]/10 flex items-center justify-center text-[#00b4d8] text-lg mb-3">
                  {r.icon}
                </div>
                <div className="text-[#0a0a0a] font-semibold text-sm mb-1">{r.label}</div>
                <div className="text-[#888] text-xs leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-wider mb-2">YOU FOCUS ON CREATIVITY. WE MANAGE THE REST.</div>
            <h3 className="text-[#0a0a0a] font-black text-2xl mb-1">MusicRight.AI</h3>
            <p className="text-[#888] text-sm">Reserve your place in the first-user Creator Wallet list.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/auth/login"
              className="h-11 px-5 rounded-xl border border-[#d8d8d8] text-[#0a0a0a] font-semibold text-sm flex items-center hover:border-[#00d4aa]/40 transition-colors">
              Create account
            </Link>
            <button onClick={handleCheckout} disabled={loading}
              className="h-11 px-6 rounded-xl bg-[#00d4aa] text-white font-bold text-sm flex items-center gap-2 hover:bg-[#00b894] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "…" : "Place $5 Early Access →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
