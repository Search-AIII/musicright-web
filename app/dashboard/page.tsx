"use client";
import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Song {
  id: string;
  title: string;
  artist: string;
  isrc: string | null;
  split: string;
  ascap: boolean;
  bmi: boolean;
  mlc: boolean;
  se: boolean;
  status: "full" | "partial" | "none";
}

interface Leak {
  sev: "critical" | "high" | "medium" | "info";
  title: string;
  detail: string;
  monthly: string | null;
  annual: string;
  icon: string;
}

interface Action {
  priority: "critical" | "high" | "medium";
  title: string;
  sub: string;
  gain: string;
}

interface Transaction {
  source: string;
  type: "credit" | "debit";
  amount: string;
  status: "completed" | "pending" | "processing";
  date: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const SONGS: Song[] = [
  { id: "s1", title: "So Hot (feat. KTTeddy)", artist: "KTTeddy", isrc: "US-XXX-26-001", split: "100%",  ascap: true,  bmi: false, mlc: true,  se: false, status: "partial" },
  { id: "s2", title: "Midnight Drive",         artist: "KTTeddy", isrc: "US-XXX-25-042", split: "70/30", ascap: true,  bmi: true,  mlc: false, se: true,  status: "partial" },
  { id: "s3", title: "Golden Hour",            artist: "KTTeddy", isrc: null,            split: "50/50", ascap: false, bmi: false, mlc: false, se: false, status: "none"    },
  { id: "s4", title: "City Lights",            artist: "KTTeddy", isrc: "US-XXX-24-088", split: "100%",  ascap: true,  bmi: true,  mlc: true,  se: true,  status: "full"    },
  { id: "s5", title: "Summer Rain",            artist: "KTTeddy", isrc: "US-XXX-25-153", split: "60/40", ascap: true,  bmi: false, mlc: true,  se: false, status: "partial" },
];

const LEAKS: Leak[] = [
  { sev: "critical", title: "MLC Not Registered",       detail: "3 songs missing mechanical streaming royalties",  monthly: "$340",  annual: "$4,080", icon: "💿" },
  { sev: "high",     title: "SoundExchange Unlinked",    detail: "2 songs not collecting digital radio royalties",   monthly: "$180",  annual: "$2,160", icon: "🎧" },
  { sev: "high",     title: "Publisher Share Unclaimed", detail: "50% publisher split not assigned on 2 songs",      monthly: null,    annual: "$1,320", icon: "📄" },
  { sev: "medium",   title: "Missing ISRC Code",         detail: '"Golden Hour" blocked from 4 DSPs',               monthly: null,    annual: "Blocked", icon: "🔢" },
  { sev: "info",     title: "BMI Registration Gap",      detail: "3 songs with ASCAP but not BMI",                  monthly: "$80",   annual: "$960",  icon: "📻" },
];

const ACTIONS: Action[] = [
  { priority: "critical", title: "Register 3 songs with The MLC",  sub: "Collect mechanical royalties from Spotify + Apple Music",  gain: "+$340/mo" },
  { priority: "critical", title: "Link SoundExchange account",      sub: "Collect digital radio from Pandora, iHeart, Sirius XM",    gain: "+$180/mo" },
  { priority: "high",     title: "Claim publisher split (2 songs)", sub: 'Assign 50% publisher on "Midnight Drive" & "Golden Hour"', gain: "+$110/mo" },
  { priority: "high",     title: 'Generate ISRC for "Golden Hour"', sub: "ISRC required to distribute on all DSPs",                  gain: "Unblocks"  },
  { priority: "medium",   title: "Register 3 songs with BMI",       sub: "Dual PRO registration maximizes performance royalties",    gain: "+$80/mo"  },
];

const TRANSACTIONS: Transaction[] = [
  { source: "ASCAP",         type: "credit", amount: "$1,840.50", status: "completed",  date: "Apr 12" },
  { source: "The MLC",       type: "credit", amount: "$960.00",   status: "completed",  date: "Apr 10" },
  { source: "Bank Payout",   type: "debit",  amount: "$1,500.00", status: "completed",  date: "Apr 8"  },
  { source: "SoundExchange", type: "credit", amount: "$712.00",   status: "completed",  date: "Apr 5"  },
  { source: "Sync License",  type: "credit", amount: "$200.00",   status: "processing", date: "Mar 28" },
  { source: "The MLC",       type: "credit", amount: "$240.00",   status: "pending",    date: "Mar 25" },
];

const SEV_COLOR: Record<string, string> = {
  critical: "#ff4757", high: "#ffb800", medium: "#ff6b35", info: "#00b4d8",
};

const PRI_COLOR: Record<string, string> = {
  critical: "#ff4757", high: "#ffb800", medium: "#ff6b35",
};

function Dot({ on }: { on: boolean }) {
  return (
    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${on ? "bg-[#00d4aa]" : "bg-[#ff4757]/40 border border-[#ff4757]/50"}`} />
  );
}

function StatusBadge({ status }: { status: Song["status"] }) {
  const map = {
    full:    { label: "Full",    color: "#00d4aa", bg: "#00d4aa15" },
    partial: { label: "Partial", color: "#ffb800", bg: "#ffb80015" },
    none:    { label: "None",    color: "#ff4757", bg: "#ff475715" },
  };
  const s = map[status];
  return (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "wallet" | "actions">("overview");
  const [showPayout, setShowPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");

  const score = 68;
  const scoreColor = score >= 80 ? "#00d4aa" : score >= 60 ? "#ffb800" : "#ff4757";
  const scoreLabel = score >= 80 ? "Healthy" : score >= 60 ? "Needs Attention" : "Critical";
  const annualLeak = 8520;

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* ── SIDEBAR ───────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-56 flex-col fixed top-0 left-0 h-full border-r border-[#1a1a1a] bg-[#0a0a0a] z-20">
        <Link href="/" className="flex items-center gap-2.5 px-5 h-14 border-b border-[#1a1a1a]">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
          <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
        </Link>

        <nav className="flex flex-col gap-0.5 p-3 flex-1 mt-2">
          {[
            { key: "overview", label: "Overview",   icon: "⬡" },
            { key: "catalog",  label: "Catalog",    icon: "♫" },
            { key: "wallet",   label: "Wallet",     icon: "◈" },
            { key: "actions",  label: "Fix Actions", icon: "⚡" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as typeof activeTab)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
                activeTab === item.key
                  ? "bg-[#00d4aa]/10 text-[#00d4aa]"
                  : "text-[#555] hover:text-[#a0a0a0] hover:bg-[#111]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Audit score in sidebar */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="rounded-xl bg-[#111] border border-[#1a1a1a] p-4">
            <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">Rights Score</div>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-sm font-black"
                style={{ borderColor: scoreColor, color: scoreColor }}
              >
                {score}
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: scoreColor }}>{scoreLabel}</div>
                <div className="text-[#555] text-[10px]">of 100</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-white capitalize">{activeTab}</h1>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ff4757]/10 border border-[#ff4757]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4757]" />
              <span className="text-[#ff4757] text-[10px] font-bold uppercase tracking-wide">
                ${annualLeak.toLocaleString()} annual leak detected
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/audit" className="h-8 px-3 rounded-lg bg-[#00d4aa] text-[#080808] text-xs font-bold hover:bg-[#00b894] transition-colors">
              Fix all →
            </Link>
            <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center text-xs font-bold text-[#00d4aa]">
              K
            </div>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto">

          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              {/* Metrics row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Available Balance",  val: "$4,760.32", sub: "+23% YTD",        color: "#00d4aa" },
                  { label: "Annual Revenue Leak", val: `$${annualLeak.toLocaleString()}`, sub: "5 gaps found", color: "#ff4757" },
                  { label: "Songs Tracked",       val: "5",         sub: "4 need fixes",    color: "#ffb800" },
                  { label: "Active PROs",         val: "2 / 4",     sub: "ASCAP + MLC only", color: "#a0a0a0" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4">
                    <div className="text-[#555] text-xs font-medium mb-2">{m.label}</div>
                    <div className="text-xl font-black" style={{ color: m.color }}>{m.val}</div>
                    <div className="text-[#555] text-xs mt-1">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Revenue leak alert cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white">Revenue Leaks</h2>
                  <span className="text-[#555] text-xs">{LEAKS.length} issues found</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LEAKS.map((l) => (
                    <div
                      key={l.title}
                      className="rounded-xl border p-4 bg-[#0e0e0e] flex flex-col gap-2"
                      style={{ borderColor: SEV_COLOR[l.sev] + "25" }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: SEV_COLOR[l.sev] }}
                          >
                            {l.icon} {l.sev}
                          </span>
                          <div className="text-white text-sm font-semibold mt-0.5">{l.title}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-black" style={{ color: SEV_COLOR[l.sev] }}>{l.annual}</div>
                          {l.monthly && <div className="text-[#555] text-[10px]">{l.monthly}/mo</div>}
                        </div>
                      </div>
                      <p className="text-[#555] text-xs leading-relaxed">{l.detail}</p>
                      <button
                        className="mt-1 h-7 rounded-md text-xs font-bold transition-all"
                        style={{
                          background: SEV_COLOR[l.sev] + "15",
                          color: SEV_COLOR[l.sev],
                          border: `1px solid ${SEV_COLOR[l.sev]}30`,
                        }}
                      >
                        Fix this →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white">Recent Royalties</h2>
                  <button onClick={() => setActiveTab("wallet")} className="text-[#00d4aa] text-xs hover:underline">
                    See all →
                  </button>
                </div>
                <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
                  {TRANSACTIONS.slice(0, 4).map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#111] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${tx.type === "credit" ? "bg-[#00d4aa]" : "bg-[#ff4757]"}`} />
                        <div>
                          <div className="text-white text-sm font-medium">{tx.source}</div>
                          <div className="text-[#555] text-xs">{tx.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                            tx.status === "completed" ? "bg-[#00d4aa]/10 text-[#00d4aa]" :
                            tx.status === "processing" ? "bg-[#00b4d8]/10 text-[#00b4d8]" :
                            "bg-[#ffb800]/10 text-[#ffb800]"
                          }`}
                        >
                          {tx.status}
                        </span>
                        <span className={`text-sm font-bold ${tx.type === "credit" ? "text-[#00d4aa]" : "text-[#ff4757]"}`}>
                          {tx.type === "credit" ? "+" : "-"}{tx.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ CATALOG TAB ═══ */}
          {activeTab === "catalog" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Song Catalog ({SONGS.length} songs)</h2>
                <button className="h-8 px-3 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-xs font-semibold hover:border-[#00d4aa]/40 hover:text-[#00d4aa] transition-all">
                  + Add song
                </button>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
                        {["Song", "ISRC", "Split", "ASCAP", "BMI", "MLC", "SE", "Status"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-[#555] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SONGS.map((s) => (
                        <tr key={s.id} className="border-b border-[#111] hover:bg-[#111] transition-colors group">
                          <td className="px-4 py-3">
                            <div className="text-white font-medium text-sm truncate max-w-[180px]">{s.title}</div>
                            <div className="text-[#555] text-xs">{s.artist}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[11px] text-[#a0a0a0]">{s.isrc ?? <span className="text-[#ff4757]">—</span>}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[#a0a0a0] text-xs font-semibold">{s.split}</span>
                          </td>
                          <td className="px-4 py-3"><Dot on={s.ascap} /></td>
                          <td className="px-4 py-3"><Dot on={s.bmi} /></td>
                          <td className="px-4 py-3"><Dot on={s.mlc} /></td>
                          <td className="px-4 py-3"><Dot on={s.se} /></td>
                          <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-[#555]">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00d4aa]" /> Registered</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ff4757]/40 border border-[#ff4757]/50" /> Not registered</div>
                <span className="ml-auto">SE = SoundExchange</span>
              </div>
            </div>
          )}

          {/* ═══ WALLET TAB ═══ */}
          {activeTab === "wallet" && (
            <div className="flex flex-col gap-6">
              {/* Balance hero */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)" }}>
                <div className="p-6">
                  <div className="text-[rgba(0,0,0,0.5)] text-xs font-bold uppercase tracking-wider mb-1">Available Balance</div>
                  <div className="text-[#080808] text-5xl font-black mb-1">$4,760.32</div>
                  <div className="text-[rgba(0,0,0,0.5)] text-sm">$1,240.00 pending</div>
                  <div className="flex gap-3 mt-5">
                    {["⚡ Instant Payout", "+ Add Bank", "⟳ Payment Link"].map((btn) => (
                      <button
                        key={btn}
                        onClick={() => btn.includes("Payout") && setShowPayout(true)}
                        className="flex-1 h-9 rounded-lg bg-white/90 text-[#080808] text-xs font-bold hover:bg-white transition-colors"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div>
                <h2 className="text-sm font-bold text-white mb-3">Royalty Transactions</h2>
                <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] overflow-hidden">
                  {TRANSACTIONS.map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3.5 border-b border-[#111] last:border-0 hover:bg-[#111] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                          tx.type === "credit" ? "bg-[#00d4aa]/10 text-[#00d4aa]" : "bg-[#ff4757]/10 text-[#ff4757]"
                        }`}>
                          {tx.type === "credit" ? "↓" : "↑"}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{tx.source}</div>
                          <div className="text-[#555] text-xs">{tx.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          tx.status === "completed" ? "bg-[#00d4aa]/10 text-[#00d4aa]" :
                          tx.status === "processing" ? "bg-[#00b4d8]/10 text-[#00b4d8]" :
                          "bg-[#ffb800]/10 text-[#ffb800]"
                        }`}>
                          {tx.status}
                        </span>
                        <span className={`text-sm font-bold ${tx.type === "credit" ? "text-[#00d4aa]" : "text-[#ff4757]"}`}>
                          {tx.type === "credit" ? "+" : "-"}{tx.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source breakdown */}
              <div>
                <h2 className="text-sm font-bold text-white mb-3">By Source</h2>
                <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4 flex flex-col gap-3">
                  {[
                    { name: "ASCAP",         pct: 68, amt: "$3,240", color: "#00d4aa" },
                    { name: "The MLC",        pct: 25, amt: "$1,200", color: "#00b4d8" },
                    { name: "SoundExchange",  pct: 7,  amt: "$320",   color: "#ffb800" },
                  ].map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#a0a0a0] font-medium">{s.name}</span>
                        <span className="text-white font-bold">{s.amt}</span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ ACTIONS TAB ═══ */}
          {activeTab === "actions" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Fix Actions</h2>
                <div className="text-[#555] text-xs">
                  Fix all → <span className="text-[#00d4aa] font-bold">+$730/mo</span>
                </div>
              </div>

              {/* Audit score card */}
              <div className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 flex items-center gap-5">
                <div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: scoreColor }}
                >
                  <div className="text-center">
                    <div className="text-xl font-black" style={{ color: scoreColor }}>{score}</div>
                    <div className="text-[10px] text-[#555] -mt-1">/100</div>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-base mb-0.5">Rights Health: {scoreLabel}</div>
                  <div className="text-[#555] text-sm">Complete all actions below to reach 100/100 and unlock full royalty collection.</div>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                  <div className="text-[#ff4757] text-xl font-black">${annualLeak.toLocaleString()}</div>
                  <div className="text-[#555] text-xs">annual leak</div>
                </div>
              </div>

              {ACTIONS.map((a, i) => (
                <div key={i} className="rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] p-4 flex items-center gap-4 hover:border-[#2e2e2e] transition-colors">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ background: PRI_COLOR[a.priority] + "15", color: PRI_COLOR[a.priority] }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{a.title}</span>
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{ background: PRI_COLOR[a.priority] + "15", color: PRI_COLOR[a.priority] }}
                      >
                        {a.priority}
                      </span>
                    </div>
                    <p className="text-[#555] text-xs mt-0.5 truncate">{a.sub}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[#00d4aa] text-xs font-bold hidden sm:block">{a.gain}</span>
                    <button
                      className="h-7 px-3 rounded-md bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-bold hover:bg-[#00d4aa]/20 transition-colors"
                    >
                      Fix →
                    </button>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-dashed border-[#2e2e2e] p-5 text-center">
                <div className="text-[#555] text-sm mb-3">Want us to fix everything for you?</div>
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-[#00d4aa] text-[#080808] text-sm font-bold hover:bg-[#00b894] transition-colors"
                >
                  Book full recovery — $149 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── PAYOUT MODAL ──────────────────────────────────────────────────────── */}
      {showPayout && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#111] border border-[#2e2e2e] rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">Instant Payout</h3>
              <button onClick={() => setShowPayout(false)} className="text-[#555] hover:text-white transition-colors">✕</button>
            </div>
            <div className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">Amount</div>
            <div className="flex items-center bg-[#0a0a0a] border border-[#2e2e2e] rounded-xl px-4 mb-2">
              <span className="text-[#555] text-2xl font-bold mr-2">$</span>
              <input
                className="flex-1 bg-transparent text-white text-3xl font-black py-4 focus:outline-none"
                placeholder="0.00"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
              />
            </div>
            <div className="text-[#555] text-xs mb-6">Available: $4,760.32</div>
            <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2e2e2e] rounded-xl p-3 mb-6">
              <span className="text-sm">💳</span>
              <span className="text-[#a0a0a0] text-sm">Chase ••4242 · Instant (1–2 min)</span>
            </div>
            <button
              className="w-full h-12 rounded-xl font-bold text-[#080808] text-base transition-colors"
              style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)" }}
              onClick={() => { setShowPayout(false); setPayoutAmount(""); }}
            >
              ⚡ Send Instantly
            </button>
            <p className="text-center text-[#555] text-xs mt-3">1.5% instant fee · Stripe secured</p>
          </div>
        </div>
      )}
    </div>
  );
}
