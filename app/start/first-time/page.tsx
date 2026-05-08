"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SongIntake, WriterInput, BudgetTier } from "../../../lib/types";

const STEPS = [
  { n: 1, label: "Your Song" },
  { n: 2, label: "Ownership" },
  { n: 3, label: "Accounts" },
  { n: 4, label: "Budget" },
];

const DISTRIBUTORS = ["DistroKid", "TuneCore", "CD Baby", "Amuse", "UnitedMasters", "AWAL", "Other", "Not yet"];

const BUDGET_OPTIONS: { value: BudgetTier; label: string; desc: string; icon: string }[] = [
  { value: "minimal",      label: "Keep costs minimal",  desc: "Free tools only. Focus on the essentials first.",      icon: "💡" },
  { value: "balanced",     label: "Balanced",            desc: "Spend a little where it helps. Mix of free + paid.",   icon: "⚖️" },
  { value: "best_coverage",label: "Best coverage",       desc: "Full setup. All royalty channels, including copyright.",icon: "🏆" },
];

type PartialIntake = Omit<SongIntake, "userType" | "accounts"> & {
  accounts: Partial<SongIntake["accounts"]>;
};

export default function FirstTimePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PartialIntake>({
    songTitle: "", artistName: "", email: "",
    releaseStatus: "released",
    distributor: "", hasISRC: undefined,
    writers: [{ name: "", split: undefined, proAffiliation: "" }],
    knowsSplits: undefined, splitTotal: undefined,
    budgetTier: undefined,
    copyrightChoice: undefined,
    accounts: { pro: undefined, mlc: undefined, soundexchange: undefined, distributor: undefined },
  });

  const set = (k: keyof PartialIntake, v: any) => setData(d => ({ ...d, [k]: v }));

  const addWriter = () => set("writers", [...(data.writers ?? []), { name: "", split: undefined, proAffiliation: "" }]);
  const updateWriter = (i: number, field: keyof WriterInput, v: any) =>
    set("writers", (data.writers ?? []).map((w, idx) => idx === i ? { ...w, [field]: v } : w));
  const removeWriter = (i: number) =>
    set("writers", (data.writers ?? []).filter((_, idx) => idx !== i));

  const splitTotal = (data.writers ?? []).reduce((s, w) => s + (Number(w.split) || 0), 0);

  const AccountPill = ({ label, field, provider }: { label: string; field: keyof SongIntake["accounts"]; provider: string }) => (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#111] p-4">
      <div className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-3">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {(["active", "missing", "unknown"] as const).map(s => (
          <button key={s} onClick={() => setData(d => ({ ...d, accounts: { ...d.accounts, [field]: { provider, status: s } } }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              data.accounts[field]?.status === s
                ? s === "active"   ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                : s === "missing"  ? "border-[#ff4757] bg-[#ff4757]/10 text-[#ff4757]"
                :                    "border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800]"
                : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
            }`}>
            {s === "active" ? "✓ I have it" : s === "missing" ? "✗ I don't have it" : "? Not sure"}
          </button>
        ))}
      </div>
    </div>
  );

  const submit = () => {
    const intake: SongIntake = {
      ...data,
      userType: "first_time",
      splitTotal,
      accounts: {
        pro: data.accounts.pro,
        mlc: data.accounts.mlc,
        soundexchange: data.accounts.soundexchange,
        distributor: data.distributor && data.distributor !== "Not yet"
          ? { provider: data.distributor, status: "active" }
          : { provider: undefined, status: "missing" },
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
        {/* Progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s.n ? "bg-[#00d4aa] text-[#080808]" :
                  step === s.n ? "border-2 border-[#00d4aa] text-[#00d4aa]" :
                  "border border-[#2e2e2e] text-[#555]"
                }`}>{step > s.n ? "✓" : s.n}</div>
                <span className={`text-[10px] font-semibold ${step === s.n ? "text-[#00d4aa]" : "text-[#555]"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 mb-4 ${step > s.n ? "bg-[#00d4aa]" : "bg-[#2e2e2e]"}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">

          {/* Step 1 — Your Song */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Tell us about your song</h2>
                <p className="text-[#555] text-sm">Starting from scratch? We&apos;ll map the best setup path for you.</p>
              </div>

              {([
                { field: "songTitle" as const, label: "Song title *", placeholder: "e.g. So Hot (feat. KTTeddy)", type: "text" },
                { field: "artistName" as const, label: "Artist / Stage name *", placeholder: "e.g. KTTeddy", type: "text" },
                { field: "email" as const, label: "Email *", placeholder: "you@example.com", type: "email" },
              ]).map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">{label}</label>
                  <input type={type} value={data[field] as string}
                    onChange={e => set(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]" />
                </div>
              ))}

              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Release status *</label>
                <div className="flex gap-2">
                  {(["released", "unreleased"] as const).map(v => (
                    <button key={v} onClick={() => set("releaseStatus", v)}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold border transition-all ${
                        data.releaseStatus === v ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>{v === "released" ? "Released" : "Not yet released"}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Distributor</label>
                <div className="flex flex-wrap gap-2">
                  {DISTRIBUTORS.map(d => (
                    <button key={d} onClick={() => set("distributor", d)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        data.distributor === d ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>{d}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Does this song have an ISRC?</label>
                <div className="flex gap-2">
                  {([true, false, undefined] as const).map((v, i) => (
                    <button key={i} onClick={() => set("hasISRC", v)}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold border transition-all ${
                        data.hasISRC === v ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>{v === true ? "Yes" : v === false ? "No" : "Not sure"}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(2)} disabled={!data.songTitle || !data.artistName || !data.email}
                className="h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Ownership */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Ownership & splits</h2>
                <p className="text-[#555] text-sm">This is the foundation of every royalty route. We need to know who wrote what.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider">Songwriters</label>
                  <button onClick={addWriter} className="text-[#00d4aa] text-xs font-semibold hover:underline">+ Add writer</button>
                </div>
                <div className="flex flex-col gap-3">
                  {(data.writers ?? []).map((w, i) => (
                    <div key={i} className="rounded-xl border border-[#1a1a1a] bg-[#111] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#555] text-xs font-semibold">Writer {i + 1}</span>
                        {i > 0 && <button onClick={() => removeWriter(i)} className="text-[#555] text-xs hover:text-[#ff4757]">Remove</button>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input placeholder="Full legal name" value={w.name} onChange={e => updateWriter(i, "name", e.target.value)}
                          className="w-full h-10 rounded-lg bg-[#0e0e0e] border border-[#2e2e2e] px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 placeholder:text-[#555]" />
                        <div className="flex gap-2">
                          <input placeholder="Split %" type="number" min="0" max="100" value={w.split ?? ""} onChange={e => updateWriter(i, "split", Number(e.target.value))}
                            className="w-24 h-10 rounded-lg bg-[#0e0e0e] border border-[#2e2e2e] px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 placeholder:text-[#555]" />
                          <input placeholder="PRO affiliation (optional)" value={w.proAffiliation ?? ""} onChange={e => updateWriter(i, "proAffiliation", e.target.value)}
                            className="flex-1 h-10 rounded-lg bg-[#0e0e0e] border border-[#2e2e2e] px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 placeholder:text-[#555]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Split total indicator */}
                {(data.writers ?? []).some(w => w.split !== undefined) && (
                  <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    splitTotal === 100 ? "bg-[#00d4aa]/10 text-[#00d4aa]" :
                    splitTotal > 100   ? "bg-[#ff4757]/10 text-[#ff4757]" :
                                         "bg-[#ffb800]/10 text-[#ffb800]"
                  }`}>
                    <span>Split total: {splitTotal}%</span>
                    {splitTotal === 100 ? " ✓ Complete" : splitTotal > 100 ? " ✗ Over 100%" : " — Remaining: " + (100 - splitTotal) + "%"}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Are splits fully agreed and documented?</label>
                <div className="flex gap-2">
                  {([true, false] as const).map((v) => (
                    <button key={String(v)} onClick={() => set("knowsSplits", v)}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold border transition-all ${
                        data.knowsSplits === v ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>{v ? "Yes, fully agreed" : "Not yet / Not sure"}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Accounts */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Account coverage</h2>
                <p className="text-[#555] text-sm">Do you have accounts with any of these? Select your current status.</p>
              </div>

              <AccountPill label="PRO (ASCAP, BMI, or SESAC)" field="pro" provider="PRO" />
              <AccountPill label="The MLC (mechanical royalties)" field="mlc" provider="The MLC" />
              <AccountPill label="SoundExchange (digital performance)" field="soundexchange" provider="SoundExchange" />

              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Copyright preference</label>
                <div className="flex flex-col gap-2">
                  {([
                    { v: "include" as const, label: "Include copyright registration in my plan" },
                    { v: "not_now" as const, label: "Not now" },
                    { v: "unsure" as const, label: "I'm not sure" },
                  ]).map(({ v, label }) => (
                    <button key={v} onClick={() => set("copyrightChoice", v)}
                      className={`h-10 rounded-lg text-sm font-semibold border transition-all px-4 text-left ${
                        data.copyrightChoice === v ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>{data.copyrightChoice === v ? "✓ " : ""}{label}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(2)} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                <button onClick={() => setStep(4)} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4 — Budget */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Budget preference</h2>
                <p className="text-[#555] text-sm">We&apos;ll tailor your action plan based on how much you want to spend on setup.</p>
              </div>

              <div className="flex flex-col gap-3">
                {BUDGET_OPTIONS.map(({ value, label, desc, icon }) => (
                  <button key={value} onClick={() => set("budgetTier", value)}
                    className={`rounded-xl p-4 text-left border transition-all ${
                      data.budgetTier === value ? "border-[#00d4aa] bg-[#00d4aa]/5" : "border-[#1a1a1a] bg-[#111] hover:border-[#2e2e2e]"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className={`font-bold text-sm ${data.budgetTier === value ? "text-[#00d4aa]" : "text-white"}`}>{label}</div>
                        <div className="text-[#555] text-xs mt-0.5">{desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(3)} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                <button onClick={submit} disabled={!data.budgetTier}
                  className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] disabled:opacity-40 disabled:cursor-not-allowed">
                  See My Royalty Roadmap →
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[#555] text-xs mt-6">
          Your data is private and never sold. MusicRight helps you organize and plan — we don&apos;t guarantee specific earnings.
        </p>
      </div>
    </div>
  );
}
