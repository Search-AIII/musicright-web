import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const REPLICATE_API = "https://api.replicate.com/v1";
// meta/musicgen — stereo-large model for best quality
const MODEL_VERSION = "671ac645ce5e552cc63a54a2bbff63fcf798043355d7b9f025072e4f8f6d9024";

function getToken() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not set");
  return token;
}

// POST /api/generate — start a generation job
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const prompt = (body.prompt as string)?.trim();
  if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

  const duration = Math.min(Math.max(Number(body.duration ?? 15), 5), 60);
  const modelVersion = (body.quality as string) === "large" ? MODEL_VERSION : MODEL_VERSION;

  try {
    const token = getToken();
    const resp = await fetch(`${REPLICATE_API}/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "respond-async",
      },
      body: JSON.stringify({
        version: modelVersion,
        input: {
          prompt,
          duration,
          model_version: "stereo-large",
          output_format: "mp3",
          normalization_strategy: "peak",
        },
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Replicate error:", err);
      return NextResponse.json({ error: "Generation service error" }, { status: 502 });
    }

    const prediction = await resp.json();
    return NextResponse.json({ id: prediction.id, status: prediction.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET /api/generate?id={predictionId} — poll status
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const token = getToken();
    const resp = await fetch(`${REPLICATE_API}/predictions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) return NextResponse.json({ error: "Prediction not found" }, { status: 404 });

    const prediction = await resp.json();
    const output = prediction.output;
    const audioUrl = Array.isArray(output) ? output[0] : output ?? null;

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,         // starting | processing | succeeded | failed
      audioUrl: prediction.status === "succeeded" ? audioUrl : null,
      error: prediction.error ?? null,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
