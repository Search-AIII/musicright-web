"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { SongIntake, DiagnosisResult, RoyaltyRouteStatus, AccountStatus } from "../../lib/types";
import { diagnose } from "../../lib/diagnosis";

// ── Score ring ──────────────────────────────────────────────────────────────
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
        <div className="text-xs text-[#555] uppercase tracking-wider font-semibold">Rights Setup Score</div>
        <div className="text-xs font-bold mt-0.5" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

// ── Route badge ─────────────────────────────────────────────────────────────
const ROUTE_CONFIG: Record<RoyaltyRouteStatus, { label: string; color: string; bg: string }> = {
  active:   { label: "Active",    color: "#00d4aa", bg: "#00d4aa15" },
  partial:  { label: "Partial",   color: "#ff6b35", bg: "#ff6b3515" },
  at_risk:  { label: "At Risk",   color: "#ffb800", bg: "#ffb80015" },
  blocked:  { label: "Blocked",   color: "#ff4757", bg: "#ff475715" },
  unknown:  { label: "Unknown",   color: "#a0a0a0", bg: "#a0a0a015" },
};

const ACCT_CONFIG: Record<AccountStatus, { label: string; color: string }> = {
  active:                       { label: "✓ Active",            color: "#00d4aa" },
  has_account_song_status_unknown: { label: "~ Song status unknown", color: "#ff6b35" },
  unknown:                      { label: "? Uncertain",         color: "#ffb800" },
  missing:                      { label: "✗ Missing",           color: "#ff4757" },
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "#ff4757", medium: "#ffb800", low: "#a0a0a0",
};

// ── Fallback intake from URL params (backward compat with /check) ─────────
function intakeFromParams(sp: ReturnType<typeof useSearchParams>): SongIntake {
  const hasPRO = (sp.get("pros") || "").split(",").some(p => ["ASCAP","BMI","SESAC"].includes(p));
  const hasMLC = (sp.get("pros") || "").includes("The MLC");
  const hasSE  = (sp.get("pros") || "").includes("SoundExchange") || sp.get("se") === "Yes";
  const dist   = sp.get("distributor") || "";
  return {
    userType: "experienced",
    songTitle: sp.get("song") || "Your Song",
    artistName: sp.get("artist") || "Your Artist",
    email: "",
    releaseStatus: "released",
    hasISRC: sp.get("isrc") === "Yes",
    accounts: {
      pro:           hasPRO ? { provider: "PRO",          status: "active" }  : undefined,
      mlc:           hasMLC ? { provider: "The MLC",      status: "active" }  : undefined,
      soundexchange: hasSE  ? { provider: "SoundExchange",status: "active" }  : undefined,
      distributor:   dist   ? { provider: dist,           status: "active" }  : undefined,
    },
  };
}

// ── Main results content ─────────────────────────────────────────────────────
function ResultsContent() {
  const sp = useSearchParams();
  const [intake, setIntake] = useState<SongIntake | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    let parsed: SongIntake | null = null;
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("mr_intake") : null;
      if (raw) parsed = JSON.parse(raw) as SongIntake;
    } catch {}
    if (!parsed) parsed = intakeFromParams(sp);
    setIntake(parsed);
    setResult(diagnose(parsed));

    // Fire-and-forget: persist to Supabase via API (non-blocking)
    if (parsed?.email) {
      fetch("/api/mvp-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      }).catch(() => {});
    }
  }, [sp]);

  if (!intake || !result) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin" />
      </div>
    );
  }

  const { score, royaltyRoutes, accountCoverage, actionPlan, gaps, metadataReadiness, activeRouteCount, totalRouteCount } = result;

  const routes = [
    { key: "performance",        label: "Performance",          icon: "🎤", status: royaltyRoutes.performance },
    { key: "mechanical",         label: "Mechanical (MLC)",     icon: "⚙️", status: royaltyRoutes.mechanical },
    { key: "digitalPerformance", label: "Digital Radio (SE)",   icon: "📻", status: royaltyRoutes.digitalPerformance },
    { key: "distribution",       label: "Streaming / Dist.",    icon: "🎵", status: royaltyRoutes.distribution },
    { key: "sync",               label: "Sync / Licensing",     icon: "🎬", status: royaltyRoutes.sync },
  ] as const;

  const coverageRows = [
    { key: "pro",            label: "PRO (ASCAP / BMI / SESAC)",         status: accountCoverage.pro },
    { key: "mlc",            label: "The MLC (Mechanicals)",              status: accountCoverage.mlc },
    { key: "soundexchange",  label: "SoundExchange",                      status: accountCoverage.soundexchange },
    { key: "distributor",    label: "Distributor",                        status: accountCoverage.distributor },
    { key: "publishingAdmin",label: "Publishing Admin",                   status: accountCoverage.publishingAdmin },
    { key: "copyright",      label: "Copyright Registration",             status: accountCoverage.copyright },
  ] as const;

  const missingCount = Object.values(accountCoverage).filter(s => s === "missing").length;
  const atRiskCount  = Object.values(accountCoverage).filter(s => s === "has_account_song_status_unknown" || s === "unknown").length;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Nav */}
      <div className="border-b border-[#111] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <Link href="/start" className="text-[#00d4aa] text-sm font-semibold hover:underline">← Check Another Song</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.2em] mb-3">Royalty Rights Review</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            &quot;{intake.songTitle}&quot;
          </h1>
          <p className="text-[#a0a0a0] text-base">
            by {intake.artistName} · {intake.releaseStatus === "released" ? "Released" : "Unreleased"}
          </p>
        </div>

        {/* ── MODULE 1: Rights Setup Score ── */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 flex items-center justify-center">
            <ScoreRing score={score} />
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            {[
              { label: "Routes Active",    val: `${activeRouteCount} / ${totalRouteCount}`, color: "#00d4aa" },
              { label: "Accounts Missing", val: String(missingCount),   color: "#ff4757" },
              { label: "At Risk / Unsure", val: String(atRiskCount),    color: "#ffb800" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                <div className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-2">{m.label}</div>
                <div className="text-3xl font-black mb-1" style={{ color: m.color }}>{m.val}</div>
              </div>
            ))}
            {/* Metadata readiness */}
            <div className="col-span-3 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
              <div className="text-xs text-[#555] uppercase tracking-wider font-semibold mb-2">Metadata Readiness</div>
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {metadataReadiness === "ready" ? "✓" : metadataReadiness === "partial" ? "~" : "✗"}
                </span>
                <div>
                  <div className="text-sm font-bold" style={{
                    color: metadataReadiness === "ready" ? "#00d4aa" : metadataReadiness === "partial" ? "#ffb800" : "#ff4757"
                  }}>
                    {metadataReadiness === "ready" ? "Ready" : metadataReadiness === "partial" ? "Partial — some data missing" : "Blocked — critical metadata missing"}
                  </div>
                  {gaps.includes("missing_writers") && <div className="text-[#555] text-xs">Writer splits not documented</div>}
                  {gaps.includes("missing_isrc") && <div className="text-[#555] text-xs">ISRC code not assigned</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODULE 2: Account Coverage ── */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#1a1a1a]">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.15em] mb-1">Account Coverage</div>
            <h2 className="text-lg font-black">Your registrations & accounts</h2>
          </div>
          {coverageRows.map(({ key, label, status }) => {
            const cfg = ACCT_CONFIG[status];
            return (
              <div key={key} className="flex items-center justify-between px-6 py-3.5 border-b border-[#111] last:border-0">
                <span className="text-white text-sm font-medium">{label}</span>
                <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>

        {/* ── MODULE 3: Royalty Route Map ── */}
        <div className="mb-8">
          <div className="mb-4">
            <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.15em] mb-1">Royalty Route Map</div>
            <h2 className="text-lg font-black">Where your money flows (or doesn&apos;t)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {routes.map(({ key, label, icon, status }) => {
              const cfg = ROUTE_CONFIG[status];
              return (
                <div key={key} className="rounded-xl border bg-[#0e0e0e] p-4" style={{ borderColor: cfg.color + "30" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                  </div>
                  <div className="text-white text-sm font-semibold">{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MODULE 4: Registration Gaps ── */}
        {gaps.length > 0 && (
          <div className="rounded-2xl border border-[#ff4757]/20 bg-[#ff4757]/5 p-6 mb-8">
            <div className="text-[#ff4757] text-xs font-bold uppercase tracking-[0.15em] mb-2">Registration Gaps</div>
            <div className="flex flex-col gap-2">
              {gaps.map(g => (
                <div key={g} className="flex items-start gap-2 text-sm">
                  <span className="text-[#ff4757] mt-0.5 flex-shrink-0">✗</span>
                  <span className="text-[#a0a0a0]">{gapLabel(g)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE 5: Priority Action Plan ── */}
        {actionPlan.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.15em] mb-1">Priority Action Plan</div>
              <h2 className="text-lg font-black">What to do next — in order of impact</h2>
            </div>
            <div className="flex flex-col gap-3">
              {actionPlan.map((item, i) => (
                <div key={i} className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-white font-bold text-sm">{item.title}</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: PRIORITY_COLOR[item.priority], background: PRIORITY_COLOR[item.priority] + "15" }}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[#a0a0a0] text-xs leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-[#555]">⏱ {item.effort}</span>
                    <span className="text-[#555]">💰 {item.cost}</span>
                    <span className="text-[#00d4aa]">Affects: {item.affects}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE 6: MusicRight Assist Layer ── */}
        <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-6 mb-8">
          <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-[0.15em] mb-2">MusicRight Assist</div>
          <h2 className="text-lg font-black mb-2">Want us to handle this for you?</h2>
          <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">
            Based on your review, you have {actionPlan.filter(a => a.priority === "high").length} high-priority items
            that may affect royalty collection. MusicRight can help process registrations, fix metadata,
            and activate collection channels — so you can focus on making music.
          </p>
          <p className="text-[#555] text-xs">
            Results may vary based on catalog and registration history. We don&apos;t guarantee specific earnings.
          </p>
        </div>

        {/* ── MODULE 7: Conversion CTAs ── */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 flex flex-col">
            <div className="text-white font-bold text-base mb-1">
              Royalty Setup
              <span className="ml-2 text-[#a0a0a0] font-normal text-sm">$49 / song</span>
            </div>
            <p className="text-[#555] text-xs mb-4 leading-relaxed flex-1">
              PRO, MLC, SoundExchange registration + ISRC + splits documentation.
              We process the setup; you keep control.
            </p>
            <Link href="/start" className="h-11 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm flex items-center justify-center hover:bg-[#00b894] transition-colors">
              Set Up My Royalties →
            </Link>
          </div>
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="text-white font-bold text-base">
                Done For You
                <span className="ml-2 text-[#a0a0a0] font-normal text-sm">$149 / song</span>
              </div>
              <span className="text-[10px] font-bold text-[#00d4aa] border border-[#00d4aa]/30 px-2 py-0.5 rounded-full">72-hr SLA</span>
            </div>
            <p className="text-[#555] text-xs mb-4 leading-relaxed flex-1">
              We handle everything: all channels, YouTube Content ID, social media monetization, and global setup.
            </p>
            <Link href="/start" className="h-11 rounded-xl border border-[#00d4aa]/40 text-[#00d4aa] font-bold text-sm flex items-center justify-center hover:bg-[#00d4aa]/10 transition-colors">
              Get Done For You →
            </Link>
          </div>
        </div>

        <p className="text-center text-[#555] text-xs">
          Free · No credit card · Your data is private and never sold.
        </p>
      </div>
    </div>
  );
}

function gapLabel(gap: string): string {
  const MAP: Record<string, string> = {
    missing_writers:                "Writer splits not documented — required for MLC registration and sync licensing",
    split_incomplete:               "Ownership splits don't add up to 100% — may cause registration delays",
    missing_isrc:                   "No ISRC code — required for streaming royalty identification",
    metadata_incomplete:            "Song title or artist name missing",
    missing_pro_account:            "No PRO account (ASCAP / BMI / SESAC) — performance royalties cannot be collected",
    missing_mlc_account:            "Not registered with The MLC — US mechanical royalties from streaming go uncollected",
    missing_soundexchange_account:  "Not registered with SoundExchange — digital radio royalties not collected",
    missing_distributor:            "No distributor on file — streaming distribution may be inactive",
    pro_song_status_unknown:        "PRO account exists but this song may not be registered — verify registration",
    soundexchange_song_status_unknown: "SoundExchange account exists but recording status is unclear — verify",
    copyright_not_started:          "Copyright registration not started",
    copyright_review_needed:        "Copyright status unclear — consider registering for legal protection",
  };
  return MAP[gap] ?? gap;
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
