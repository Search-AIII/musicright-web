import Navbar from "./components/Navbar";
import Link from "next/link";

// ─── Mock data for catalog preview ────────────────────────────────────────────
const PREVIEW_SONGS = [
  { title: "So Hot (feat. KTTeddy)", isrc: "US-XXX-26-001", ascap: true,  bmi: false, mlc: true,  se: false, leak: "$340/mo" },
  { title: "Midnight Drive",         isrc: "US-XXX-25-042", ascap: true,  bmi: true,  mlc: false, se: true,  leak: "$180/mo" },
  { title: "Golden Hour",            isrc: null,            ascap: false, bmi: false, mlc: false, se: false, leak: "$520/mo" },
  { title: "City Lights",            isrc: "US-XXX-24-088", ascap: true,  bmi: true,  mlc: true,  se: true,  leak: null },
];

const LEAKS = [
  { sev: "critical", label: "MLC Not Registered",       detail: "3 songs not collecting mechanical royalties",  amount: "$4,080/yr",  color: "#ff4757" },
  { sev: "high",     label: "SoundExchange Unlinked",    detail: "Digital radio royalties going uncollected",    amount: "$2,160/yr",  color: "#ffb800" },
  { sev: "high",     label: "Publisher Share Unclaimed", detail: "50% publisher split not assigned on 2 songs",  amount: "$1,320/yr",  color: "#ffb800" },
  { sev: "medium",   label: "Missing ISRC Code",         detail: '"Golden Hour" blocked from 4 DSPs',           amount: "Blocked",    color: "#ff6b35" },
];

const FEATURES = [
  {
    icon: "🔍",
    title: "Rights Audit",
    desc: "4-step intake scans your catalog against ASCAP, BMI, The MLC, SoundExchange and 40+ global PROs. See every gap in seconds.",
  },
  {
    icon: "💰",
    title: "Revenue Leak Alerts",
    desc: "Real-time cards showing exactly how much money you're missing and from which organization — with a one-tap fix.",
  },
  {
    icon: "🏦",
    title: "Royalty Wallet",
    desc: "See all your royalty income in one place. Instant Stripe-powered payouts to your bank account. No more waiting 6–18 months.",
  },
  {
    icon: "⚡",
    title: "Fix Actions",
    desc: "Prioritized action list. We handle the registrations for you — ASCAP, BMI, The MLC, SoundExchange, Harry Fox Agency.",
  },
  {
    icon: "🛡️",
    title: "DMCA Generator",
    desc: "One-click DMCA takedown notices for YouTube, TikTok, Instagram, Spotify and Twitter. Filed properly, every time.",
  },
  {
    icon: "🤖",
    title: "AI Rights Advisor",
    desc: "Ask anything about royalties, licensing, splits, and international collection. Powered by DeepSeek V3 and Qwen 2.5.",
  },
];

const STEPS = [
  { n: "01", title: "Run your free audit", desc: "Enter your artist name. We scan all major PROs and identify every registration gap in your catalog." },
  { n: "02", title: "See your revenue leaks", desc: "Get a dollar-amount breakdown of exactly what you're missing and why — per song, per organization." },
  { n: "03", title: "We fix it for you", desc: "One payment. We handle every registration: ASCAP, BMI, MLC, SoundExchange, ISRC, and more." },
  { n: "04", title: "Collect your money", desc: "Royalties flow into your MusicRight wallet. Instant payout to your bank — no 6-month delays." },
];

const PRICING = [
  {
    name: "Audit",
    price: "Free",
    sub: "Always free",
    features: ["Full rights audit", "Revenue leak report", "Gap breakdown by PRO", "Priority action list"],
    cta: "Run free audit",
    href: "/audit",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    sub: "per month",
    features: ["Everything in Audit", "Rights Wallet + payouts", "DMCA generator", "AI advisor", "Certificate sharing", "40+ country coverage"],
    cta: "Start Pro",
    href: "/audit",
    highlight: true,
  },
  {
    name: "Recovery",
    price: "$149",
    sub: "one-time",
    features: ["Everything in Pro", "We register all missing PROs", "ISRC generation", "Publisher split setup", "SoundExchange linking", "Dedicated support"],
    cta: "Book recovery",
    href: "/audit",
    highlight: false,
  },
];

function Dot({ on }: { on: boolean }) {
  return (
    <div
      className={`w-2 h-2 rounded-full ${on ? "bg-[#00d4aa]" : "bg-[#ff4757]/40 border border-[#ff4757]/60"}`}
    />
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            ROYALTY OPERATIONS FOR INDEPENDENT ARTISTS
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl">
            Find every dollar
            <br />
            <span className="gradient-text">you&apos;re not collecting.</span>
          </h1>

          {/* Sub */}
          <p className="text-[#a0a0a0] text-lg md:text-xl max-w-2xl leading-relaxed">
            MusicRight audits your catalog against every major PRO, identifies broken registrations,
            and fixes them — so you collect 100% of what you&apos;ve earned.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              href="/audit"
              className="h-12 px-6 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-base hover:bg-[#00b894] transition-all glow"
            >
              Run free audit →
            </Link>
            <Link
              href="/dashboard"
              className="h-12 px-6 rounded-xl border border-[#2e2e2e] text-[#a0a0a0] font-semibold text-base hover:border-[#00d4aa]/40 hover:text-white transition-all"
            >
              View dashboard demo
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-[#555] text-sm">
            Free audit · No credit card required · Results in 60 seconds
          </p>
        </div>

        {/* ── Dashboard preview ── */}
        <div className="mt-16 rounded-2xl border border-[#222] bg-[#111] overflow-hidden shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222] bg-[#0d0d0d]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="flex-1 mx-4 h-6 rounded-md bg-[#1a1a1a] flex items-center px-3">
              <span className="text-[#555] text-xs">musicright.ai/dashboard</span>
            </div>
          </div>

          {/* Audit score bar */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1a1a1a] bg-[#0e0e0e]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#ffb800] flex items-center justify-center">
                <span className="text-[#ffb800] text-sm font-black">68</span>
              </div>
              <div>
                <div className="text-xs text-[#555] uppercase tracking-wider font-semibold">Rights Score</div>
                <div className="text-[#ffb800] text-xs font-semibold">Needs Attention</div>
              </div>
            </div>
            <div className="h-8 w-px bg-[#222]" />
            <div className="flex gap-6">
              {[
                { label: "Annual Leak", val: "$8,640", color: "#ff4757" },
                { label: "Songs Tracked", val: "5", color: "#a0a0a0" },
                { label: "Active PROs", val: "2 / 4", color: "#ffb800" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-xs text-[#555] font-medium">{m.label}</div>
                  <div className="font-bold text-sm" style={{ color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leak cards */}
          <div className="flex gap-3 p-4 overflow-x-auto">
            {LEAKS.map((l) => (
              <div
                key={l.label}
                className="flex-shrink-0 w-56 rounded-xl p-3.5 border bg-[#0d0d0d]"
                style={{ borderColor: l.color + "30" }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: l.color }}
                >
                  {l.sev}
                </div>
                <div className="text-white text-sm font-semibold mb-0.5">{l.label}</div>
                <div className="text-[#555] text-xs mb-2">{l.detail}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.amount}</span>
                  <button
                    className="text-[10px] font-bold px-2 py-1 rounded-md"
                    style={{ background: l.color + "15", color: l.color }}
                  >
                    Fix →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Catalog table */}
          <div className="border-t border-[#1a1a1a]">
            <div className="px-4 py-2 border-b border-[#1a1a1a] bg-[#0d0d0d]">
              <span className="text-[#555] text-xs font-semibold uppercase tracking-wider">Song Catalog</span>
            </div>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_40px_40px_40px_40px_80px] gap-2 px-4 py-2 bg-[#0d0d0d] border-b border-[#1a1a1a]">
              {["SONG", "ISRC", "ASCAP", "BMI", "MLC", "SE", "LEAK"].map((h) => (
                <div key={h} className="text-[#555] text-[10px] font-bold uppercase tracking-wider">{h}</div>
              ))}
            </div>
            {PREVIEW_SONGS.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_100px_40px_40px_40px_40px_80px] gap-2 px-4 py-2.5 border-b border-[#1a1a1a] hover:bg-[#0d0d0d] transition-colors"
              >
                <div className="text-white text-xs font-medium truncate">{s.title}</div>
                <div className="text-[#555] text-[11px] font-mono">{s.isrc ?? "—"}</div>
                <Dot on={s.ascap} />
                <Dot on={s.bmi} />
                <Dot on={s.mlc} />
                <Dot on={s.se} />
                <div className={`text-[11px] font-bold ${s.leak ? "text-[#ff4757]" : "text-[#00d4aa]"}`}>
                  {s.leak ?? "✓ Full"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Features</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Everything you need to collect
              <br />
              <span className="gradient-text">every dollar you&apos;ve earned</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border border-[#1a1a1a] bg-[#0e0e0e] hover:border-[#00d4aa]/20 transition-colors group"
              >
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#00d4aa] transition-colors">
                  {f.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              From audit to payout
              <br />
              <span className="gradient-text">in 4 steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-4xl font-black text-[#1a1a1a] mb-4">{s.n}</div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Start free.
              <span className="gradient-text"> Pay when it works.</span>
            </h2>
            <p className="text-[#a0a0a0] mt-4 text-base">
              Run a full audit for free. Upgrade only if we find missing money.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-6 border flex flex-col ${
                  p.highlight
                    ? "border-[#00d4aa]/40 bg-[#00d4aa]/5 glow"
                    : "border-[#1a1a1a] bg-[#0e0e0e]"
                }`}
              >
                {p.highlight && (
                  <div className="text-[#00d4aa] text-[10px] font-bold uppercase tracking-[0.15em] mb-3">
                    Most Popular
                  </div>
                )}
                <div className="text-[#a0a0a0] text-sm font-semibold mb-1">{p.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-white">{p.price}</span>
                  {p.price !== "Free" && <span className="text-[#555] text-sm mb-1">{p.sub}</span>}
                </div>
                <div className="text-[#555] text-xs mb-5">{p.price === "Free" ? p.sub : ""}</div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                      <span className="text-[#00d4aa] text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    p.highlight
                      ? "bg-[#00d4aa] text-[#080808] hover:bg-[#00b894]"
                      : "border border-[#2e2e2e] text-white hover:border-[#00d4aa]/40"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Your music is already
            <br />
            <span className="gradient-text">earning money.</span>
            <br />
            Are you collecting it?
          </h2>
          <p className="text-[#a0a0a0] text-base mb-8">
            The average independent artist misses $3,000–$12,000 per year
            in uncollected royalties. Find yours in 60 seconds — free.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-lg hover:bg-[#00b894] transition-all glow"
          >
            Start your free audit →
          </Link>
          <p className="text-[#555] text-sm mt-4">No credit card · No account needed · 60 seconds</p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#111] px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
              <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
            </div>
            <p className="text-[#555] text-xs max-w-xs leading-relaxed">
              Royalty operations for independent artists. Find your gaps. Fix your rights. Collect your money.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-white font-semibold mb-3">Product</div>
              <div className="flex flex-col gap-2 text-[#555]">
                <Link href="/audit" className="hover:text-[#a0a0a0]">Free Audit</Link>
                <Link href="/dashboard" className="hover:text-[#a0a0a0]">Dashboard</Link>
                <Link href="#pricing" className="hover:text-[#a0a0a0]">Pricing</Link>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3">Rights</div>
              <div className="flex flex-col gap-2 text-[#555]">
                <span>ASCAP Registration</span>
                <span>The MLC Setup</span>
                <span>SoundExchange</span>
                <span>DMCA Takedowns</span>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3">Company</div>
              <div className="flex flex-col gap-2 text-[#555]">
                <span>musicright.ai</span>
                <span className="text-[#00d4aa] text-xs">contact@musicright.ai</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#111] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#555]">
          <span>© 2026 MusicRight.AI — All rights reserved</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
              Stripe secured
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />
              SOC 2 compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
