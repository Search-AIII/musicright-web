import Link from "next/link";
import Navbar from "./components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-40 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d4aa]/30 bg-[#00d4aa]/6 text-[#009d7f] text-xs font-semibold tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            Royalty OS for independent artists
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.04] text-[#0a0a0a] mb-6">
            Your music earns<br />
            from 9 channels.<br />
            <span className="text-[#00d4aa]">Most artists miss 6.</span>
          </h1>

          <p className="text-[#666] text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            MusicRight checks every royalty channel your song can earn from —
            then helps you close the gaps that are costing you money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/start"
              className="h-14 px-8 rounded-2xl bg-[#0a0a0a] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#222] transition-all">
              Check your song free →
            </Link>
            <Link href="/early-access"
              className="h-14 px-8 rounded-2xl border-2 border-[#00d4aa] text-[#00d4aa] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#00d4aa]/5 transition-all">
              $5 Early Access
            </Link>
          </div>

          <p className="text-[#bbb] text-sm mt-5">Free song check · No credit card required · 2 minutes</p>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-[#f0f0f0]" />
      </div>

      {/* ── FEATURE 1: text left, dark mockup right ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#00d4aa]/10 flex items-center justify-center text-2xl mb-6">🔍</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-5">
              Check every<br />royalty channel.
            </h2>
            <p className="text-[#666] text-lg leading-relaxed mb-4">
              Enter one song. MusicRight scans all 9 royalty channels — streaming, PRO, mechanicals,
              digital radio, Content ID, and copyright — and shows you exactly what's missing.
            </p>
            <p className="text-[#999] text-sm italic">
              Most artists are registered in 2 of 9 channels. That's revenue left uncollected.
            </p>
          </div>

          {/* Dark mockup card */}
          <div className="rounded-3xl bg-[#0f0f0f] p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-[#444] text-xs ml-2 font-mono">Song Check</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[#555] text-xs mb-1 font-mono">SONG TITLE</div>
                <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 text-white text-sm font-medium">Midnight Drive</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[#555] text-xs mb-1 font-mono">ARTIST</div>
                  <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 text-white text-sm">Jordan Lee</div>
                </div>
                <div>
                  <div className="text-[#555] text-xs mb-1 font-mono">RELEASE YEAR</div>
                  <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 text-white text-sm">2024</div>
                </div>
              </div>
              <div className="bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-xl px-4 py-3 flex items-center justify-between mt-2">
                <span className="text-[#00d4aa] text-sm font-semibold">Run Royalty Check</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><div className="border-t border-[#f0f0f0]" /></div>

      {/* ── FEATURE 2: dark mockup left, text right ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Dark mockup card — left */}
          <div className="rounded-3xl bg-[#0f0f0f] p-6 shadow-2xl shadow-black/20 order-2 md:order-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-[#444] text-xs ml-2 font-mono">Royalty Health Score</span>
            </div>

            <div className="text-center mb-5">
              <div className="text-6xl font-black text-white mb-1">42</div>
              <div className="text-[#888] text-xs">out of 100 · Needs Work</div>
              <div className="mt-3 h-2 rounded-full bg-[#222] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00d4aa] to-[#00b4d8]" style={{width:"42%"}} />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: "Streaming + ISRC", status: "ok", note: "Connected" },
                { label: "PRO Registration", status: "warn", note: "Not registered" },
                { label: "MLC Mechanical", status: "bad", note: "Missing" },
                { label: "SoundExchange", status: "bad", note: "Not set up" },
                { label: "YouTube Content ID", status: "warn", note: "Unclaimed" },
                { label: "Copyright Office", status: "bad", note: "No filing found" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-2.5">
                  <span className="text-white text-xs font-medium">{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#666]">{r.note}</span>
                    <div className={`w-2 h-2 rounded-full ${r.status === "ok" ? "bg-[#00d4aa]" : r.status === "warn" ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="w-11 h-11 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center text-2xl mb-6">📊</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-5">
              See the exact<br />gaps costing you.
            </h2>
            <p className="text-[#666] text-lg leading-relaxed mb-4">
              Your Royalty Health Score shows which channels are active, broken, or completely missing.
              Red means money you can't collect. Yellow means setup is incomplete.
            </p>
            <p className="text-[#999] text-sm italic">
              The average independent artist has 4 unclosed royalty gaps at the time of their first check.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><div className="border-t border-[#f0f0f0]" /></div>

      {/* ── FEATURE 3: text left, audio mockup right ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#0891b2]/10 flex items-center justify-center text-2xl mb-6">🎧</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-5">
              Listen to your<br />royalty report.
            </h2>
            <p className="text-[#666] text-lg leading-relaxed mb-4">
              Turn your royalty health report into an audio briefing. MusicRight reads your
              gap analysis aloud — so you can absorb it while you create.
            </p>
            <p className="text-[#999] text-sm italic">
              Audio Overview — one tap to hear exactly what's missing and what to do next.
            </p>
          </div>

          {/* Audio player mockup */}
          <div className="rounded-3xl bg-[#0f0f0f] p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-[#444] text-xs ml-2 font-mono">Audio Overview</span>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#0891b2] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 5l6 4-6 4V5z" fill="#fff"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Royalty Report — Midnight Drive</div>
                  <div className="text-[#666] text-xs mt-0.5">3 min 42 sec · MusicRight AI</div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-end gap-0.5 h-10 mb-3">
                {[3,5,8,6,9,12,10,7,11,8,5,9,13,10,8,6,11,9,7,12,8,5,9,6,10,8,4,7,11,9,6,8].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < 10 ? "bg-[#00d4aa]" : "bg-[#333]"}`} style={{height: `${h * 3}px`}} />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#666]">
                <span>0:58</span>
                <span>3:42</span>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 text-[#888] text-xs leading-relaxed italic">
              "…your PRO registration is missing, which means performance royalties from
              streaming and radio plays are not being collected. Here's how to fix it in under 10 minutes…"
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 px-6 bg-[#fafafa] border-y border-[#f0f0f0]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center text-[#0a0a0a] mb-12">What independent artists are saying</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "I had no idea I wasn't registered with MLC. That was 3 years of mechanicals I wasn't collecting.",
                name: "Marcus T.",
                role: "R&B songwriter, Atlanta",
              },
              {
                quote: "The health score made it click. Seeing 4 red channels next to my song was the wake-up call I needed.",
                name: "Aria K.",
                role: "Indie pop artist, Los Angeles",
              },
              {
                quote: "The audio report is a game changer. I play it in the car and actually understand what I need to fix.",
                name: "DJ Calen",
                role: "Producer & beatmaker, Chicago",
              },
            ].map(q => (
              <div key={q.name} className="bg-white rounded-2xl border border-[#ebebeb] p-6 hover:border-[#00d4aa]/30 hover:shadow-sm transition-all">
                <p className="text-[#444] text-sm leading-relaxed mb-5">&ldquo;{q.quote}&rdquo;</p>
                <div>
                  <div className="text-[#0a0a0a] font-semibold text-sm">{q.name}</div>
                  <div className="text-[#999] text-xs mt-0.5">{q.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tight text-[#0a0a0a] mb-3">Simple pricing</h2>
            <p className="text-[#888] text-lg">Start free. Pay only when we do the work.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Song Check",
                price: "Free",
                desc: "See every royalty channel that's missing or broken for your song.",
                features: ["Royalty Health Score", "9-channel gap report", "Setup checklist"],
                cta: "Start free check",
                href: "/start",
                highlight: false,
              },
              {
                name: "Early Access",
                price: "$5",
                desc: "Reserve your spot. Applied to your first song setup when we open.",
                features: ["Locks your early-user rate", "Applied to first setup", "Creator Wallet status"],
                cta: "Place $5 →",
                href: "/early-access",
                highlight: true,
              },
              {
                name: "Full Setup",
                price: "$49",
                desc: "We handle PRO, MLC, SoundExchange, ISRC, splits, and copyright.",
                features: ["All 9 channels handled", "PRO + MLC + SoundExchange", "72-hour turnaround"],
                cta: "Learn more",
                href: "/early-access",
                highlight: false,
              },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-7 border flex flex-col ${
                p.highlight
                  ? "border-[#00d4aa] shadow-lg shadow-[#00d4aa]/10 bg-white"
                  : "border-[#e8e8e8] bg-white hover:border-[#d0d0d0]"
              } transition-all`}>
                {p.highlight && (
                  <div className="text-[#00b894] text-[10px] font-bold uppercase tracking-wider mb-3">Most Popular</div>
                )}
                <div className="text-[#999] text-xs font-semibold uppercase tracking-wider mb-2">{p.name}</div>
                <div className="text-4xl font-black text-[#0a0a0a] mb-3">{p.price}</div>
                <p className="text-[#888] text-sm leading-relaxed mb-5">{p.desc}</p>
                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#555]">
                      <span className="text-[#00d4aa] font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={`h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  p.highlight
                    ? "bg-[#00d4aa] text-white hover:bg-[#00b894]"
                    : "border border-[#e0e0e0] text-[#0a0a0a] hover:border-[#0a0a0a]"
                }`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE TOOLS ── */}
      <section className="py-6 px-6 border-t border-[#f0f0f0]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#e8e8e8] bg-[#fafafa] px-8 py-6">
          <div>
            <div className="text-[#00b894] text-xs font-bold uppercase tracking-wider mb-1">Free forever</div>
            <p className="text-[#0a0a0a] font-bold text-base">Split sheets, release checklists, artist invoices — no account needed.</p>
          </div>
          <Link href="/tools"
            className="flex-shrink-0 h-10 px-6 rounded-xl border border-[#00d4aa] text-[#00b894] font-semibold text-sm flex items-center hover:bg-[#00d4aa]/5 transition-colors whitespace-nowrap">
            Browse free tools →
          </Link>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-28 px-6 border-t border-[#f0f0f0]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5 text-[#0a0a0a]">
            Start with one song.<br />
            <span className="text-[#00d4aa]">We handle the rest.</span>
          </h2>
          <p className="text-[#888] text-lg mb-10 leading-relaxed">
            Free to check. $5 to reserve your spot. Full setup when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/start"
              className="h-14 px-8 rounded-2xl bg-[#0a0a0a] text-white font-bold text-base flex items-center justify-center hover:bg-[#222] transition-all">
              Check your song free →
            </Link>
            <Link href="/early-access"
              className="h-14 px-8 rounded-2xl border-2 border-[#00d4aa] text-[#00d4aa] font-bold text-base flex items-center justify-center hover:bg-[#00d4aa]/5 transition-all">
              $5 Early Access
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#f0f0f0] px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 2v7.5C10 10.9 8.8 12 7.2 12c-1.7 0-2.9-1-2.9-2.3C4.3 8.4 5.5 7.5 7.2 7.5c.6 0 1.1.1 1.8.4V2H10z" fill="#fff"/>
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-[#0a0a0a]">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#999]">
            <Link href="/tools" className="hover:text-[#0a0a0a] transition-colors">Free Tools</Link>
            <Link href="/early-access" className="hover:text-[#0a0a0a] transition-colors">Early Access</Link>
            <a href="mailto:contact@musicright.ai" className="hover:text-[#0a0a0a] transition-colors">Contact</a>
            <Link href="/legal/terms" className="hover:text-[#0a0a0a] transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-[#0a0a0a] transition-colors">Privacy</Link>
          </div>
          <span className="text-[#ccc] text-xs">© 2026 MusicRight.AI</span>
        </div>
      </footer>
    </div>
  );
}
