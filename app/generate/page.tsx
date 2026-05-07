"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Constants ─────────────────────────────────────────────────────────────────
const GENRES      = ["Hip Hop", "R&B", "Pop", "Electronic", "Lo-fi", "Trap", "Jazz", "Soul", "Afrobeats", "Drill", "House", "Ambient", "Rock", "Country"];
const MOODS       = ["Energetic", "Chill", "Dark", "Uplifting", "Emotional", "Aggressive", "Romantic", "Melancholic", "Hype", "Peaceful"];
const INSTRUMENTS = ["Piano", "Guitar", "808s", "Synth", "Strings", "Brass", "Drums", "Bass", "Flute", "Violin"];
const DURATIONS   = [{ label: "15s", value: 15 }, { label: "30s", value: 30 }, { label: "60s", value: 60 }];

const SUGGESTION_CHIPS = [
  "Smooth late-night R&B, warm piano, trap hi-hats",
  "Aggressive drill beat, dark 808s, eerie synths",
  "Chill lo-fi hip hop, jazz chords, vinyl crackle",
  "Uplifting Afrobeats, percussion, bright brass",
  "Cinematic orchestral, strings swelling, emotional",
  "Hard trap beat, heavy 808s, 140 BPM, dark melodic",
];

const VOICE_OPTIONS = [
  { key: "neutral",    label: "Default",       desc: "Balanced vocal" },
  { key: "male_warm",  label: "Male Warm",     desc: "Deep, smooth" },
  { key: "male_rap",   label: "Male Rap",      desc: "Clear delivery" },
  { key: "female_pop", label: "Female Pop",    desc: "Bright, pop" },
  { key: "female_rnb", label: "Female R&B",    desc: "Soulful, smooth" },
];

const LYRICS_TEMPLATE = `[Verse]
Write your verse lyrics here...

[Chorus]
Your chorus here...

[Verse 2]
Second verse...

[Outro]
Closing lines...`;

type GenStatus = "idle" | "starting" | "processing" | "succeeded" | "failed";
type Mode = "instrumental" | "vocals";

interface Track {
  id: string;
  mode: Mode;
  prompt: string;
  tags: string[];
  duration: number;
  audioUrl: string;   // for instrumental
  audioBase64?: string; // for vocals
  createdAt: string;
}

// ── Animated waveform ─────────────────────────────────────────────────────────
function Waveform({ playing, color = "#00d4aa" }: { playing: boolean; color?: string }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} className="w-[2.5px] rounded-full transition-all"
          style={{
            background: color,
            height: playing ? `${6 + Math.abs(Math.sin(i * 0.6)) * 20}px` : "3px",
            opacity: playing ? 0.5 + (i % 5) * 0.1 : 0.2,
            animation: playing ? `wave-${i % 4} ${0.6 + (i % 5) * 0.15}s ease-in-out ${i * 0.03}s infinite alternate` : "none",
          }} />
      ))}
      <style>{`
        @keyframes wave-0 { from{height:4px} to{height:24px} }
        @keyframes wave-1 { from{height:8px} to{height:20px} }
        @keyframes wave-2 { from{height:12px} to{height:28px} }
        @keyframes wave-3 { from{height:6px} to{height:18px} }
      `}</style>
    </div>
  );
}

// ── Track player ──────────────────────────────────────────────────────────────
function TrackCard({ track, onRegister, onVariation }: {
  track: Track;
  onRegister: (t: Track) => void;
  onVariation: (t: Track) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const src = track.audioUrl ||
    (track.audioBase64 ? `data:audio/mpeg;base64,${track.audioBase64}` : "");

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play();
    setPlaying(!playing);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime / (a.duration || 1));
    const onEnd  = () => { setPlaying(false); setProgress(0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("ended", onEnd); };
  }, []);

  const isVocal = track.mode === "vocals";

  return (
    <div className={`rounded-2xl border p-5 ${isVocal ? "border-[#00b4d8]/25 bg-[#00b4d8]/5" : "border-[#1a1a1a] bg-[#0e0e0e]"}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isVocal ? "bg-[#00b4d8]/15 text-[#00b4d8]" : "bg-[#00d4aa]/10 text-[#00d4aa]"
            }`}>
              {isVocal ? "🎤 Vocals" : "🎵 Instrumental"}
            </span>
            <span className="text-[#555] text-[10px]">{track.duration}s</span>
          </div>
          <div className="text-white text-sm font-semibold truncate">{track.prompt}</div>
          <div className="flex gap-1.5 flex-wrap mt-1">
            {track.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#555]">{t}</span>
            ))}
          </div>
        </div>
        {src && (
          <a href={src} download={`musicright-${track.id}.mp3`}
            className="w-8 h-8 rounded-lg border border-[#2e2e2e] flex items-center justify-center text-[#555] hover:text-white hover:border-[#3e3e3e] transition-colors text-sm flex-shrink-0"
            title="Download">↓</a>
        )}
      </div>

      {/* Waveform + progress */}
      <div className="cursor-pointer mb-4" onClick={toggle}>
        <Waveform playing={playing} color={isVocal ? "#00b4d8" : "#00d4aa"} />
        <div className="mt-2 h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{
            width: `${progress * 100}%`,
            background: isVocal ? "#00b4d8" : "#00d4aa",
          }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-colors"
          style={{ background: isVocal ? "#00b4d8" : "#00d4aa", color: "#080808" }}>
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => onVariation(track)}
          className="h-8 px-3 rounded-lg border border-[#2e2e2e] text-[#555] text-xs font-semibold hover:border-[#3e3e3e] hover:text-white transition-colors">
          Variation
        </button>
        <button onClick={() => onRegister(track)}
          className="h-8 px-3 rounded-lg border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold hover:bg-[#00d4aa]/10 transition-colors ml-auto">
          Register Royalties →
        </button>
      </div>
    </div>
  );
}

// ── Tag button ─────────────────────────────────────────────────────────────────
function Tag({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
        active ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555] hover:border-[#3e3e3e] hover:text-[#a0a0a0]"
      }`}>
      {label}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const [mode, setMode] = useState<Mode>("instrumental");

  // Instrumental state
  const [prompt, setPrompt]   = useState("");
  const [tags, setTags]       = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(30);

  // Vocals state
  const [lyrics, setLyrics]       = useState("");
  const [vocalPrompt, setVocalPrompt] = useState("");
  const [voice, setVoice]         = useState("neutral");
  const [lyricsTemplate, setLyricsTemplate] = useState(false);

  // Generation
  const [instrStatus, setInstrStatus] = useState<GenStatus>("idle");
  const [vocalStatus, setVocalStatus] = useState<GenStatus>("idle");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError]   = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleTag = (t: string) => setTags(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const stopPolling = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
  useEffect(() => () => stopPolling(), []);

  const buildPrompt = () => {
    const tagArr = Array.from(tags);
    return tagArr.length > 0 ? `${prompt}. Style: ${tagArr.join(", ")}` : prompt;
  };

  const poll = useCallback((id: string, promptText: string, tagArr: string[]) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate?id=${id}`);
        const data = await res.json();
        if (data.status === "succeeded" && data.audioUrl) {
          stopPolling();
          setInstrStatus("succeeded");
          setTracks(prev => [{
            id, mode: "instrumental", prompt: promptText, tags: tagArr,
            duration, audioUrl: data.audioUrl, createdAt: new Date().toISOString(),
          }, ...prev]);
        } else if (data.status === "failed") {
          stopPolling(); setInstrStatus("failed"); setError(data.error ?? "Generation failed.");
        } else {
          setInstrStatus("processing");
        }
      } catch { stopPolling(); setInstrStatus("failed"); setError("Connection error."); }
    }, 3000);
  }, [duration]);

  const generateInstrumental = async (overridePrompt?: string) => {
    if (instrStatus === "starting" || instrStatus === "processing") return;
    const p = overridePrompt ?? buildPrompt();
    if (!p.trim()) return;
    setError(null); setInstrStatus("starting");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, duration }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setInstrStatus("failed"); setError(data.error ?? "Failed."); return; }
      setInstrStatus("processing");
      poll(data.id, overridePrompt ?? prompt, Array.from(tags));
    } catch { setInstrStatus("failed"); setError("Could not connect."); }
  };

  const generateVocals = async () => {
    const text = lyrics.trim();
    if (!text || vocalStatus === "starting" || vocalStatus === "processing") return;
    setError(null); setVocalStatus("starting");
    try {
      const res = await fetch("/api/vocals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setVocalStatus("failed"); setError(data.error ?? "Vocals failed."); return; }
      setVocalStatus("succeeded");
      setTracks(prev => [{
        id: `v-${Date.now()}`, mode: "vocals",
        prompt: vocalPrompt || text.slice(0, 60),
        tags: [voice], duration: 0,
        audioUrl: "", audioBase64: data.audioBase64,
        createdAt: new Date().toISOString(),
      }, ...prev]);
    } catch { setVocalStatus("failed"); setError("Could not connect."); }
  };

  const onRegister = (track: Track) => {
    const params = new URLSearchParams({
      song: track.prompt.slice(0, 60),
      artist: "AI Generated",
    });
    window.location.href = `/start/first-time?${params}`;
  };

  const onVariation = (track: Track) => {
    if (track.mode === "instrumental") {
      setMode("instrumental"); setPrompt(track.prompt);
      setTimeout(() => generateInstrumental(track.prompt + ", variation"), 100);
    }
  };

  const isGenerating = instrStatus === "starting" || instrStatus === "processing";
  const isVocalGen   = vocalStatus === "starting" || vocalStatus === "processing";

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/start" className="text-[#555] hover:text-white transition-colors">Royalty Check</Link>
            <Link href="/dashboard" className="h-8 px-3 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-xs font-semibold hover:border-[#00d4aa]/40 hover:text-[#00d4aa] transition-all">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            AI STUDIO — MUSICGEN + FISH AUDIO VOCALS
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Describe it. Generate it.<br />
            <span className="gradient-text">Own it.</span>
          </h1>
          <p className="text-[#a0a0a0] text-base max-w-xl mx-auto">
            Generate AI instrumentals and vocals separately — then register royalties for everything you create.
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl mb-8 max-w-xs mx-auto">
          {([
            { key: "instrumental", label: "🎵 Instrumental", color: "#00d4aa" },
            { key: "vocals",       label: "🎤 Vocals",       color: "#00b4d8" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setMode(key)}
              className={`flex-1 h-9 rounded-lg text-sm font-bold transition-all ${
                mode === key ? "bg-[#1a1a1a] text-white" : "text-[#555] hover:text-[#a0a0a0]"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── LEFT: Controls ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* ── INSTRUMENTAL MODE ── */}
            {mode === "instrumental" && (
              <>
                <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2 block">Describe your track</label>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g. Smooth R&B with warm piano chords and a laid-back trap beat, late night vibes..."
                    rows={3}
                    className="w-full bg-[#111] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 resize-none transition-colors leading-relaxed" />

                  {/* NotebookLM-style suggestion chips */}
                  <div className="mt-3">
                    <div className="text-[#555] text-[10px] mb-2">Try these →</div>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTION_CHIPS.slice(0, 4).map(s => (
                        <button key={s} onClick={() => setPrompt(s)}
                          className="text-left text-xs px-3 py-1.5 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#00d4aa]/20 hover:text-[#a0a0a0] text-[#555] transition-colors truncate">
                          &ldquo;{s}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 flex flex-col gap-3">
                  <div>
                    <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">Genre</div>
                    <div className="flex flex-wrap gap-1.5">
                      {GENRES.map(t => <Tag key={t} label={t} active={tags.has(t)} onClick={() => toggleTag(t)} />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">Mood</div>
                    <div className="flex flex-wrap gap-1.5">
                      {MOODS.map(t => <Tag key={t} label={t} active={tags.has(t)} onClick={() => toggleTag(t)} />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">Instruments</div>
                    <div className="flex flex-wrap gap-1.5">
                      {INSTRUMENTS.map(t => <Tag key={t} label={t} active={tags.has(t)} onClick={() => toggleTag(t)} />)}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-3 block">Duration</label>
                  <div className="flex gap-2">
                    {DURATIONS.map(d => (
                      <button key={d.value} onClick={() => setDuration(d.value)}
                        className={`flex-1 h-9 rounded-lg text-sm font-semibold border transition-all ${
                          duration === d.value ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555] hover:border-[#3e3e3e]"
                        }`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => generateInstrumental()} disabled={!prompt.trim() || isGenerating}
                  className="w-full py-4 rounded-2xl bg-[#00d4aa] text-[#080808] font-black text-base hover:bg-[#00b894] transition-all glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                  {isGenerating ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-[#080808]/30 border-t-[#080808] animate-spin" />
                    {instrStatus === "starting" ? "Starting…" : "Generating…"}</>
                  ) : "✦ Generate Instrumental"}
                </button>
              </>
            )}

            {/* ── VOCALS MODE ── */}
            {mode === "vocals" && (
              <>
                <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider">Lyrics</label>
                    <button onClick={() => { setLyricsTemplate(!lyricsTemplate); if (!lyricsTemplate) setLyrics(LYRICS_TEMPLATE); }}
                      className="text-[#00d4aa] text-[10px] font-semibold hover:underline">
                      {lyricsTemplate ? "Clear" : "Use template"}
                    </button>
                  </div>
                  <textarea value={lyrics} onChange={e => setLyrics(e.target.value)}
                    placeholder={"[Verse]\nWrite your lyrics here...\n\n[Chorus]\nYour chorus..."}
                    rows={10}
                    className="w-full bg-[#111] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00b4d8]/50 resize-none transition-colors leading-relaxed font-mono" />
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-[#555] text-[10px]">Use [Verse], [Chorus], [Bridge] markers</div>
                    <div className={`text-[10px] font-semibold ${lyrics.length > 1800 ? "text-[#ff4757]" : "text-[#555]"}`}>{lyrics.length}/2000</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-3 block">Voice Style</label>
                  <div className="flex flex-col gap-2">
                    {VOICE_OPTIONS.map(v => (
                      <button key={v.key} onClick={() => setVoice(v.key)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          voice === v.key ? "border-[#00b4d8] bg-[#00b4d8]/10" : "border-[#2e2e2e] hover:border-[#3e3e3e]"
                        }`}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: voice === v.key ? "#00b4d820" : "#1a1a1a" }}>
                          🎤
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${voice === v.key ? "text-[#00b4d8]" : "text-white"}`}>{v.label}</div>
                          <div className="text-[#555] text-[10px]">{v.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
                  <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2 block">Track name (optional)</label>
                  <input value={vocalPrompt} onChange={e => setVocalPrompt(e.target.value)}
                    placeholder="e.g. Midnight Drive — R&B ballad"
                    className="w-full h-10 bg-[#111] border border-[#2e2e2e] rounded-lg px-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00b4d8]/50 transition-colors" />
                </div>

                <button onClick={generateVocals} disabled={!lyrics.trim() || isVocalGen}
                  className="w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: isVocalGen ? "#00b4d860" : "#00b4d8", color: "#080808" }}>
                  {isVocalGen ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-[#080808]/30 border-t-[#080808] animate-spin" />
                    {vocalStatus === "starting" ? "Starting…" : "Generating vocals…"}</>
                  ) : "🎤 Generate Vocals"}
                </button>

                <div className="rounded-xl border border-[#1a1a1a] p-4 text-[#555] text-xs leading-relaxed">
                  Powered by <span className="text-[#a0a0a0]">Fish Audio</span> — real AI voice synthesis.
                  Combine with an instrumental track in your DAW for a complete song.
                  Requires <span className="text-[#a0a0a0]">FISH_AUDIO_API_KEY</span> env var.
                </div>
              </>
            )}

            {error && (
              <div className="rounded-xl bg-[#ff4757]/10 border border-[#ff4757]/20 px-4 py-3 text-[#ff4757] text-sm">
                {error}
              </div>
            )}
          </div>

          {/* ── RIGHT: Output ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Generation in progress */}
            {(isGenerating || isVocalGen) && (
              <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin flex-shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">
                      {isGenerating
                        ? (instrStatus === "starting" ? "Starting MusicGen…" : "AI is composing your track…")
                        : (vocalStatus === "starting" ? "Connecting to Fish Audio…" : "Synthesizing vocals…")}
                    </div>
                    <div className="text-[#555] text-xs mt-0.5">
                      {isGenerating ? "Usually 20–50 seconds for stereo audio" : "Usually 5–15 seconds for vocals"}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#0e0e0e] border border-[#1a1a1a] p-4">
                  <Waveform playing={true} />
                </div>
              </div>
            )}

            {/* Tracks */}
            {tracks.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-[#00d4aa] text-sm font-semibold">✓ {tracks.length} track{tracks.length > 1 ? "s" : ""} generated</div>
                  <div className="text-[#555] text-xs">All tracks saved this session</div>
                </div>
                {tracks.map(track => (
                  <TrackCard key={track.id} track={track} onRegister={onRegister} onVariation={onVariation} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {tracks.length === 0 && !isGenerating && !isVocalGen && (
              <div className="rounded-2xl border border-dashed border-[#2e2e2e] flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="text-5xl mb-4">{mode === "vocals" ? "🎤" : "🎵"}</div>
                <div className="text-white font-bold text-lg mb-2">
                  {mode === "vocals" ? "Your vocals will appear here" : "Your track will appear here"}
                </div>
                <div className="text-[#555] text-sm max-w-xs leading-relaxed mb-6">
                  {mode === "vocals"
                    ? "Write your lyrics, choose a voice, and hit Generate Vocals."
                    : "Describe your sound, add style tags, hit Generate."}
                </div>

                {/* Quick start prompts (NotebookLM pattern) */}
                {mode === "instrumental" && (
                  <div className="w-full max-w-sm">
                    <div className="text-[#555] text-[10px] uppercase tracking-wider mb-2">Quick start</div>
                    <div className="flex flex-col gap-2">
                      {SUGGESTION_CHIPS.slice(4).map(s => (
                        <button key={s} onClick={() => { setPrompt(s); }}
                          className="text-left px-3 py-2 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#00d4aa]/20 text-[#a0a0a0] text-xs transition-colors">
                          &ldquo;{s}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info panel */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-4 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[#00d4aa] text-[10px] font-bold uppercase tracking-wider mb-1.5">🎵 Instrumental</div>
                <div className="text-[#555] text-xs leading-relaxed">
                  Meta MusicGen Stereo Large. Real stereo audio from text description. Instrumental only — no vocals.
                </div>
              </div>
              <div>
                <div className="text-[#00b4d8] text-[10px] font-bold uppercase tracking-wider mb-1.5">🎤 Vocals</div>
                <div className="text-[#555] text-xs leading-relaxed">
                  Fish Audio — neural voice synthesis. Write lyrics with structure tags, choose a voice style, get real vocal audio.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
