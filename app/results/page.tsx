"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const CHANNELS = [
  {
    id: "streaming", icon: "🎵", title: "Master Streaming Royalties",
    why: "Missing ISRC or bad metadata can block collection from major DSPs.",
    next: "Verify ISRC is registered and distributor payout account is active.",
    impact: "Can improve royalty readiness for streaming platforms",
  },
  {
    id: "publishing", icon: "✍️", title: "Publishing Royalties",
    why: "Without PRO and publisher setup, publishing royalties go uncollected.",
    next: "Register with ASCAP, BMI, or SESAC and set up a publishing admin.",
    impact: "May help unlock publishing royalty collection",
  },
  {
    id: "mechanical", icon: "⚙️", title: "Mechanical Royalties (MLC)",
    why: "The MLC pays mechanicals on every US on-demand stream. Unregistered songs leave money pooled.",
    next: "Register at themlc.com with accurate songwriter credits and metadata.",
    impact: "Helps reduce missed mechanical royalty collection",
  },
  {
    id: "performance", icon: "🎤", title: "Performance Royalties",
    why: "Every public performance generates royalties if your song is registered with your PRO.",
    next: "Confirm registration and IPI number with your PRO.",
    impact: "Helps prepare catalog for performance collection",
  },
  {
    id: "soundexchange", icon: "📻", title: "SoundExchange (Digital Radio)",
    why: "SoundExchange pays master owners and featured artists separately for digital radio.",
    next: "Register as a rights holder at soundexchange.com.",
    impact: "May help unlock digital radio royalty collection",
  },
  {
    id: "youtube", icon: "▶️", title: "YouTube Content ID",
    why: "Without Content ID, fan videos and covers using your song earn nothing for you.",
    next: "Enable Content ID through your distributor or a YouTube admin partner.",
    impact: "Can improve YouTube royalty readiness",
  },
  {
    id: "social", icon: "📱", title: "TikTok / Instagram / UGC",
    why: "Billions of social media videos use music. Your song should earn from every one.",
    next: "Confirm your distributor has enabled TikTok, Instagram, and Facebook monetization.",
    impact: "Helps activate social media royalty channels",
  },
  {
    id: "sync", icon: "🎬", title: "Sync & Licensing Readiness",
    why: "Unclear splits or missing metadata block licensing opportunities.",
    next: "Document your splits and ensure clean metadata across all music databases.",
    impact: "Helps prepare your catalog for licensing",
  },
  {
    id: "global", icon: "🌍", title: "Global & Neighboring Rights",
    why: "Your music may be earning royalties in other countries you're not set up to collect.",
    next: "Consider a global publishing admin to activate international collection.",
    impact: "Helps artists process global royalty setup",
  },
];

const CHECKLIST = [
  { item: "Register with PRO (ASCAP, BMI, or SESAC)", priority: "high" },
  { item: "Register with The MLC for mechanical royalties", priority: "high" },
  { item: "Set up SoundExchange for digital performance royalties", priority: "high" },
  { item: "Verify ISRC code is assigned and registered", priority: "medium" },
  { item: "Enable YouTube Content ID", priority: "medium" },
  { item: "Activate TikTok / social media monetization", priority: "medium" },
  { item: "Document ownership splits in writing", priority: "medium" },
  { item: "Confirm publisher share is claimed or assigned", priority: "low" },
  { item: "Review global and neighboring rights setup", priority: "low" },
];

const PRIORITY_COLOR: Record<string, string> = {
  high: "#ff4757", medium: "#ffb800", low: "#a0a0a0",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:         { label: "Active",       color: "#00d4aa", bg: "#00d4aa15", border: "#00d4aa30" },
  missing:        { label: "Missing",      color: "#ff4757", bg: "#ff475715", border: "#ff475730" },
  unsure:         { label: "Unsure",       color: "#ffb800", bg: "#ffb80015", border: "#ffb80030" },
  "needs-review": { label: "Needs Review", color: "#ff6b35", bg: "#ff6b3515", border: "#ff6b3530" },
};

function getStatus(
  id: string,
  p: { pros: string[]; distributor: string; isrc: string; yt: string; tt: string; se: string; splits: string }
): "active" | "missing" | "needs-review" | "unsure" {
  const hasPRO = p.pros.some((x) => ["ASCAP", "BMI", "SESAC"].includes(x));
  const hasMLC = p.pros.includes("The MLC");
  const hasSE  = p.pros.includes("SoundExchange") || p.se === "Yes";
  switch (id) {
    case "streaming":    return p.distributor && p.distributor !== "Direct / None" ? (p.isrc === "Yes" ? "active" : "needs-review") : "missing";
    case "publishing":   return hasPRO ? "needs-review" : "missing";
    case "mechanical":   return hasMLC ? "active" : "missing";
    case "performance":  return hasPRO ? "needs-review" : "missing";
    case "soundexchange":return hasSE  ? "active" : "missing";
    case "youtube":      return p.yt === "Yes" ? "active" : p.yt === "No" ? "missing" : "unsure";
    case "social":       return p.tt === "Yes" ? "active" : p.tt === "No" ? "missing" : "unsure";
    case "sync":         return p.splits === "Yes" ? "needs-review" : "unsure";
    case "global":       return "unsure";
    default:             return "unsure";
  }
}

function ScoreRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#00d4aa" : score >= 40 ? "#ffb800" : "#ff4757";
  const label = score >= 70 ? "Good Standing" : score >= 40 ? "Needs Attention" : "High Risk — Setup Needed";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1a1a1a" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color }}>{score}</span>
          <span className="text-[#555] text-[10px] font-semibold uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs text-[#555] uppercase tracking-wider font-semibold">Royalty Health Score</div>
        <div className="text-xs font-bold mt-0.5" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

function ResultsContent() {
  const sp = useSearchParams();
  const song       = sp.get("song")        || "Your Song";
  const artist     = sp.get("artist")      || "Your Artist";
  const score      = parseInt(sp.get("score") || "42", 10);
  const pros       = (sp.get("pros") || "").split(",").filter(Boolean);
  const distributor= sp.get("distributor") || "";
  const isrc       = sp.get("isrc")        || "Unsure";
  const yt         = sp.get("yt")          || "Unsure";
  const tt         = sp.get("tt")          || "Unsure";
  const se         = sp.get("se")          || "Unsure";
  const splits     = sp.get("splits")      || "Unsure";

  const params = { pros, distributor, isrc, yt, tt, se, splits };
  const channelsWithStatus = CHANNELS.map((ch) => ({ ...ch, status: getStatus(ch.id, params) }));

  const active  = channelsWithStatus.filter((c) => c.status === "active").length;
  const missing = channelsWithStatus.filter((c) => c.status === "missing").length;
  const review  = channelsWithStatus.filter((c) => c.status === "needs-review" || c.status === "unsure").length;

  const nextAction = !pros.includes("The MLC")
    ? { title: "Register with The MLC for mechanical royalties", desc: "Mechanical royalties are paid on every US on-demand stream. Unregistered songs leave money in a pool that may never reach you." }
    : !pros.some((p) => ["ASCAP", "BMI", "SESAC"].includes(p))
    ? { title: "Register with a PRO (ASCAP, BMI, or SESAC)", desc: "Without a PRO membership, performance and publishing royalties cannot be collected for this song." }
    : yt !== "Yes"
    ? { title: "Enable YouTube Content ID", desc: "Activate Content ID through your distributor or a YouTube admin to earn from fan videos and covers." }
    : { title: "Review your remaining channel setup", desc: "Activate the next highest-impact royalty channel for this song." };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-[#111] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <Link href="/check" className="text-[#00d4aa] text-sm font-semibold hover:underline">← Check Another Song</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Royalty Setup Review</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            &quot;{song}&quot; — Earning Roadmap
          </h1>
          <p className="text-[#a0a0a0] text-base">by {artist} · Here&apos;s what&apos;s active, what&apos;s missing, and what to process next.</p>
        </div>

        {/* Score + stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 flex items-center justify-center">
            <ScoreRing score={score} />
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            {[
              { label: "Channels Active",  val: `${active} / 9`,   color: "#00d4aa" },
              { label: "Channels Missing", val: String(missing),    color: "#ff4757" },
              { label: "Needs Review",     val: String(review),     color: "#ffb800" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                <div className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-2">{m.label}</div>
                <div className="text-3xl font-black mb-1" style={{ color: m.color }}>{m.val}</div>
              </div>
            ))}
            {/* Next Money Action */}
            <div className="col-span-3 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
              <div className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-2">⚡ Next Money Action</div>
              <div className="text-white font-bold text-sm mb-1">{nextAction.title}</div>
              <p className="text-[#a0a0a0] text-xs leading-relaxed mb-2">{nextAction.desc}</p>
              <Link href="/check" className="text-[#00d4aa] text-xs font-bold hover:underline">
                Let MusicRight Process This Setup →
              </Link>
            </div>
          </div>
        </div>

        {/* Royalty Earning Opportunities */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-2">Royalty Earning Opportunities</div>
            <h2 className="text-2xl font-black tracking-tight mb-2">9 Royalty Channels — Your Status</h2>
            <p className="text-[#a0a0a0] text-sm">
              Status is based on your submission. MusicRight can help process setup for any channel
              marked Missing, Unsure, or Needs Review.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {channelsWithStatus.map((ch) => {
              const s = STATUS_CONFIG[ch.status];
              return (
                <div key={ch.id} className="rounded-2xl border bg-[#0e0e0e] p-6" style={{ borderColor: s.border }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{ch.icon}</span>
                      <h3 className="text-white font-bold text-base">{ch.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-1">Why It Matters</div>
                      <p className="text-[#a0a0a0] text-xs leading-relaxed">{ch.why}</p>
                    </div>
                    <div>
                      <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-1">What To Do Next</div>
                      <p className="text-[#a0a0a0] text-xs leading-relaxed">{ch.next}</p>
                    </div>
                    <div>
                      <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-1">Impact</div>
                      <p className="text-[#00d4aa] text-xs leading-relaxed font-medium">{ch.impact}</p>
                    </div>
                  </div>
                  {ch.status !== "active" && (
                    <Link href="/check"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ color: s.color, background: s.bg }}>
                      Let MusicRight Help Set This Up →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Processing Checklist */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-2">Processing Checklist</div>
            <h2 className="text-2xl font-black tracking-tight">What Needs To Be Done</h2>
          </div>
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#1a1a1a] last:border-0">
                <div className="w-5 h-5 rounded-full border-2 border-[#2e2e2e] flex-shrink-0" />
                <span className="text-white text-sm flex-1">{item.item}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: PRIORITY_COLOR[item.priority], background: PRIORITY_COLOR[item.priority] + "15" }}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Paid Setup Help */}
        <div className="rounded-2xl border border-[#00d4aa]/30 bg-[#00d4aa]/5 p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Done For You</div>
              <h2 className="text-2xl font-black tracking-tight mb-3">Let MusicRight Process Your Royalty Setup</h2>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-3">
                We help artists process rights setup, activate royalty channels, fix metadata and splits,
                and make their catalog easier to collect from.
              </p>
              <p className="text-[#555] text-xs">
                Results may vary based on catalog and registration history.
                We don&apos;t guarantee specific earnings.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                <div className="text-white font-bold text-sm mb-1">Royalty Setup — $49 <span className="text-[#555] font-normal text-xs">/ song</span></div>
                <p className="text-[#555] text-xs mb-3">PRO, MLC, SoundExchange registration + ISRC + splits documentation</p>
                <Link href="/check" className="block h-10 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm flex items-center justify-center hover:bg-[#00b894] transition-colors">
                  Set Up My Royalties
                </Link>
              </div>
              <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-white font-bold text-sm">Done For You — $149 <span className="text-[#555] font-normal text-xs">/ song</span></div>
                  <span className="text-[10px] font-bold text-[#00d4aa] border border-[#00d4aa]/30 px-2 py-0.5 rounded-full">72-hr SLA</span>
                </div>
                <p className="text-[#555] text-xs mb-3">We handle everything: all channels, YouTube CID, social, global setup</p>
                <Link href="/check" className="block h-10 rounded-lg border border-[#00d4aa]/40 text-[#00d4aa] font-bold text-sm flex items-center justify-center hover:bg-[#00d4aa]/10 transition-colors">
                  Get Done For You
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
