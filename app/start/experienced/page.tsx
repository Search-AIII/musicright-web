"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SongIntake, AccountStatus } from "../../../lib/types";
import { parseAccountDescription } from "../../../lib/parser";

const PLATFORMS = [
  { key: "pro" as const, label: "PRO (ASCAP / BMI / SESAC)", provider: "PRO" },
  { key: "mlc" as const, label: "The MLC", provider: "The MLC" },
  { key: "soundexchange" as const, label: "SoundExchange", provider: "SoundExchange" },
  { key: "distributor" as const, label: "Distributor", provider: "" },
  { key: "publishingAdmin" as const, label: "Publishing Admin (Songtrust, etc.)", provider: "" },
];

const STATUS_OPTS: { value: AccountStatus; label: string; color: string }[] = [
  { value: "active",                       label: "✓ Active",                      color: "#00d4aa" },
  { value: "has_account_song_status_unknown", label: "~ Account, but song status unknown", color: "#ff6b35" },
  { value: "unknown",                      label: "? Not sure / Maybe",            color: "#ffb800" },
  { value: "missing",                      label: "✗ Don't have it",               color: "#ff4757" },
];

export default function ExperiencedPage() {
  const router = useRouter();
  const [step, setStep] = useState<"song" | "input" | "review">("song");
  const [inputMode, setInputMode] = useState<"freeform" | "manual">("freeform");
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [releaseStatus, setReleaseStatus] = useState<"released" | "unreleased">("released");
  const [freeform, setFreeform] = useState("");
  const [parsing, setParsing] = useState(false);
  const [accounts, setAccounts] = useState<Partial<SongIntake["accounts"]>>({});
  const [providerNames, setProviderNames] = useState<Record<string, string>>({});

  const parseFreeform = () => {
    setParsing(true);
    setTimeout(() => {
      const parsed = parseAccountDescription(freeform);
      setAccounts(parsed);
      setParsing(false);
      setStep("review");
    }, 800);
  };

  const setStatus = (key: keyof SongIntake["accounts"], status: AccountStatus) => {
    setAccounts(a => ({
      ...a,
      [key]: { ...a[key], provider: providerNames[key] || PLATFORMS.find(p => p.key === key)?.provider || key, status },
    }));
  };

  const setProvider = (key: string, value: string) => {
    setProviderNames(p => ({ ...p, [key]: value }));
    setAccounts(a => ({
      ...a,
      [key]: { ...(a as any)[key], provider: value },
    }));
  };

  const submit = () => {
    const intake: SongIntake = {
      userType: "experienced",
      songTitle, artistName, email,
      releaseStatus,
      freeformAccountDescription: freeform,
      accounts: {
        pro: accounts.pro,
        mlc: accounts.mlc,
        soundexchange: accounts.soundexchange,
        distributor: accounts.distributor,
        publishingAdmin: accounts.publishingAdmin,
      },
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mr_intake", JSON.stringify(intake));
    }
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center px-6 py-12">
      <Link href="/start" className="flex items-center gap-2 mb-12">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
        <span className="font-bold text-[15px]">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-lg">
        {/* Song info step */}
        {step === "song" && (
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white mb-1">Tell us about your song</h2>
              <p className="text-[#555] text-sm">Already have accounts? We&apos;ll organize what&apos;s covered and what&apos;s missing.</p>
            </div>

            {([
              { field: "songTitle", set: setSongTitle, value: songTitle, label: "Song title *", placeholder: "e.g. So Hot (feat. KTTeddy)" },
              { field: "artistName", set: setArtistName, value: artistName, label: "Artist / Stage name *", placeholder: "e.g. KTTeddy" },
              { field: "email", set: setEmail, value: email, label: "Email *", placeholder: "you@example.com", type: "email" },
            ]).map(({ field, set: s, value, label, placeholder, type }) => (
              <div key={field} className="mb-4">
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">{label}</label>
                <input type={type || "text"} value={value} onChange={e => s(e.target.value)} placeholder={placeholder}
                  className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]" />
              </div>
            ))}

            <div className="mb-6">
              <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Release status</label>
              <div className="flex gap-2">
                {(["released", "unreleased"] as const).map(v => (
                  <button key={v} onClick={() => setReleaseStatus(v)}
                    className={`flex-1 h-10 rounded-lg text-sm font-semibold border transition-all ${
                      releaseStatus === v ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                    }`}>{v === "released" ? "Released" : "Not yet released"}</button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep("input")} disabled={!songTitle || !artistName || !email}
              className="w-full h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Continue →
            </button>
          </div>
        )}

        {/* Account input step */}
        {step === "input" && (
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white mb-1">Describe your accounts</h2>
              <p className="text-[#555] text-sm">Tell us what you have. We&apos;ll parse it automatically.</p>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-6 p-1 rounded-xl bg-[#111] border border-[#1a1a1a]">
              {([
                { mode: "freeform" as const, label: "Type freely" },
                { mode: "manual" as const, label: "Manual entry" },
              ]).map(({ mode, label }) => (
                <button key={mode} onClick={() => setInputMode(mode)}
                  className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${
                    inputMode === mode ? "bg-[#00d4aa] text-[#080808]" : "text-[#a0a0a0] hover:text-white"
                  }`}>{label}</button>
              ))}
            </div>

            {inputMode === "freeform" ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                    Describe your accounts (type naturally)
                  </label>
                  <textarea
                    rows={5}
                    value={freeform}
                    onChange={e => setFreeform(e.target.value)}
                    placeholder={`For example:\n"I have DistroKid and ASCAP. I think I opened SoundExchange once but not sure if this song is in there. I might have Songtrust."`}
                    className="w-full rounded-xl bg-[#111] border border-[#2e2e2e] px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555] resize-none leading-relaxed"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("song")} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                  <button onClick={parseFreeform} disabled={!freeform.trim() || parsing}
                    className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] disabled:opacity-40">
                    {parsing ? "Parsing..." : "Parse & Review →"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {PLATFORMS.map(({ key, label, provider }) => (
                  <div key={key} className="rounded-xl border border-[#1a1a1a] bg-[#111] p-4">
                    <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-3 block">{label}</label>
                    {!provider && (
                      <input placeholder="Provider name (e.g. DistroKid)" value={providerNames[key] ?? ""}
                        onChange={e => setProvider(key, e.target.value)}
                        className="w-full h-9 rounded-lg bg-[#0e0e0e] border border-[#2e2e2e] px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 placeholder:text-[#555] mb-3" />
                    )}
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTS.map(({ value, label: optLabel, color }) => (
                        <button key={value} onClick={() => setStatus(key, value)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            accounts[key]?.status === value
                              ? "border-current text-white"
                              : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                          }`}
                          style={accounts[key]?.status === value ? { borderColor: color, background: color + "15", color } : {}}>
                          {optLabel}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep("song")} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                  <button onClick={() => setStep("review")} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">
                    Review & Submit →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Review step */}
        {step === "review" && (
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white mb-1">Review your account summary</h2>
              <p className="text-[#555] text-sm">We parsed your description. Adjust anything that looks wrong.</p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {PLATFORMS.map(({ key, label }) => {
                const acct = accounts[key];
                const s = STATUS_OPTS.find(o => o.value === acct?.status);
                return (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-[#1a1a1a] bg-[#111] px-4 py-3">
                    <div>
                      <div className="text-white text-sm font-semibold">{label}</div>
                      {acct?.provider && <div className="text-[#555] text-xs">{acct.provider}</div>}
                    </div>
                    <select
                      value={acct?.status ?? ""}
                      onChange={e => setStatus(key, e.target.value as AccountStatus)}
                      className="bg-[#0e0e0e] border border-[#2e2e2e] rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-none focus:border-[#00d4aa]/50"
                      style={{ color: s?.color ?? "#555" }}>
                      <option value="" disabled>Not mentioned</option>
                      {STATUS_OPTS.map(({ value, label: l }) => (
                        <option key={value} value={value}>{l}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("input")} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Edit</button>
              <button onClick={submit} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">
                See My Rights Review →
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[#555] text-xs mt-6">
          Your data is private and never sold. No passwords collected.
        </p>
      </div>
    </div>
  );
}
