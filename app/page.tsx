import Navbar from "./components/Navbar";
import Link from "next/link";

const EARNING_CHANNELS = [
  { icon: "🎵", title: "Master Streaming Royalties", desc: "Distributor setup, ISRC, UPC, payout account, and metadata verification.", status: "needs-review" },
  { icon: "✍️", title: "Publishing Royalties", desc: "Songwriter credits, PRO setup, publisher/admin setup, and MLC registration.", status: "missing" },
  { icon: "⚙️", title: "Mechanical Royalties", desc: "MLC registration and metadata matching for every on-demand stream.", status: "missing" },
  { icon: "🎤", title: "Performance Royalties", desc: "PRO membership and song registration for public performance collection.", status: "needs-review" },
  { icon: "📻", title: "Digital Performance (SoundExchange)", desc: "SoundExchange setup for digital radio, Pandora, and satellite radio.", status: "missing" },
  { icon: "▶️", title: "YouTube Content ID", desc: "Content ID setup to monetize fan uploads and official content.", status: "unsure" },
  { icon: "📱", title: "Social Media / UGC Royalties", desc: "TikTok, Instagram, Facebook, and UGC monetization setup.", status: "unsure" },
  { icon: "🎬", title: "Sync & Licensing Readiness", desc: "Ownership clarity, splits, master owner info, clean metadata, and contact details.", status: "needs-review" },
  { icon: "🌍", title: "Global & Neighboring Rights", desc: "International collection and publishing admin support for global royalties.", status: "unsure" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:        { label: "Active",       color: "#00d4aa", bg: "#00d4aa15" },
  missing:       { label: "Missing",      color: "#ff4757", bg: "#ff475715" },
  unsure:        { label: "Unsure",       color: "#ffb800", bg: "#ffb80015" },
  "needs-review":{ label: "Needs Review", color: "#ff6b35", bg: "#ff6b3515" },
};

const FEATURES = [
  { icon: "🏦", title: "Rights Wallet",        desc: "All your royalty channels, splits, and registrations in one place. See the full financial picture of your catalog." },
  { icon: "⚙️", title: "Royalty Operations",   desc: "Process registrations, fix metadata, set up splits, and activate collection channels with guided workflows." },
  { icon: "🔍", title: "Song Check",           desc: "Submit one song and get a full earning roadmap: what's active, what's missing, and what to process next." },
  { icon: "📈", title: "IP Banking Layer",      desc: "Turn your catalog into trackable, bankable assets. See your Royalty Health Score and earnings potential per song." },
  { icon: "⚡", title: "Processing Checklist", desc: "Prioritized setup actions tailored to your catalog. We handle registrations, ISRC, splits, and more." },
  { icon: "🌍", title: "Global Collection",    desc: "Activate royalty channels beyond the US — international PROs, neighboring rights, and global publishing admin." },
];

const STEPS = [
  { n: "01", title: "Submit one song",        desc: "Enter your song details. We review your current setup across all major royalty channels." },
  { n: "02", title: "Get your earning roadmap", desc: "See your Royalty Health Score, what's missing, what's blocking collection, and what to activate." },
  { n: "03", title: "Process your setup",     desc: "Follow a guided checklist or let MusicRight handle registrations, metadata, and splits for you." },
  { n: "04", title: "Activate more channels", desc: "Unlock mechanical, performance, digital, social, and international royalty channels." },
];

const PRICING = [
  {
    name: "Song Check", price: "Free", sub: "Always free",
    features: ["1-song royalty review", "Royalty Health Score", "Earning Opportunities report", "Processing checklist", "Next money action"],
    cta: "Run Free Song Check", href: "/start", highlight: false,
  },
  {
    name: "Setup", price: "$49", sub: "per song",
    features: ["Everything in Song Check", "Full royalty setup processing", "PRO & MLC registration", "ISRC generation", "Splits documentation", "SoundExchange setup"],
    cta: "Set Up My Royalties", href: "/start", highlight: true,
  },
  {
    name: "Done For You", price: "$149", sub: "per song",
    features: ["Everything in Setup", "We handle all submissions", "YouTube Content ID setup", "Social media monetization", "Global collection setup", "72-hour SLA guarantee"],
    cta: "Get Done For You", href: "/start", highlight: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto relative overflow-hidden">
        <div className="hero-glow" />
        <div className="flex flex-col items-center text-center gap-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            FREE SONG CHECK · ROYALTY HEALTH SCORE IN 60 SECONDS
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl">
            Add one song. See what&apos;s
            <br />
            <span className="gradient-text">blocking your royalties.</span>
          </h1>

          <p className="text-[#a0a0a0] text-lg md:text-xl max-w-2xl leading-relaxed">
            MusicRight shows you missing registrations, blocked royalty routes, and a step-by-step plan
            to get paid — across every channel your song can earn from.
          </p>

          {/* Dual entry CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-4 w-full max-w-md">
            <Link href="/start/first-time" className="flex-1 py-3.5 px-7 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-all glow flex items-center justify-center gap-2 shadow-lg shadow-[#00d4aa]/10">
              🎵 I&apos;m starting fresh
            </Link>
            <Link href="/start/experienced" className="flex-1 py-3.5 px-7 rounded-xl border border-[#2a2a2a] bg-[#0e0e0e] text-white font-semibold text-sm hover:border-[#00d4aa]/30 hover:bg-[#111] transition-all flex items-center justify-center gap-2">
              ⚡ I&apos;ve registered before
            </Link>
          </div>

          <p className="text-[#555] text-sm">Free · No credit card · Works for human-made and AI-assisted music</p>

          {/* Stats bar */}
          <div className="flex items-center gap-6 pt-2 flex-wrap justify-center">
            {[
              { val: "9", label: "royalty channels checked" },
              { val: "60 sec", label: "to your full roadmap" },
              { val: "Free", label: "forever, no card needed" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <span className="text-[#00d4aa] font-black">{s.val}</span>
                <span className="text-[#555]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 rounded-2xl border border-[#222] bg-[#111] overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222] bg-[#0d0d0d]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="flex-1 mx-4 h-6 rounded-md bg-[#1a1a1a] flex items-center px-3">
              <span className="text-[#555] text-xs">musicright.ai/results</span>
            </div>
          </div>

          {/* Health Score bar */}
          <div className="flex items-center gap-6 px-6 py-4 border-b border-[#1a1a1a] bg-[#0e0e0e]">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#1a1a1a" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#ff4757" strokeWidth="4"
                    strokeDasharray="125.7" strokeDashoffset="75.4" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-black">40</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#555] uppercase tracking-wider font-semibold">Royalty Health Score</div>
                <div className="text-[#ff4757] text-xs font-semibold">High Risk — Setup Needed</div>
              </div>
            </div>
            <div className="h-8 w-px bg-[#222]" />
            <div className="flex gap-6">
              {[
                { label: "Channels Active", val: "2 / 9", color: "#ffb800" },
                { label: "Channels Missing", val: "4",    color: "#ff4757" },
                { label: "Needs Review",     val: "3",    color: "#ff6b35" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-xs text-[#555] font-medium">{m.label}</div>
                  <div className="font-bold text-sm" style={{ color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 p-4 overflow-x-auto">
            {[
              { channel: "Mechanical (MLC)",  status: "Missing",      color: "#ff4757" },
              { channel: "SoundExchange",     status: "Missing",      color: "#ff4757" },
              { channel: "YouTube CID",       status: "Unsure",       color: "#ffb800" },
              { channel: "Social Media UGC",  status: "Unsure",       color: "#ffb800" },
              { channel: "Global Collection", status: "Needs Review", color: "#ff6b35" },
            ].map((c) => (
              <div key={c.channel} className="flex-shrink-0 w-48 rounded-xl p-3.5 border bg-[#0d0d0d]" style={{ borderColor: c.color + "30" }}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: c.color }}>{c.status}</div>
                <div className="text-white text-xs font-semibold mb-2">{c.channel}</div>
                <button className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: c.color + "15", color: c.color }}>Set Up →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-12 px-6 border-t border-[#111]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[#555] text-sm font-medium mb-8 uppercase tracking-wider">Built for</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "🎙️", label: "First-time creators", desc: "Never set up royalties before" },
              { icon: "⚡", label: "Experienced artists", desc: "Accounts scattered across tools" },
              { icon: "🤖", label: "AI-assisted music", desc: "Suno, Udio, and beyond" },
            ].map((t) => (
              <div key={t.label} className="rounded-xl p-4 border border-[#1a1a1a] bg-[#0e0e0e]">
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="text-white text-xs font-bold mb-1">{t.label}</div>
                <div className="text-[#555] text-xs">{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] px-8 py-6 text-center">
            <p className="text-white text-lg md:text-xl font-bold leading-relaxed">
              You shouldn&apos;t need five tools and six logins
              <span className="text-[#00d4aa]"> to get one song royalty-ready.</span>
            </p>
            <p className="text-[#555] text-sm mt-2">MusicRight organizes it all in one place.</p>
          </div>
        </div>
      </section>

      {/* ── ROYALTY EARNING OPPORTUNITIES ── */}
      <section id="channels" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Royalty Channels</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Royalty Earning Opportunities</h2>
            <p className="text-[#a0a0a0] mt-4 text-base max-w-2xl mx-auto">
              Your song may have multiple royalty paths. MusicRight.ai helps you understand which channels
              are active, which are missing, and what setup work is needed next.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {EARNING_CHANNELS.map((ch) => {
              const s = STATUS_CONFIG[ch.status];
              return (
                <div key={ch.title} className="rounded-2xl p-6 border border-[#1a1a1a] bg-[#0e0e0e] hover:border-[#00d4aa]/20 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{ch.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-[#00d4aa] transition-colors">{ch.title}</h3>
                  <p className="text-[#555] text-xs leading-relaxed mb-3">{ch.desc}</p>
                  <Link href="/start" className="text-[11px] font-bold text-[#00d4aa] hover:underline">
                    Let MusicRight Help Set This Up →
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/start" className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-base hover:bg-[#00b894] transition-all glow">
              Let MusicRight Process My Royalty Setup →
            </Link>
            <p className="text-[#555] text-xs mt-3">
              Helps activate more royalty channels. Results may vary based on catalog and registration history.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Platform</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              More than a checker.<br />
              <span className="gradient-text">A royalty operations system.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl p-6 border border-[#1a1a1a] bg-[#0e0e0e] hover:border-[#00d4aa]/20 transition-colors group">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#00d4aa] transition-colors">{f.title}</h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              From one song to<br />
              <span className="gradient-text">a full earning roadmap</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="text-4xl font-black text-[#1a1a1a] mb-4">{s.n}</div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POSITIONING STATEMENTS ── */}
      <section className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          {[
            { text: "Set up your song to earn royalties properly.", icon: "⚙️" },
            { text: "Process your music rights and royalty setup in one place.", icon: "🏦" },
            { text: "Activate more royalty channels from your songs.", icon: "📈" },
            { text: "Make your music catalog easier to collect, manage, and grow.", icon: "🌍" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-4 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <p className="text-white font-semibold text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Start with one song.<span className="gradient-text"> Scale your catalog.</span>
            </h2>
            <p className="text-[#a0a0a0] mt-4 text-base">
              Free song check. Upgrade when you&apos;re ready to process your setup.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PRICING.map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 border flex flex-col ${
                p.highlight ? "border-[#00d4aa]/40 bg-[#00d4aa]/5 glow" : "border-[#1a1a1a] bg-[#0e0e0e]"
              }`}>
                {p.highlight && <div className="text-[#00d4aa] text-[10px] font-bold uppercase tracking-[0.15em] mb-3">Most Popular</div>}
                <div className="text-[#a0a0a0] text-sm font-semibold mb-1">{p.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-white">{p.price}</span>
                  {p.price !== "Free" && <span className="text-[#555] text-sm mb-1">{p.sub}</span>}
                </div>
                <div className="text-[#555] text-xs mb-5">{p.price === "Free" ? p.sub : ""}</div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                      <span className="text-[#00d4aa] text-xs">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                  p.highlight
                    ? "bg-[#00d4aa] text-[#080808] hover:bg-[#00b894]"
                    : "border border-[#2e2e2e] text-white hover:border-[#00d4aa]/40"
                }`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 border-t border-[#111]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Add one song.<br />
            <span className="gradient-text">See what&apos;s blocking your royalties.</span>
          </h2>
          <p className="text-[#a0a0a0] text-base mb-8">
            Most independent artists have songs earning from fewer than half the channels they qualify for.
            MusicRight helps you see the gaps and close them — step by step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/start/first-time" className="py-4 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-base hover:bg-[#00b894] transition-all glow shadow-xl shadow-[#00d4aa]/10">
              🎵 Check My Song Free →
            </Link>
            <Link href="/start/experienced" className="py-4 px-8 rounded-xl border border-[#2a2a2a] bg-[#0e0e0e] text-white font-semibold text-base hover:border-[#00d4aa]/30 hover:bg-[#111] transition-all">
              ⚡ I&apos;ve Registered Before
            </Link>
          </div>
          <p className="text-[#555] text-sm mt-4">Free · No credit card · 60 seconds</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#111] px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
              <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
            </div>
            <p className="text-[#555] text-xs max-w-xs leading-relaxed">
              The royalty operating system for music creators. Process rights setup, activate royalty
              channels, and make your catalog easier to collect from.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-white font-semibold mb-3">Product</div>
              <div className="flex flex-col gap-2 text-[#555]">
                <Link href="/start" className="hover:text-[#a0a0a0]">Song Check</Link>
                <Link href="/start" className="hover:text-[#a0a0a0]">Royalty Setup</Link>
                <Link href="/dashboard" className="hover:text-[#a0a0a0]">Dashboard</Link>
                <Link href="/#pricing" className="hover:text-[#a0a0a0]">Pricing</Link>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3">Channels</div>
              <div className="flex flex-col gap-2 text-[#555]">
                <span>PRO Registration</span>
                <span>The MLC</span>
                <span>SoundExchange</span>
                <span>YouTube Content ID</span>
                <span>Social Media UGC</span>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-3">Company</div>
              <div className="flex flex-col gap-2 text-[#555]">
                <a href="mailto:contact@musicright.ai" className="hover:text-[#a0a0a0] transition-colors">Contact</a>
                <Link href="/legal/terms" className="hover:text-[#a0a0a0] transition-colors">Terms</Link>
                <Link href="/legal/privacy" className="hover:text-[#a0a0a0] transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#111] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#555]">
          <span>© 2026 MusicRight.AI — All rights reserved</span>
          <div className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-[#a0a0a0] transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-[#a0a0a0] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
