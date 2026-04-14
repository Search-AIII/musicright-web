"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PROS = ["ASCAP", "BMI", "SESAC", "SoundExchange", "The MLC", "Harry Fox Agency", "None yet"];
const DISTRIBUTORS = ["DistroKid", "TuneCore", "CD Baby", "Amuse", "UnitedMasters", "Direct / None", "Other"];

const STEPS = [
  { n: 1, label: "Artist" },
  { n: 2, label: "PROs" },
  { n: 3, label: "Catalog" },
  { n: 4, label: "Audit" },
];

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    stageName: "",
    realName: "",
    email: "",
    pros: [] as string[],
    distributor: "",
    songCount: "",
    topSong: "",
  });
  const [loading, setLoading] = useState(false);

  const togglePro = (pro: string) => {
    setData((d) => ({
      ...d,
      pros: d.pros.includes(pro) ? d.pros.filter((p) => p !== pro) : [...d.pros, pro],
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const runAudit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
        <span className="font-bold text-[15px]">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.n
                      ? "bg-[#00d4aa] text-[#080808]"
                      : step === s.n
                      ? "border-2 border-[#00d4aa] text-[#00d4aa]"
                      : "border border-[#2e2e2e] text-[#555]"
                  }`}
                >
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className={`text-[10px] font-semibold ${step === s.n ? "text-[#00d4aa]" : "text-[#555]"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 ${step > s.n ? "bg-[#00d4aa]" : "bg-[#2e2e2e]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">

          {/* Step 1 — Artist info */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Your artist profile</h2>
                <p className="text-[#555] text-sm">We&apos;ll use this to search PRO databases for your catalog.</p>
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                  Stage / Artist name *
                </label>
                <input
                  className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]"
                  placeholder="e.g. KTTeddy"
                  value={data.stageName}
                  onChange={(e) => setData((d) => ({ ...d, stageName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                  Legal name
                </label>
                <input
                  className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]"
                  placeholder="For copyright registrations"
                  value={data.realName}
                  onChange={(e) => setData((d) => ({ ...d, realName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                />
              </div>
              <button
                onClick={next}
                disabled={!data.stageName || !data.email}
                className="h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — PROs */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Current PRO memberships</h2>
                <p className="text-[#555] text-sm">Select every org you&apos;re already registered with.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROS.map((pro) => (
                  <button
                    key={pro}
                    onClick={() => togglePro(pro)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      data.pros.includes(pro)
                        ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                        : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                    }`}
                  >
                    {data.pros.includes(pro) ? "✓ " : ""}{pro}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                  Distributor
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISTRIBUTORS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setData((s) => ({ ...s, distributor: d }))}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        data.distributor === d
                          ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                          : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={back} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold hover:border-[#3e3e3e]">
                  ← Back
                </button>
                <button onClick={next} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Catalog */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Your catalog</h2>
                <p className="text-[#555] text-sm">Tell us about your songs so we can audit each one.</p>
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                  How many songs do you have on streaming?
                </label>
                <div className="flex flex-wrap gap-2">
                  {["1–5", "6–15", "16–30", "31–50", "50+"].map((n) => (
                    <button
                      key={n}
                      onClick={() => setData((d) => ({ ...d, songCount: n }))}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        data.songCount === n
                          ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                          : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">
                  Your most-streamed song
                </label>
                <input
                  className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]"
                  placeholder="Song title"
                  value={data.topSong}
                  onChange={(e) => setData((d) => ({ ...d, topSong: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={back} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">
                  ← Back
                </button>
                <button onClick={next} disabled={!data.songCount} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Run audit */}
          {step === 4 && (
            <div className="flex flex-col gap-5 items-center text-center">
              {loading ? (
                <>
                  <div className="w-16 h-16 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin" />
                  <h2 className="text-xl font-black text-white">Scanning your catalog…</h2>
                  <p className="text-[#555] text-sm">
                    Checking ASCAP, BMI, The MLC, SoundExchange, ISRC databases…
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 flex items-center justify-center text-2xl">
                    🔍
                  </div>
                  <h2 className="text-xl font-black text-white">Ready to audit {data.stageName}?</h2>
                  <p className="text-[#555] text-sm">
                    We&apos;ll scan all major PROs, identify missing registrations,
                    and calculate your annual revenue leak.
                  </p>
                  <div className="w-full rounded-xl border border-[#1a1a1a] bg-[#111] p-4 text-left">
                    <div className="text-[#555] text-xs font-bold uppercase tracking-wider mb-3">Audit summary</div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "Artist", val: data.stageName },
                        { label: "PROs registered", val: data.pros.length === 0 ? "None" : data.pros.join(", ") },
                        { label: "Distributor", val: data.distributor || "Not specified" },
                        { label: "Catalog size", val: data.songCount + " songs" },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between text-sm">
                          <span className="text-[#555]">{r.label}</span>
                          <span className="text-white font-medium">{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full mt-2">
                    <button onClick={back} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">
                      ← Edit
                    </button>
                    <button
                      onClick={runAudit}
                      className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors"
                    >
                      Run audit →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-[#555] text-xs mt-6">
          Your data is encrypted and never sold.{" "}
          <Link href="/" className="text-[#00d4aa] hover:underline">Privacy policy</Link>
        </p>
      </div>
    </div>
  );
}
