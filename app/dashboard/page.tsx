"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase-browser";

// ─── API response types ───────────────────────────────────────────────────────
interface UserSong {
  id: string;
  songTitle: string;
  artistName: string;
  releaseStatus: string;
  createdAt: string;
  score: number;
  status: "full" | "partial" | "none";
  hasISRC: boolean;
  distributor: string | null;
  gaps: Array<{ code: string; title: string; severity: string }>;
  accountCoverage: Record<string, string>;
  actions: Array<{ title: string; description: string }>;
}

interface Leak {
  code: string;
  title: string;
  songCount: number;
  monthlyLeak: number | null;
  annualLeak: number | null;
}

interface DashboardData {
  songs: UserSong[];
  leaks: Leak[];
  actions: Array<{ title: string; description: string }>;
  totalMonthlyLeak: number;
  totalAnnualLeak: number;
  overallScore: number | null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UserSong["status"] }) {
  const map = {
    full:    { label: "Full Setup",   color: "#00d4aa", bg: "#00d4aa15" },
    partial: { label: "Partial",      color: "#ffb800", bg: "#ffb80015" },
    none:    { label: "Not Set Up",   color: "#ff4757", bg: "#ff475715" },
  };
  const s = map[status];
  return (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

function Dot({ on }: { on: boolean }) {
  return <div className={`w-2 h-2 rounded-full flex-shrink-0 ${on ? "bg-[#00d4aa]" : "bg-[#1a1a1a] border border-[#2e2e2e]"}`} />;
}

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#00d4aa" : score >= 40 ? "#ffb800" : "#ff4757";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a1a" strokeWidth={size * 0.08} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.08}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-black text-xs" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center text-3xl mb-6">🎵</div>
      <h2 className="text-white text-xl font-black mb-2">No songs checked yet</h2>
      <p className="text-[#555] text-sm max-w-xs mb-8 leading-relaxed">
        Run a free Song Check to see your Royalty Health Score and find out what&#39;s blocking your earnings.
      </p>
      <Link href="/start" className="h-11 px-6 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors">
        Check My First Song →
      </Link>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "wallet" | "actions">("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [userDisplay, setUserDisplay] = useState<{ name: string; avatar?: string; initial: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = "/auth/login"; return; }
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Artist";
      setUserDisplay({ name, avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture, initial: name[0].toUpperCase() });
    });

    fetch("/api/user/songs")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData({ songs: [], leaks: [], actions: [], totalMonthlyLeak: 0, totalAnnualLeak: 0, overallScore: null }))
      .finally(() => setLoading(false));
  }, []);

  async function handleSignOut() {
    await createClient().auth.signOut();
    window.location.href = "/";
  }

  const score = data?.overallScore ?? null;
  const scoreColor = !score ? "#555" : score >= 80 ? "#00d4aa" : score >= 60 ? "#ffb800" : "#ff4757";
  const scoreLabel = !score ? "—" : score >= 80 ? "Healthy" : score >= 60 ? "Needs Attention" : "Critical";

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* ── SIDEBAR ───────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-56 flex-col fixed top-0 left-0 h-full border-r border-[#1a1a1a] bg-[#0a0a0a] z-20">
        <Link href="/" className="flex items-center gap-2.5 px-5 h-14 border-b border-[#1a1a1a]">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
          <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
        </Link>

        <nav className="flex flex-col gap-0.5 p-3 flex-1 mt-2">
          {([
            { key: "overview", label: "Overview",    icon: "◈" },
            { key: "catalog",  label: "Catalog",     icon: "♫" },
            { key: "wallet",   label: "Wallet",      icon: "◇" },
            { key: "actions",  label: "Fix Actions", icon: "⚡" },
          ] as const).map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
                activeTab === item.key ? "bg-[#00d4aa]/10 text-[#00d4aa]" : "text-[#555] hover:text-[#a0a0a0] hover:bg-[#111]"
              }`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="rounded-xl bg-[#111] border border-[#1a1a1a] p-4">
            <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">Rights Score</div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-sm font-black"
                style={{ borderColor: scoreColor, color: scoreColor }}>
                {score ?? "—"}
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: scoreColor }}>{scoreLabel}</div>
                <div className="text-[#555] text-[10px]">of 100</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-white capitalize">{activeTab}</h1>
            {data && data.totalAnnualLeak > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ff4757]/10 border border-[#ff4757]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff4757]" />
                <span className="text-[#ff4757] text-[10px] font-bold uppercase tracking-wide">
                  ~${data.totalAnnualLeak.toLocaleString()} estimated annual gap
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/start" className="h-8 px-3 rounded-lg bg-[#00d4aa] text-[#080808] text-xs font-bold hover:bg-[#00b894] transition-colors">
              + New Check
            </Link>
            <button onClick={handleSignOut} className="text-[#555] text-xs hover:text-white transition-colors hidden sm:block">Sign out</button>
            {userDisplay?.avatar
              ? <img src={userDisplay.avatar} alt={userDisplay.name} className="w-7 h-7 rounded-full border border-[#2e2e2e]" /> // eslint-disable-line @next/next/no-img-element
              : <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center text-xs font-bold text-[#00d4aa]">{userDisplay?.initial ?? "?"}</div>
            }
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin" />
          </div>
        ) : !data || data.songs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-6 max-w-5xl mx-auto">

            {/* ═══ OVERVIEW ═══ */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-6">
                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Rights Score",       val: score ? `${score}/100` : "—",              sub: scoreLabel,                              color: scoreColor },
                    { label: "Est. Annual Gap",     val: `~$${data.totalAnnualLeak.toLocaleString()}`, sub: "based on detected gaps",              color: "#ff4757" },
                    { label: "Songs Tracked",       val: String(data.songs.length),                  sub: `${data.songs.filter(s => s.status !== "full").length} need attention`, color: "#ffb800" },
                    { label: "Gaps Found",          val: String(data.leaks.length),                  sub: "across your catalog",                  color: "#a0a0a0" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4">
                      <div className="text-[#555] text-xs font-medium mb-2">{m.label}</div>
                      <div className="text-xl font-black" style={{ color: m.color }}>{m.val}</div>
                      <div className="text-[#555] text-xs mt-1">{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Leaks */}
                {data.leaks.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-white">Registration Gaps</h2>
                      <span className="text-[#555] text-xs">{data.leaks.length} gaps · estimated impact</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {data.leaks.slice(0, 6).map((l) => (
                        <div key={l.code} className="rounded-xl border border-[#ff4757]/20 bg-[#0e0e0e] p-4 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-white text-sm font-semibold leading-snug">{l.title}</div>
                            {l.annualLeak && (
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs font-black text-[#ff4757">~${l.annualLeak.toLocaleString()}/yr</div>
                              </div>
                            )}
                          </div>
                          <p className="text-[#555] text-xs">{l.songCount} song{l.songCount > 1 ? "s" : ""} affected</p>
                          <button onClick={() => setActiveTab("actions")}
                            className="mt-1 h-7 rounded-md text-xs font-bold bg-[#ff4757]/10 text-[#ff4757] border border-[#ff4757]/20 hover:bg-[#ff4757]/20 transition-colors">
                            View fix →
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[#555] text-[11px] mt-3">
                      ⚠ Estimates based on industry averages. Actual amounts depend on your catalog size and distribution.
                    </p>
                  </div>
                )}

                {/* Recent songs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-white">Recent Checks</h2>
                    <button onClick={() => setActiveTab("catalog")} className="text-[#00d4aa] text-xs hover:underline">See all →</button>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
                    {data.songs.slice(0, 4).map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 border-b border-[#111] last:border-0 hover:bg-[#111] transition-colors">
                        <div className="flex items-center gap-3">
                          <ScoreRing score={s.score} size={36} />
                          <div>
                            <div className="text-white text-sm font-medium">{s.songTitle}</div>
                            <div className="text-[#555] text-xs">{s.artistName}</div>
                          </div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ CATALOG ═══ */}
            {activeTab === "catalog" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Song Catalog ({data.songs.length})</h2>
                  <Link href="/start" className="h-8 px-3 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-xs font-semibold hover:border-[#00d4aa]/40 hover:text-[#00d4aa] transition-all">
                    + Check new song
                  </Link>
                </div>

                <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
                          {["Song", "Score", "ISRC", "PRO", "MLC", "SE", "Distributor", "Status"].map((h) => (
                            <th key={h} className="text-left px-4 py-2.5 text-[#555] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.songs.map((s) => (
                          <tr key={s.id} className="border-b border-[#111] hover:bg-[#111] transition-colors">
                            <td className="px-4 py-3">
                              <div className="text-white font-medium text-sm truncate max-w-[160px]">{s.songTitle}</div>
                              <div className="text-[#555] text-xs">{s.artistName}</div>
                            </td>
                            <td className="px-4 py-3">
                              <ScoreRing score={s.score} size={32} />
                            </td>
                            <td className="px-4 py-3"><Dot on={s.hasISRC} /></td>
                            <td className="px-4 py-3"><Dot on={s.accountCoverage["PRO"] === "active"} /></td>
                            <td className="px-4 py-3"><Dot on={s.accountCoverage["MLC"] === "active"} /></td>
                            <td className="px-4 py-3"><Dot on={s.accountCoverage["SoundExchange"] === "active"} /></td>
                            <td className="px-4 py-3">
                              <span className="text-[#a0a0a0] text-xs">{s.distributor ?? <span className="text-[#555]">—</span>}</span>
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#555]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00d4aa]" /> Registered</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#2e2e2e]" /> Not registered</div>
                  <span className="ml-auto">SE = SoundExchange</span>
                </div>
              </div>
            )}

            {/* ═══ WALLET ═══ */}
            {activeTab === "wallet" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center text-3xl mb-6">◇</div>
                <h2 className="text-white text-xl font-black mb-2">Royalty Wallet — Coming Soon</h2>
                <p className="text-[#555] text-sm max-w-sm mb-4 leading-relaxed">
                  Connect your PRO, MLC, SoundExchange, and distributor accounts to track all incoming royalty payments in one place.
                </p>
                <div className="flex flex-col gap-2 text-xs text-[#555] mb-8">
                  {["ASCAP / BMI / SESAC", "The MLC", "SoundExchange", "DistroKid / TuneCore / CD Baby"].map((p) => (
                    <div key={p} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#2e2e2e]" />{p}</div>
                  ))}
                </div>
                <div className="h-9 px-5 rounded-lg border border-dashed border-[#2e2e2e] text-[#555] text-sm flex items-center">
                  Notify me when available
                </div>
              </div>
            )}

            {/* ═══ ACTIONS ═══ */}
            {activeTab === "actions" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Fix Actions</h2>
                  {data.totalMonthlyLeak > 0 && (
                    <div className="text-[#555] text-xs">Fix all → <span className="text-[#00d4aa] font-bold">~+${data.totalMonthlyLeak.toLocaleString()}/mo</span></div>
                  )}
                </div>

                {/* Score card */}
                {score && (
                  <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: scoreColor }}>
                      <div className="text-center">
                        <div className="text-xl font-black" style={{ color: scoreColor }}>{score}</div>
                        <div className="text-[10px] text-[#555] -mt-1">/100</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-base mb-0.5">Rights Score: {scoreLabel}</div>
                      <div className="text-[#555] text-sm">Complete the actions below to improve your score and unlock more royalty collection.</div>
                    </div>
                    {data.totalAnnualLeak > 0 && (
                      <div className="ml-auto text-right hidden sm:block">
                        <div className="text-[#ff4757] text-xl font-black">~${data.totalAnnualLeak.toLocaleString()}</div>
                        <div className="text-[#555] text-xs">estimated annual gap</div>
                      </div>
                    )}
                  </div>
                )}

                {data.actions.length > 0 ? (
                  data.actions.map((a, i) => (
                    <div key={i} className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4 flex items-center gap-4 hover:border-[#2e2e2e] transition-colors">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black bg-[#00d4aa]/10 text-[#00d4aa]">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm">{a.title}</div>
                        <p className="text-[#555] text-xs mt-0.5 line-clamp-1">{a.description}</p>
                      </div>
                      <Link href="/auth/login?plan=setup"
                        className="h-7 px-3 rounded-md bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-bold hover:bg-[#00d4aa]/20 transition-colors flex-shrink-0">
                        Fix →
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[#555] text-sm">No actions — run a song check first.</div>
                )}

                <div className="rounded-xl border border-dashed border-[#2e2e2e] p-5 text-center">
                  <div className="text-[#555] text-sm mb-3">Want us to handle everything for you?</div>
                  <Link href="/auth/login?plan=dfy"
                    className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-[#00d4aa] text-[#080808] text-sm font-bold hover:bg-[#00b894] transition-colors">
                    Done For You — $149/song →
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
