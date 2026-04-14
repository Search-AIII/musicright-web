"use client";
import { useState } from "react";
import Link from "next/link";

const PROS = ["ASCAP", "BMI", "SESAC", "SoundExchange", "The MLC", "Harry Fox Agency", "None yet"];
const DISTRIBUTORS = ["DistroKid", "TuneCore", "CD Baby", "Amuse", "UnitedMasters", "Other / Direct"];

export default function IntakePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", stageName: "",
    distributor: "", pros: [] as string[],
    songCount: "", topSong: "", notes: "",
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const togglePro = (p: string) => setForm(f => ({
    ...f,
    pros: f.pros.includes(p) ? f.pros.filter(x => x !== p) : [...f.pros, p],
  }));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Email contact@musicright.ai");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
        <h1 className="text-2xl font-black text-white mb-3">You&apos;re booked!</h1>
        <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6">
          Your audit request is confirmed. I&apos;ll review your catalog and send your full report + Loom video within 48 hours.
        </p>
        <p className="text-[#555] text-xs mb-8">Check your email at <span className="text-white">{form.email}</span></p>
        <Link href="/" className="text-[#00d4aa] text-sm hover:underline">← Back to MusicRight.AI</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
        <span className="font-bold text-sm text-white">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3].map(n => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step > n ? "bg-[#00d4aa] text-[#080808]" :
              step === n ? "border-2 border-[#00d4aa] text-[#00d4aa]" :
              "border border-[#2e2e2e] text-[#555]"
            }`}>{step > n ? "✓" : n}</div>
            {n < 3 && <div className={`w-12 h-px ${step > n ? "bg-[#00d4aa]" : "bg-[#2e2e2e]"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-7">

        {/* Step 1 — Contact */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-white">Your details</h2>
              <p className="text-[#555] text-xs mt-1">So I can send your audit report</p>
            </div>
            {[
              { label: "Full name *", key: "name", placeholder: "Your name" },
              { label: "Email *", key: "email", placeholder: "you@example.com" },
              { label: "Artist / stage name *", key: "stageName", placeholder: "e.g. KTTeddy" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-1.5">{f.label}</label>
                <input
                  className="w-full h-10 rounded-lg bg-[#111] border border-[#2e2e2e] px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/40 placeholder:text-[#3e3e3e]"
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form] as string}
                  onChange={e => update(f.key, e.target.value)}
                  type={f.key === "email" ? "email" : "text"}
                />
              </div>
            ))}
            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.email || !form.stageName}
              className="h-10 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm mt-2 disabled:opacity-40 hover:bg-[#00b894] transition-colors"
            >Continue →</button>
          </div>
        )}

        {/* Step 2 — Catalog */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-white">Your catalog</h2>
              <p className="text-[#555] text-xs mt-1">Tell me about your releases</p>
            </div>

            <div>
              <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-2">Distributor</label>
              <div className="flex flex-wrap gap-2">
                {DISTRIBUTORS.map(d => (
                  <button key={d} onClick={() => update("distributor", d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.distributor === d ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555] hover:border-[#3e3e3e]"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-2">PROs you&apos;re registered with</label>
              <div className="flex flex-wrap gap-2">
                {PROS.map(p => (
                  <button key={p} onClick={() => togglePro(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.pros.includes(p) ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555] hover:border-[#3e3e3e]"}`}>
                    {form.pros.includes(p) ? "✓ " : ""}{p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-2">Number of songs to audit</label>
              <div className="flex gap-2">
                {["1","2","3","4","5"].map(n => (
                  <button key={n} onClick={() => update("songCount", n)}
                    className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all ${form.songCount === n ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555]"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider block mb-1.5">Your most-streamed song</label>
              <input
                className="w-full h-10 rounded-lg bg-[#111] border border-[#2e2e2e] px-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/40 placeholder:text-[#3e3e3e]"
                placeholder="Song title"
                value={form.topSong}
                onChange={e => update("topSong", e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(1)} className="flex-1 h-10 rounded-lg border border-[#2e2e2e] text-[#555] text-sm">← Back</button>
              <button onClick={() => setStep(3)} disabled={!form.distributor || !form.songCount} className="flex-1 h-10 rounded-lg bg-[#00d4aa] text-[#080808] font-bold text-sm disabled:opacity-40">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Submit */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-white">Anything else?</h2>
              <p className="text-[#555] text-xs mt-1">Optional — specific concerns or questions</p>
            </div>

            <textarea
              className="w-full rounded-lg bg-[#111] border border-[#2e2e2e] px-3 py-3 text-white text-sm focus:outline-none focus:border-[#00d4aa]/40 placeholder:text-[#3e3e3e] resize-none"
              rows={4}
              placeholder="e.g. I think my ISRC is missing on one song, or I'm not sure if my splits are set up correctly..."
              value={form.notes}
              onChange={e => update("notes", e.target.value)}
            />

            {/* Summary */}
            <div className="rounded-xl bg-[#111] border border-[#1a1a1a] p-4 text-xs flex flex-col gap-2">
              <div className="text-[#555] font-bold uppercase tracking-wider mb-1">Summary</div>
              {[
                { l: "Artist", v: form.stageName },
                { l: "Distributor", v: form.distributor },
                { l: "PROs", v: form.pros.join(", ") || "None" },
                { l: "Songs", v: form.songCount },
              ].map(r => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-[#555]">{r.l}</span>
                  <span className="text-white font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            {error && <p className="text-[#ff4757] text-xs text-center">{error}</p>}

            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(2)} className="flex-1 h-10 rounded-lg border border-[#2e2e2e] text-[#555] text-sm">← Back</button>
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 h-10 rounded-lg font-bold text-sm text-[#080808] transition-colors"
                style={{ background: "linear-gradient(135deg, #00d4aa, #00b4d8)" }}
              >
                {loading ? "Sending..." : "Submit →"}
              </button>
            </div>

            <p className="text-center text-[#555] text-[10px]">
              Delivered within 48 hours · contact@musicright.ai
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
