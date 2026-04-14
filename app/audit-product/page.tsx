import Link from "next/link";

const DELIVERABLES = [
  { icon: "📋", title: "Metadata audit report", desc: "Every field checked — title, ISRC, splits, PROs, distributor tags" },
  { icon: "💸", title: "Revenue leak breakdown", desc: "Dollar estimate of what you're missing and exactly why" },
  { icon: "✅", title: "Fix checklist", desc: "Prioritized list of exactly what to fix, in what order" },
  { icon: "🎙️", title: "30-min Loom walkthrough", desc: "I record a personal video walking through your results" },
  { icon: "📨", title: "Follow-up support", desc: "Email me for 7 days with questions — I respond same day" },
];

const MISTAKES = [
  { n: "01", title: "No ISRC code",              impact: "Blocked from Spotify, Apple Music, Tidal, Amazon" },
  { n: "02", title: "Not registered with The MLC", impact: "Missing 100% of mechanical streaming royalties" },
  { n: "03", title: "Publisher split unassigned",  impact: "50% of your publishing goes uncollected forever" },
  { n: "04", title: "SoundExchange not linked",    impact: "Zero digital radio royalties from Pandora, SiriusXM" },
  { n: "05", title: "Wrong territory metadata",    impact: "Songs blocked or miscredited in certain countries" },
];

const FAQS = [
  { q: "Who is this for?", a: "Independent artists, producers, and small labels releasing music on Spotify, Apple Music, or any DSP. Especially if you've never had a music lawyer or manager review your setup." },
  { q: "How does it work?", a: "You fill out a short intake form with your release details. I review everything within 48 hours and send you a full written report + Loom video walkthrough." },
  { q: "What do I need to provide?", a: "Your distributor (DistroKid, TuneCore, etc.), PRO memberships (ASCAP, BMI, etc.), song titles, and any ISRC codes you have. The intake form guides you through it." },
  { q: "How fast do I get results?", a: "Within 48 hours on weekdays. You'll receive a written PDF report and a personal Loom video explaining every finding." },
  { q: "What if I have multiple songs?", a: "The standard audit covers up to 5 songs. For larger catalogs, contact me for custom pricing." },
];

export default function AuditProductPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">

      {/* ── NAV ── */}
      <nav className="border-b border-[#111] px-6 h-14 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
          <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
        </Link>
        <a href="#buy" className="h-8 px-4 rounded-lg bg-[#00d4aa] text-[#080808] text-xs font-bold hover:bg-[#00b894] transition-colors">
          Get your audit →
        </a>
      </nav>

      <main className="max-w-3xl mx-auto px-6">

        {/* ── HERO ── */}
        <section className="py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-bold tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            ONE SERVICE · ONE RESULT · ONE PERSON DOES IT
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            Release Metadata
            <br />
            <span style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Audit
            </span>
          </h1>

          <p className="text-[#a0a0a0] text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-4">
            I check every metadata field, PRO registration, and rights gap in your release — and show you exactly where you&apos;re losing money.
          </p>
          <p className="text-[#555] text-sm mb-10">
            For independent artists, producers & small labels
          </p>

          {/* Price + CTA */}
          <div id="buy" className="inline-flex flex-col items-center gap-4 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-8">
            <div className="text-[#555] text-sm font-medium">One-time · Delivered in 48 hours</div>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-white">$149</span>
              <span className="text-[#555] text-sm mb-3">USD</span>
            </div>
            <a
              href="https://buy.stripe.com/test_cNi5kD5gnd7V8ZVbsV1RC00"
              className="w-full h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg text-[#080808] transition-all"
              style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)" }}
            >
              Book your audit →
            </a>
            <div className="flex items-center gap-4 text-xs text-[#555]">
              <span>✓ 48hr delivery</span>
              <span>✓ Up to 5 songs</span>
              <span>✓ 7-day support</span>
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section className="py-16 border-t border-[#111]">
          <h2 className="text-2xl font-black mb-2">What you get</h2>
          <p className="text-[#555] text-sm mb-8">Everything delivered to your inbox within 48 hours.</p>
          <div className="flex flex-col gap-3">
            {DELIVERABLES.map((d) => (
              <div key={d.title} className="flex items-start gap-4 p-4 rounded-xl border border-[#1a1a1a] bg-[#0e0e0e]">
                <span className="text-2xl flex-shrink-0">{d.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{d.title}</div>
                  <div className="text-[#555] text-xs mt-0.5">{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5 MISTAKES ── */}
        <section className="py-16 border-t border-[#111]">
          <h2 className="text-2xl font-black mb-2">5 mistakes that cost artists money</h2>
          <p className="text-[#555] text-sm mb-8">Most independent artists have at least 2 of these. The audit finds all of them.</p>
          <div className="flex flex-col gap-3">
            {MISTAKES.map((m) => (
              <div key={m.n} className="flex items-center gap-4 p-4 rounded-xl border border-[#1a1a1a] bg-[#0e0e0e]">
                <div className="text-3xl font-black text-[#1e1e1e] w-8 flex-shrink-0">{m.n}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{m.title}</div>
                  <div className="text-[#ff4757] text-xs mt-0.5">{m.impact}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#ff4757] flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* ── WHO I AM ── */}
        <section className="py-16 border-t border-[#111]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex-shrink-0 flex items-center justify-center text-2xl font-black text-[#080808]">
              M
            </div>
            <div>
              <h2 className="text-xl font-black mb-3">This is a one-person service — and that&apos;s the point.</h2>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-3">
                I&apos;m not a platform. I&apos;m not a team. I personally review every audit, find every gap, and deliver every result myself.
              </p>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">
                That means you get real eyes on your specific situation — not an automated scan. Every artist I work with gets the same attention I&apos;d want if it were my music and my money on the line.
              </p>
              <div className="mt-4 text-[#00d4aa] text-sm font-semibold">— MusicRight.AI</div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 border-t border-[#111]">
          <h2 className="text-2xl font-black mb-8">FAQ</h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((f) => (
              <div key={f.q} className="p-5 rounded-xl border border-[#1a1a1a] bg-[#0e0e0e]">
                <div className="text-white font-semibold text-sm mb-2">{f.q}</div>
                <div className="text-[#a0a0a0] text-sm leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="py-20 text-center border-t border-[#111]">
          <h2 className="text-3xl font-black mb-4">
            Find out what you&apos;re missing.
            <br />
            <span style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Fix it this week.
            </span>
          </h2>
          <p className="text-[#555] text-sm mb-8">
            $149 · 48hr delivery · Up to 5 songs · 7 days support
          </p>
          <a
            href="#buy"
            className="inline-flex items-center gap-2 h-14 px-10 rounded-xl font-bold text-lg text-[#080808] transition-all"
            style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)" }}
          >
            Book your audit — $149 →
          </a>
          <p className="text-[#555] text-xs mt-4">Questions? Email contact@musicright.ai</p>
        </section>
      </main>

      <footer className="border-t border-[#111] py-6 text-center text-[#555] text-xs">
        © 2026 MusicRight.AI — All rights reserved
      </footer>
    </div>
  );
}
