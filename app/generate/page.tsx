"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ── Style tags ────────────────────────────────────────────────────────────────
const GENRES = ["Hip Hop", "R&B", "Pop", "Electronic", "Lo-fi", "Trap", "Jazz", "Soul", "Afrobeats", "Reggaeton", "House", "Drill", "Ambient", "Rock", "Country"];
const MOODS  = ["Energetic", "Chill", "Dark", "Uplifting", "Emotional", "Aggressive", "Romantic", "Melancholic", "Hype", "Peaceful"];
const INSTRUMENTS = ["Piano", "Guitar", "808s", "Synth", "Strings", "Brass", "Drums", "Bass", "Flute", "Violin"];
const DURATIONS = [
  { label: "15 sec", value: 15 },
  { label: "30 sec", value: 30 },
  { label: "1 min",  value: 60 },
];

type GenStatus = "idle" | "starting" | "processing" | "succeeded" | "failed";

interface Track {
  id: string;
  prompt: string;
  tags: string[];
  duration: number;
  audioUrl: string;
  createdAt: string;
}

// ── Waveform visualizer (animated bars) ──────────────────────────────────────
function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#00d4aa]"
          style={{
            height: playing ? `${12 + Math.sin(i * 0.8) * 10 + 8}px` : "4px",
            opacity: playing ? 0.7 + (i % 3) * 0.1 : 0.3,
            transition: `height ${0.3 + (i % 5) * 0.1}s ease ${i * 0.02}s`,
            animation: playing ? `wave ${0.8 + (i % 4) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 4px; }
          to   { height: ${28}px; }
        }
      `}</style>
    </div>
  );
}

// ── Audio player card ─────────────────────────────────────────────────────────
function TrackCard({ track, onRegister }: { track: Track; onRegister: (t: Track) => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime / (audio.duration || 1));
    const onEnd  = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, []);

  return (
    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      {/* Track info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm truncate mb-1">{track.prompt}</div>
          <div className="flex items-center gap-2 flex-wrap">
            {track.tags.slice(0, 4).map(t => (
              <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">{t}</span>
            ))}
            <span className="text-[#555] text-[10px]">{track.duration}s</span>
          </div>
        </div>
        <a href={track.audioUrl} download={`musicright-${track.id}.mp3`}
          className="flex-shrink-0 w-8 h-8 rounded-lg border border-[#2e2e2e] flex items-center justify-center text-[#555] hover:text-white hover:border-[#3e3e3e] transition-colors"
          title="Download">
          ↓
        </a>
      </div>

      {/* Waveform / progress */}
      <div className="mb-4 cursor-pointer" onClick={toggle}>
        <Waveform playing={playing} />
        <div className="mt-2 h-0.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div className="h-full bg-[#00d4aa] rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={toggle}
          className="w-10 h-10 rounded-full bg-[#00d4aa] text-[#080808] flex items-center justify-center font-bold text-base hover:bg-[#00b894] transition-colors flex-shrink-0">
          {playing ? "⏸" : "▶"}
        </button>
        <div className="flex-1" />
        <button onClick={() => onRegister(track)}
          className="h-9 px-4 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-bold hover:bg-[#00d4aa]/20 transition-colors">
          Register Royalties →
        </button>
      </div>
    </div>
  );
}

// ── Tag picker ────────────────────────────────────────────────────────────────
function TagGroup({ label, tags, selected, onToggle }: { label: string; tags: string[]; selected: Set<string>; onToggle: (t: string) => void }) {
  return (
    <div>
      <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <button key={t} onClick={() => onToggle(t)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              selected.has(t) ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555] hover:border-[#3e3e3e] hover:text-[#a0a0a0]"
            }`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(30);
  const [status, setStatus] = useState<GenStatus>("idle");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleTag = (t: string) => setSelectedTags(prev => {
    const n = new Set(prev);
    n.has(t) ? n.delete(t) : n.add(t);
    return n;
  });

  const buildFullPrompt = () => {
    const tags = Array.from(selectedTags);
    return tags.length > 0 ? `${prompt}. Style: ${tags.join(", ")}` : prompt;
  };

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  const poll = useCallback((id: string, promptText: string, tags: string[]) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate?id=${id}`);
        const data = await res.json();

        if (data.status === "succeeded" && data.audioUrl) {
          stopPolling();
          setStatus("succeeded");
          setTracks(prev => [{
            id,
            prompt: promptText,
            tags,
            duration,
            audioUrl: data.audioUrl,
            createdAt: new Date().toISOString(),
          }, ...prev]);
        } else if (data.status === "failed") {
          stopPolling();
          setStatus("failed");
          setError(data.error ?? "Generation failed. Try a different prompt.");
        } else {
          setStatus("processing");
        }
      } catch {
        stopPolling();
        setStatus("failed");
        setError("Connection error. Please try again.");
      }
    }, 3000);
  }, [duration]);

  useEffect(() => () => stopPolling(), []);

  const generate = async () => {
    if (!prompt.trim() || status === "starting" || status === "processing") return;
    setError(null);
    setStatus("starting");
    const fullPrompt = buildFullPrompt();
    const tags = Array.from(selectedTags);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, duration }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus("failed");
        setError(data.error ?? "Failed to start generation.");
        return;
      }
      setPredictionId(data.id);
      setStatus("processing");
      poll(data.id, prompt, tags);
    } catch {
      setStatus("failed");
      setError("Could not connect to generation service.");
    }
  };

  const onRegister = (track: Track) => {
    const params = new URLSearchParams({
      song: track.prompt.slice(0, 60),
      artist: "AI Generated",
      userType: "ai_generated",
    });
    window.location.href = `/start/first-time?${params.toString()}`;
  };

  const isGenerating = status === "starting" || status === "processing";

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/start" className="text-[#555] text-sm hover:text-white transition-colors">Royalty Check</Link>
            <Link href="/dashboard" className="h-8 px-3 rounded-lg border border-[#2e2e2e] text-[#a0a0a0] text-xs font-semibold hover:border-[#00d4aa]/40 hover:text-[#00d4aa] transition-all">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
            AI MUSIC GENERATOR — POWERED BY META MUSICGEN
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Describe your track.<br />
            <span className="gradient-text">We generate the music.</span>
          </h1>
          <p className="text-[#a0a0a0] text-base max-w-xl mx-auto">
            Type what you want, pick your style, and get a real AI-generated track in under 60 seconds.
            Then register its royalties instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* ── LEFT: Controls ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Prompt */}
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5">
              <label className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2 block">Describe your track</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Smooth R&B with warm piano chords and a laid-back trap beat, late night vibes..."
                rows={4}
                className="w-full bg-[#111] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 resize-none transition-colors leading-relaxed"
              />
              <div className="text-[#555] text-[11px] mt-2">Be descriptive: mood, tempo, instruments, key</div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 flex flex-col gap-4">
              <TagGroup label="Genre" tags={GENRES} selected={selectedTags} onToggle={toggleTag} />
              <TagGroup label="Mood"  tags={MOODS}  selected={selectedTags} onToggle={toggleTag} />
              <TagGroup label="Instruments" tags={INSTRUMENTS} selected={selectedTags} onToggle={toggleTag} />
            </div>

            {/* Duration */}
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

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-4 rounded-2xl bg-[#00d4aa] text-[#080808] font-black text-base hover:bg-[#00b894] transition-all glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#080808]/30 border-t-[#080808] animate-spin" />
                  {status === "starting" ? "Starting…" : "Generating…"}
                </>
              ) : (
                "✦ Generate Track"
              )}
            </button>

            {error && (
              <div className="rounded-xl bg-[#ff4757]/10 border border-[#ff4757]/20 px-4 py-3 text-[#ff4757] text-sm">
                {error}
              </div>
            )}
          </div>

          {/* ── RIGHT: Output ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Generation progress */}
            {isGenerating && (
              <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#00d4aa]/20 border-t-[#00d4aa] animate-spin flex-shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">
                      {status === "starting" ? "Starting generation…" : "Composing your track…"}
                    </div>
                    <div className="text-[#555] text-xs mt-0.5">
                      {status === "starting" ? "Sending to MusicGen model" : "AI is writing music — usually 20–50 seconds"}
                    </div>
                  </div>
                </div>

                {/* Animated waveform placeholder */}
                <div className="rounded-xl bg-[#0e0e0e] border border-[#1a1a1a] p-4">
                  <Waveform playing={true} />
                </div>

                {/* Prompt preview */}
                <div className="mt-3 text-[#555] text-xs leading-relaxed">
                  Prompt: <span className="text-[#a0a0a0]">{buildFullPrompt().slice(0, 120)}{buildFullPrompt().length > 120 ? "…" : ""}</span>
                </div>
              </div>
            )}

            {/* Generated tracks */}
            {tracks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {status === "succeeded" && tracks.length > 0 && (
                  <div className="flex items-center gap-2 text-[#00d4aa] text-sm font-semibold">
                    <span>✓</span> Track generated — play it below
                  </div>
                )}
                {tracks.map(track => (
                  <TrackCard key={track.id} track={track} onRegister={onRegister} />
                ))}
              </div>
            ) : !isGenerating ? (
              /* Empty state */
              <div className="rounded-2xl border border-dashed border-[#2e2e2e] flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="text-5xl mb-4">🎵</div>
                <div className="text-white font-bold text-lg mb-2">Your track will appear here</div>
                <div className="text-[#555] text-sm max-w-xs leading-relaxed mb-6">
                  Describe your sound, pick style tags, and hit Generate. Takes 20–50 seconds.
                </div>
                {/* Example prompts */}
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <div className="text-[#555] text-[10px] uppercase tracking-wider mb-1">Try these prompts</div>
                  {[
                    "Smooth late-night R&B with warm piano, trap hi-hats",
                    "Aggressive drill beat with dark 808s and eerie synths",
                    "Chill lo-fi hip hop with jazz chords and vinyl crackle",
                  ].map(ex => (
                    <button key={ex} onClick={() => setPrompt(ex)}
                      className="text-left px-3 py-2 rounded-lg bg-[#111] border border-[#1a1a1a] hover:border-[#00d4aa]/20 text-[#a0a0a0] text-xs transition-colors">
                      &ldquo;{ex}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Info box */}
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-4">
              <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-2">About this generator</div>
              <div className="text-[#555] text-xs leading-relaxed space-y-1">
                <p>Powered by <span className="text-[#a0a0a0]">Meta MusicGen Stereo Large</span> — generates real stereo audio from text.</p>
                <p>Instrumental only (no vocals). For tracks with vocals, combine with a DAW.</p>
                <p>After generating, use <span className="text-[#00d4aa]">Register Royalties →</span> to set up your PRO, MLC, and distributor accounts for this track.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
