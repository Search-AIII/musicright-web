import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const FISH_API = "https://api.fish.audio/v1/tts";

// Preset voices: Fish Audio community voice IDs
// These are stable, high-quality public voices from the Fish Audio library
const VOICE_PRESETS: Record<string, { id: string; label: string; desc: string }> = {
  male_warm:    { id: "54a5170264694bfc8e9ad98df7bd89c3", label: "Male — Warm",      desc: "Deep, warm male vocal" },
  male_rap:     { id: "5c6df4a7a7074d6d98a92e14e4c6fb81", label: "Male — Rap",       desc: "Clear rap delivery style" },
  female_pop:   { id: "7f92f8efb8ec43bf8f1d28f0173a10c3", label: "Female — Pop",     desc: "Bright, pop vocal style" },
  female_rnb:   { id: "4b73efbd55e347cdba4d4e2c5a20c8da", label: "Female — R&B",     desc: "Soulful, smooth R&B" },
  neutral:      { id: "",                                   label: "Default",          desc: "Fish Audio default voice" },
};

export async function GET() {
  return NextResponse.json({
    voices: Object.entries(VOICE_PRESETS).map(([key, v]) => ({
      key, label: v.label, desc: v.desc,
    })),
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "FISH_AUDIO_API_KEY not configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const text = (body.text as string)?.trim();
  if (!text) return NextResponse.json({ error: "text (lyrics) required" }, { status: 400 });
  if (text.length > 2000) return NextResponse.json({ error: "Max 2000 characters" }, { status: 400 });

  const voiceKey = (body.voice as string) ?? "neutral";
  const preset = VOICE_PRESETS[voiceKey] ?? VOICE_PRESETS.neutral;

  const payload: Record<string, unknown> = {
    text,
    format: "mp3",
    latency: "balanced",
    prosody: { speed: 1.0, volume: 0 },
  };
  if (preset.id) payload.reference_id = preset.id;

  try {
    const resp = await fetch(FISH_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Fish Audio error:", err);
      return NextResponse.json({ error: "Vocals generation failed" }, { status: 502 });
    }

    // Stream the audio back as base64 so the browser can play it
    const audioBuffer = await resp.arrayBuffer();
    const base64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      audioBase64: base64,
      mimeType: "audio/mpeg",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
