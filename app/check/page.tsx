"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PROS = ["ASCAP", "BMI", "SESAC", "SoundExchange", "The MLC", "None yet"];
const DISTRIBUTORS = ["DistroKid", "TuneCore", "CD Baby", "Amuse", "UnitedMasters", "Direct / None", "Other"];

const STEPS = [
  { n: 1, label: "Your Song" },
  { n: 2, label: "Current Setup" },
  { n: 3, label: "Channels" },
  { n: 4, label: "Run Check" },
];

function computeScore(data: {
  pros: string[];
  distributor: string;
  hasISRC: string;
  hasYouTubeCID: string;
  hasTikTok: string;
  hasSoundExchange: string;
  hasSplitsDoc: string;
}): number {
  let score = 100;
  const hasPRO = data.pros.some((p) => ["ASCAP", "BMI", "SESAC"].includes(p));
  if (!hasPRO)                                                   score -= 20;
  if (!data.pros.includes("The MLC"))                            score -= 15;
  if (!data.distributor || data.distributor === "Direct / None") score -= 10;
  if (data.hasISRC === "No")     score -= 12;
  else if (data.hasISRC === "Unsure") score -= 6;
  const hasSE = data.pros.includes("SoundExchange") || data.hasSoundExchange === "Yes";
  if (!hasSE)                    score -= 10;
  if (data.hasYouTubeCID === "No")    score -= 8;
  else if (data.hasYouTubeCID === "Unsure") score -= 4;
  if (data.hasTikTok === "No")        score -= 6;
  else if (data.hasTikTok === "Unsure") score -= 3;
  if (data.hasSplitsDoc === "No")     score -= 9;
  else if (data.hasSplitsDoc === "Unsure") score -= 4;
  return Math.max(0, Math.min(100, score));
}

export default function CheckPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    songTitle: "",
    artistName: "",
    email: "",
    pros: [] as string[],
    distributor: "",
    hasISRC: "",
    hasYouTubeCID: "",
    hasTikTok: "",
    hasSoundExchange: "",
    hasSplitsDoc: "",
  });
  const [loading, setLoading] = useState(false);

  const togglePro = (pro: string) =>
    setData((d) => ({ ...d, pros: d.pros.includes(pro) ? d.pros.filter((p) => p !== pro) : [...d.pros, pro] }));

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const runCheck = async () => {
    setLoading(true);
    const score = computeScore(data);
    await new Promise((r) => setTimeout(r, 2000));
    const params = new URLSearchParams({
      song: data.songTitle,
      artist: data.artistName,
      score: String(score),
      pros: data.pros.join(","),
      distributor: data.distributor,
      isrc: data.hasISRC,
      yt: data.hasYouTubeCID,
      tt: data.hasTikTok,
      se: data.hasSoundExchange,
      splits: data.hasSplitsDoc,
    });
    router.push(`/results?${params.toString()}`);
  };

  const RadioGroup = ({
    label,
    field,
    options = ["Yes", "No", "Unsure"],
  }: {
    label: string;
    field: keyof typeof data;
    options?: string[];
  }) => (
    <div>
      <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setData((d) => ({ ...d, [field]: opt }))}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
              data[field] === opt
                ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-12">
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s.n ? "bg-[#00d4aa] text-[#080808]" :
                  step === s.n ? "border-2 border-[#00d4aa] text-[#00d4aa]" :
                  "border border-[#2e2e2e] text-[#555]"
                }`}>
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

        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">

          {/* Step 1 — Your Song */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Start with one song</h2>
                <p className="text-[#555] text-sm">We&apos;ll review your royalty setup and build your earning roadmap.</p>
              </div>
              {([
                { field: "songTitle" as const,  label: "Song title *",          placeholder: "e.g. So Hot (feat. KTTeddy)" },
                { field: "artistName" as const, label: "Artist / Stage name *", placeholder: "e.g. KTTeddy" },
                { field: "email" as const,      label: "Email *",               placeholder: "you@example.com", type: "email" },
              ]).map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">{label}</label>
                  <input
                    type={type || "text"}
                    className="w-full h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors placeholder:text-[#555]"
                    placeholder={placeholder}
                    value={data[field]}
                    onChange={(e) => setData((d) => ({ ...d, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <button
                onClick={next}
                disabled={!data.songTitle || !data.artistName || !data.email}
                className="h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Current Setup */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Current royalty setup</h2>
                <p className="text-[#555] text-sm">Tell us what&apos;s already in place so we can identify gaps.</p>
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">PRO memberships</label>
                <div className="flex flex-wrap gap-2">
                  {PROS.map((pro) => (
                    <button key={pro} onClick={() => togglePro(pro)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        data.pros.includes(pro)
                          ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                          : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>
                      {data.pros.includes(pro) ? "✓ " : ""}{pro}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider mb-2 block">Distributor</label>
                <div className="flex flex-wrap gap-2">
                  {DISTRIBUTORS.map((d) => (
                    <button key={d} onClick={() => setData((s) => ({ ...s, distributor: d }))}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        data.distributor === d
                          ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]"
                          : "border-[#2e2e2e] text-[#a0a0a0] hover:border-[#3e3e3e]"
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <RadioGroup label="Does this song have an ISRC code?" field="hasISRC" />
              <div className="flex gap-3 mt-2">
                <button onClick={back} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                <button onClick={next} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Channels */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Active royalty channels</h2>
                <p className="text-[#555] text-sm">Which channels are already set up for this song?</p>
              </div>
              <RadioGroup label="SoundExchange registered?" field="hasSoundExchange" />
              <RadioGroup label="YouTube Content ID active?" field="hasYouTubeCID" />
              <RadioGroup label="TikTok / social media monetization active?" field="hasTikTok" />
              <RadioGroup label="Ownership splits documented?" field="hasSplitsDoc" />
              <div className="flex gap-3 mt-2">
                <button onClick={back} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Back</button>
                <button onClick={next} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4 — Run Check */}
          {step === 4 && (
            <div className="flex flex-col gap-5 items-center text-center">
              {loading ? (
                <>
                  <div className="w-16 h-16 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin" />
                  <h2 className="text-xl font-black text-white">Running your royalty check…</h2>
                  <p className="text-[#555] text-sm">Reviewing PRO setup, MLC, SoundExchange, YouTube, social channels…</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 flex items-center justify-center text-2xl">⚙️</div>
                  <h2 className="text-xl font-black text-white">Ready to check &quot;{data.songTitle}&quot;?</h2>
                  <p className="text-[#555] text-sm">
                    We&apos;ll review your royalty setup across all 9 channels and give you a
                    Royalty Health Score plus an earning roadmap.
                  </p>
                  <div className="w-full rounded-xl border border-[#1a1a1a] bg-[#111] p-4 text-left">
                    <div className="text-[#555] text-xs font-bold uppercase tracking-wider mb-3">Check summary</div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "Song",        val: data.songTitle },
                        { label: "Artist",      val: data.artistName },
                        { label: "PROs",        val: data.pros.length === 0 ? "None" : data.pros.join(", ") },
                        { label: "Distributor", val: data.distributor || "Not specified" },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between text-sm">
                          <span className="text-[#555]">{r.label}</span>
                          <span className="text-white font-medium">{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full mt-2">
                    <button onClick={back} className="flex-1 h-11 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-sm font-semibold">← Edit</button>
                    <button onClick={runCheck} className="flex-1 h-11 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894]">
                      Run Royalty Check →
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
