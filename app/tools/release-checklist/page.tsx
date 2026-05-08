"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ReleaseChecklistPage() {
  const [releaseDate, setReleaseDate] = useState("");
  const [releaseType, setReleaseType] = useState<"single" | "ep" | "album">("single");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [generated, setGenerated] = useState(false);

  // Persist checked state
  useEffect(() => {
    const saved = localStorage.getItem("mr_checklist");
    if (saved) setChecked(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (Object.keys(checked).length > 0) localStorage.setItem("mr_checklist", JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));

  // Back-calculate dates from release date
  const rd = releaseDate ? new Date(releaseDate + "T12:00:00") : null;
  const dateOffset = (days: number) => {
    if (!rd) return "—";
    const d = new Date(rd);
    d.setDate(d.getDate() - days);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const dateAfter = (days: number) => {
    if (!rd) return "—";
    const d = new Date(rd);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  type Phase = { phase: string; color: string; items: { id: string; task: string; date: string; why: string; link?: string; linkLabel?: string }[] };

  const phases: Phase[] = [
    {
      phase: "8+ Weeks Before",
      color: "#ff4757",
      items: [
        { id: "master", task: "Finalize master recording", date: dateOffset(56), why: "Everything downstream depends on a locked master. No more changes after this point." },
        { id: "isrc", task: "Generate ISRC code", date: dateOffset(56), why: "Required for streaming tracking, SoundExchange, and royalty identification across all platforms.", link: "/start", linkLabel: "Get help with ISRC →" },
        { id: "splits", task: "Sign split sheet with all collaborators", date: dateOffset(56), why: "Missing splits = frozen royalties. Get it signed before release, not after disputes start.", link: "/tools/split-sheet", linkLabel: "Generate split sheet →" },
        { id: "pro_reg", task: "Register song with your PRO (ASCAP/BMI/SESAC)", date: dateOffset(56), why: "Performance royalties need PRO registration before the song is performed or streamed publicly.", link: "/start", linkLabel: "Check your PRO setup →" },
      ],
    },
    {
      phase: "6 Weeks Before",
      color: "#ff6b35",
      items: [
        { id: "distributor", task: "Submit to distributor (DistroKid, TuneCore, CD Baby)", date: dateOffset(42), why: "Most DSPs need 5–7 business days minimum. Submit early for editorial consideration window." },
        { id: "spotify_pitch", task: "Pitch to Spotify editorial playlists", date: dateOffset(42), why: "Spotify requires pitching through Spotify for Artists at least 7 days before release. 4–6 weeks = best shot.", link: "https://artists.spotify.com", linkLabel: "Open Spotify for Artists →" },
        { id: "mlc_reg", task: "Register with The MLC (mechanical royalties)", date: dateOffset(42), why: "US mechanical royalties from streaming are only collected if your song is registered with The MLC.", link: "/start", linkLabel: "Check MLC status →" },
        ...(releaseType !== "single" ? [{ id: "press_kit", task: "Complete EPK (bio, photos, one-sheet)", date: dateOffset(42), why: "EPs and albums need full press kits for blog/press coverage outreach." }] : []),
      ],
    },
    {
      phase: "4 Weeks Before",
      color: "#ffb800",
      items: [
        { id: "soundexchange", task: "Register with SoundExchange (digital radio)", date: dateOffset(28), why: "Digital radio (Pandora, iHeart, SiriusXM) pays through SoundExchange. Must be registered.", link: "/start", linkLabel: "Check SoundExchange status →" },
        { id: "copyright", task: "File copyright with U.S. Copyright Office", date: dateOffset(28), why: "Automatic copyright exists, but formal registration is required to sue for statutory damages.", link: "/tools/song-copyright", linkLabel: "Copyright guide →" },
        { id: "press_outreach", task: "Send press release to blogs and playlists", date: dateOffset(28), why: "Independent blogs and playlist curators need 3–4 weeks lead time for coverage." },
        { id: "artwork", task: "Finalize cover art (3000×3000px, RGB)", date: dateOffset(28), why: "Distributors reject low-resolution or CMYK artwork. Get it approved early." },
      ],
    },
    {
      phase: "2 Weeks Before",
      color: "#a0a0a0",
      items: [
        { id: "presave", task: "Launch pre-save campaign", date: dateOffset(14), why: "Pre-saves signal demand to Spotify's algorithm and boost day-1 numbers for editorial." },
        { id: "social_schedule", task: "Schedule all social content", date: dateOffset(14), why: "Pre-schedule at least 7 posts across release week so you're not scrambling the day of." },
        { id: "youtube_cid", task: "Set up YouTube Content ID", date: dateOffset(14), why: "Protects your song on YouTube and monetizes fan uploads automatically.", link: "/start", linkLabel: "Check YouTube CID →" },
        { id: "lyrics_upload", task: "Upload lyrics to Genius/Musixmatch", date: dateOffset(14), why: "Lyrics on streaming platforms increase engagement and searchability." },
      ],
    },
    {
      phase: "Release Day",
      color: "#00d4aa",
      items: [
        { id: "release_push", task: "Post across all platforms at midnight or 12pm", date: rd ? rd.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", why: "Coordinate posts for maximum impact in the first 24 hours." },
        { id: "stories", task: "Go live / post stories with direct stream link", date: rd ? rd.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", why: "Algorithm boosts songs in the first 24 hours of release." },
        { id: "reach_out", task: "Email your list and direct contacts", date: rd ? rd.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", why: "Your most engaged fans convert immediately." },
        { id: "curator_followup", task: "Follow up with playlist curators", date: rd ? rd.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", why: "Remind curators who showed interest that the track is now live." },
      ],
    },
    {
      phase: "After Release",
      color: "#00b4d8",
      items: [
        { id: "royalty_check", task: "Verify royalty collection is active", date: dateAfter(30), why: "Check your first statement period to confirm all channels are actually collecting.", link: "/start", linkLabel: "Run royalty check →" },
        { id: "stats_review", task: "Review streaming stats and playlist adds", date: dateAfter(7), why: "Identify which playlists added you and double down on promotion there." },
        { id: "soundexchange_sound", task: "Confirm SoundExchange recording claim", date: dateAfter(30), why: "Verify your recording is properly claimed in your SoundExchange account." },
        ...(releaseType === "album" ? [{ id: "sync_pitch", task: "Pitch tracks for sync licensing opportunities", date: dateAfter(14), why: "Albums give you more tracks to pitch to music supervisors for TV/film/ads." }] : []),
      ],
    },
  ];

  const totalItems = phases.flatMap(p => p.items).length;
  const checkedItems = phases.flatMap(p => p.items).filter(i => checked[i.id]).length;
  const pct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-[#555] text-sm hover:text-white transition-colors">← All Tools</Link>
            <Link href="/start" className="h-8 px-3 rounded-lg bg-[#00d4aa] text-[#080808] text-xs font-bold hover:bg-[#00b894] transition-colors">Royalty Check →</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <div className="mb-10">
          <Link href="/tools" className="text-[#555] text-sm hover:text-[#a0a0a0] transition-colors mb-4 block">← All Tools</Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Music Release Checklist</h1>
          <p className="text-[#a0a0a0] text-base">
            Set your release date and get a personalized timeline with every deadline back-calculated.
            Never miss a distributor cutoff or editorial window again.
          </p>
        </div>

        {/* Setup */}
        {!generated && (
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8 mb-8">
            <h2 className="text-lg font-black mb-6">Set up your release</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2 block">Release date</label>
                <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                  className="h-11 w-full max-w-xs bg-[#111] border border-[#2e2e2e] rounded-lg px-4 text-white text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-colors" />
              </div>
              <div>
                <label className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2 block">Release type</label>
                <div className="flex gap-2">
                  {(["single", "ep", "album"] as const).map(t => (
                    <button key={t} onClick={() => setReleaseType(t)}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        releaseType === t ? "border-[#00d4aa] bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#2e2e2e] text-[#555] hover:border-[#3e3e3e]"
                      }`}>{t.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setGenerated(true)} disabled={!releaseDate}
                className="h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-start">
                Generate My Timeline →
              </button>
            </div>
          </div>
        )}

        {/* Generated checklist */}
        {generated && (
          <>
            {/* Progress bar */}
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-5 mb-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-bold text-sm">{releaseType.toUpperCase()} — {rd?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                  <div className="text-[#555] text-xs mt-0.5">{checkedItems} of {totalItems} tasks complete</div>
                </div>
                <div className="text-2xl font-black" style={{ color: pct === 100 ? "#00d4aa" : pct >= 50 ? "#ffb800" : "#ff4757" }}>{pct}%</div>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${pct}%`,
                  background: pct === 100 ? "#00d4aa" : pct >= 50 ? "#ffb800" : "#ff4757",
                }} />
              </div>
              <button onClick={() => { setGenerated(false); setChecked({}); }} className="text-[#555] text-xs mt-3 hover:text-[#a0a0a0] transition-colors">← Change release date</button>
            </div>

            {/* Phases */}
            <div className="flex flex-col gap-8">
              {phases.map(phase => (
                <div key={phase.phase}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-[#1a1a1a]" />
                    <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: phase.color }}>{phase.phase}</span>
                    <div className="h-px flex-1 bg-[#1a1a1a]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    {phase.items.map(item => (
                      <div key={item.id}
                        className={`rounded-xl border p-4 transition-all cursor-pointer ${
                          checked[item.id] ? "border-[#1a1a1a] bg-[#0a0a0a] opacity-60" : "border-[#1a1a1a] bg-[#0e0e0e] hover:border-[#2e2e2e]"
                        }`}
                        onClick={() => toggle(item.id)}>
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${
                            checked[item.id] ? "border-[#00d4aa] bg-[#00d4aa]" : "border-[#2e2e2e]"
                          }`}>
                            {checked[item.id] && <span className="text-[#080808] text-xs font-black">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className={`text-sm font-semibold ${checked[item.id] ? "line-through text-[#555]" : "text-white"}`}>
                                {item.task}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#555] flex-shrink-0">
                                {item.date}
                              </span>
                            </div>
                            <p className="text-[#555] text-xs mt-1 leading-relaxed">{item.why}</p>
                            {item.link && !checked[item.id] && (
                              <a href={item.link} onClick={e => e.stopPropagation()}
                                className="inline-block mt-2 text-[#00d4aa] text-xs font-semibold hover:underline">
                                {item.linkLabel}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-6 text-center">
              <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-wider mb-2">Don&apos;t forget your royalties</div>
              <h3 className="text-white font-black text-lg mb-2">Register your song while you can still remember the details.</h3>
              <p className="text-[#555] text-sm mb-4">PRO, MLC, SoundExchange — get a full royalty gap analysis in 60 seconds.</p>
              <Link href="/start" className="inline-flex h-11 px-6 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm items-center hover:bg-[#00b894] transition-colors">
                Run Free Royalty Check →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
