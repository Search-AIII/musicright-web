import Navbar from "./components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative">
        <div className="hero-glow" />
        <div className="flex flex-col items-center text-center gap-5 relative">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            EARLY ACCESS OPEN — $5 to reserve your spot
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl">
            Your music earns from<br />
            <span className="gradient-text">9 channels. Most artists miss 6.</span>
          </h1>

          <p className="text-[#a0a0a0] text-lg max-w-xl leading-relaxed">
            MusicRight finds the gaps — PRO, MLC, SoundExchange, YouTube, Copyright —
            then handles the setup so you don&apos;t have to.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/auth/login"
              className="h-12 px-6 rounded-xl border border-[#2e2e2e] bg-[#0e0e0e] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:border-[#00d4aa]/40 transition-all">
              Create free account
            </Link>
            <Link href="/early-access"
              className="h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00b894] transition-all glow">
              Place $5 Early Access →
            </Link>
          </div>

          <p className="text-[#555] text-xs">
            $5 is applied to your first song setup. Cancel anytime before work begins.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-black mb-10">Three steps. One song. Done.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Create your account", desc: "Free. Sign in with Google or email. Takes 30 seconds.", tag: "Free", color: "#00d4aa" },
              { n: "2", title: "Place $5 Early Access", desc: "Reserves your spot. Applied to your first song setup when we open.", tag: "$5", color: "#a78bfa" },
              { n: "3", title: "Submit one song", desc: "Title, credits, splits, audio link. MusicRight routes the rights work.", tag: "We handle it", color: "#00b4d8" },
            ].map(s => (
              <div key={s.n} className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg text-sm font-black flex items-center justify-center" style={{ background: s.color + "20", color: s.color }}>
                    {s.n}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.color + "15", color: s.color }}>
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE HANDLE ── */}
      <section className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black mb-2">What MusicRight handles for you</h2>
            <p className="text-[#555] text-sm">Every channel your song can earn from — set up correctly.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: "🎵", label: "Streaming Royalties", desc: "Distributor + ISRC + payout" },
              { icon: "✍️", label: "PRO Registration", desc: "ASCAP / BMI / SESAC" },
              { icon: "⚙️", label: "MLC Mechanical", desc: "Streaming mechanicals" },
              { icon: "📻", label: "SoundExchange", desc: "Digital radio royalties" },
              { icon: "▶️", label: "YouTube Content ID", desc: "Claims + monetization" },
              { icon: "©", label: "Copyright Filing", desc: "U.S. Copyright Office" },
            ].map(c => (
              <div key={c.label} className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4">
                <div className="text-xl mb-2">{c.icon}</div>
                <div className="text-white text-sm font-semibold mb-0.5">{c.label}</div>
                <div className="text-[#555] text-xs">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE TOOLS STRIP ── */}
      <section className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] px-8 py-6">
          <div>
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-wider mb-1">Free tools</div>
            <p className="text-white font-bold text-base">Split sheets, release checklists, artist invoices — free, no account needed.</p>
          </div>
          <Link href="/tools"
            className="flex-shrink-0 h-10 px-6 rounded-xl border border-[#00d4aa]/30 text-[#00d4aa] font-semibold text-sm flex items-center hover:bg-[#00d4aa]/10 transition-colors whitespace-nowrap">
            Browse free tools →
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 px-6 border-t border-[#111]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black mb-2">Simple pricing</h2>
            <p className="text-[#555] text-sm">Start free. Pay only when we do the work.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Song Check",
                price: "Free",
                desc: "See exactly which royalty channels are missing or broken for your song.",
                features: ["Royalty Health Score", "9-channel gap report", "Setup checklist"],
                cta: "Start free check",
                href: "/start",
                highlight: false,
              },
              {
                name: "Early Access",
                price: "$5",
                desc: "Reserve your spot. Applied to full setup when we open. First-user rewards.",
                features: ["Locks in your place", "Applied to first song setup", "Creator Wallet status"],
                cta: "Place $5 →",
                href: "/early-access",
                highlight: true,
              },
              {
                name: "Full Setup",
                price: "$49",
                desc: "We handle PRO, MLC, SoundExchange, ISRC, splits, and copyright filing.",
                features: ["Full registration handled", "PRO + MLC + SoundExchange", "72-hour turnaround"],
                cta: "Learn more",
                href: "/early-access",
                highlight: false,
              },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-6 border flex flex-col ${
                p.highlight ? "border-[#00d4aa]/40 bg-[#00d4aa]/5" : "border-[#1a1a1a] bg-[#0e0e0e]"
              }`}>
                {p.highlight && <div className="text-[#00d4aa] text-[10px] font-bold uppercase tracking-wider mb-2">Most Popular</div>}
                <div className="text-[#a0a0a0] text-xs font-semibold mb-1">{p.name}</div>
                <div className="text-3xl font-black text-white mb-3">{p.price}</div>
                <p className="text-[#555] text-xs leading-relaxed mb-4">{p.desc}</p>
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#a0a0a0]">
                      <span className="text-[#00d4aa]">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                  p.highlight ? "bg-[#00d4aa] text-[#080808] hover:bg-[#00b894]" : "border border-[#2e2e2e] text-white hover:border-[#00d4aa]/40"
                }`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 px-6 border-t border-[#111]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tight mb-4">
            Start with one song.<br />
            <span className="gradient-text">We handle the rest.</span>
          </h2>
          <p className="text-[#555] text-sm mb-8">
            Free to check. $5 to reserve your spot. Full setup when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/login"
              className="h-12 px-6 rounded-xl border border-[#2e2e2e] text-white font-semibold text-sm flex items-center justify-center hover:border-[#00d4aa]/40 transition-all">
              Create free account
            </Link>
            <Link href="/early-access"
              className="h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm flex items-center justify-center hover:bg-[#00b894] transition-all glow">
              Place $5 Early Access →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#111] px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#555]">
            <Link href="/tools" className="hover:text-[#a0a0a0] transition-colors">Free Tools</Link>
            <Link href="/early-access" className="hover:text-[#a0a0a0] transition-colors">Early Access</Link>
            <a href="mailto:contact@musicright.ai" className="hover:text-[#a0a0a0] transition-colors">Contact</a>
            <Link href="/legal/terms" className="hover:text-[#a0a0a0] transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-[#a0a0a0] transition-colors">Privacy</Link>
          </div>
          <span className="text-[#555] text-xs">© 2026 MusicRight.AI</span>
        </div>
      </footer>
    </div>
  );
}
