import { NextRequest, NextResponse } from "next/server";
import { normalizeIntake } from "../../../lib/normalize";
import { diagnose } from "../../../lib/diagnosis";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { createClient } from "../../../lib/supabase-server";
import type { SongIntake, DiagnosisResult } from "../../../lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let raw: Partial<SongIntake>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!raw.songTitle || !raw.artistName || !raw.email) {
    return NextResponse.json({ error: "songTitle, artistName, email are required" }, { status: 400 });
  }

  // Normalize: trim, merge freeform parse, infer distributor, compute splits
  const intake = normalizeIntake(raw);

  // Run deterministic rules engine
  const diagnosis: DiagnosisResult = diagnose(intake);

  // Build the enriched output (architecture v1 DiagnosisOutput shape)
  const output = buildDiagnosisOutput(intake, diagnosis);

  // Get current user id if authenticated (non-blocking)
  let userId: string | null = null;
  try {
    const serverClient = await createClient();
    const { data: { user } } = await serverClient.auth.getUser();
    userId = user?.id ?? null;
  } catch {}

  // Persist to Supabase (non-blocking — failure doesn't break response)
  const submissionId = await persistSubmission(intake, diagnosis, output, userId);

  return NextResponse.json({
    success: true,
    id: submissionId,
    diagnosis: output,
  });
}

function buildDiagnosisOutput(intake: SongIntake, r: DiagnosisResult) {
  const writers = intake.writers ?? [];
  const splitTotal = intake.splitTotal ?? writers.reduce((s, w) => s + (w.split ?? 0), 0);

  return {
    id: "",
    songTitle: intake.songTitle,
    artistName: intake.artistName,
    userType: intake.userType,
    score: r.score,

    metadataReadiness: {
      status: r.metadataReadiness,
      reasons: r.gaps
        .filter(g => ["missing_writers", "split_incomplete", "missing_isrc", "metadata_incomplete"].includes(g))
        .map(g => gapToReason(g)),
    },

    ownership: {
      writerCount: writers.length,
      splitTotal: splitTotal > 0 ? splitTotal : null,
      confidence: writers.length > 0 && splitTotal >= 99 ? "high" : writers.length > 0 ? "medium" : "low",
      issues: r.gaps
        .filter(g => ["missing_writers", "split_incomplete"].includes(g))
        .map(g => gapToReason(g)),
    } as { writerCount: number; splitTotal: number | null; confidence: "high" | "medium" | "low"; issues: string[] },

    legalReadiness: {
      copyrightChoice: intake.copyrightChoice ?? null,
      status: intake.copyrightChoice === "already_registered" ? "already_registered"
        : intake.copyrightChoice === "include" ? "included"
        : intake.copyrightChoice === "not_now" || intake.copyrightChoice === "exclude_from_plan" ? "not_included"
        : "unclear",
      notes: r.gaps
        .filter(g => ["copyright_not_started", "copyright_review_needed"].includes(g))
        .map(g => gapToReason(g)),
    } as { copyrightChoice: string | null; status: string; notes: string[] },

    accountCoverage: [
      { system: "PRO",            provider: intake.accounts.pro?.provider,            status: r.accountCoverage.pro,            note: accountNote(r.accountCoverage.pro) },
      { system: "MLC",            provider: intake.accounts.mlc?.provider,            status: r.accountCoverage.mlc,            note: accountNote(r.accountCoverage.mlc) },
      { system: "SoundExchange",  provider: undefined,                                status: r.accountCoverage.soundexchange,  note: accountNote(r.accountCoverage.soundexchange) },
      { system: "Distributor",    provider: intake.distributor,                       status: r.accountCoverage.distributor,    note: accountNote(r.accountCoverage.distributor) },
      { system: "Publishing Admin", provider: intake.accounts.publishingAdmin?.provider, status: r.accountCoverage.publishingAdmin, note: accountNote(r.accountCoverage.publishingAdmin) },
      { system: "Copyright",      provider: undefined,                                status: r.accountCoverage.copyright,      note: accountNote(r.accountCoverage.copyright) },
    ],

    registrationGaps: r.gaps.map(g => ({
      code: g,
      title: gapTitle(g),
      reason: gapToReason(g),
      affects: gapAffects(g),
      severity: gapSeverity(g),
    })),

    royaltyRoutes: [
      { route: "Performance",        status: r.royaltyRoutes.performance,        reason: routeReason("performance", r.royaltyRoutes.performance) },
      { route: "Mechanical",         status: r.royaltyRoutes.mechanical,         reason: routeReason("mechanical", r.royaltyRoutes.mechanical) },
      { route: "Digital Performance",status: r.royaltyRoutes.digitalPerformance, reason: routeReason("digitalPerformance", r.royaltyRoutes.digitalPerformance) },
      { route: "Distribution",       status: r.royaltyRoutes.distribution,       reason: routeReason("distribution", r.royaltyRoutes.distribution) },
      { route: "Sync",               status: r.royaltyRoutes.sync,               reason: routeReason("sync", r.royaltyRoutes.sync) },
    ],

    costSummary: {
      effort: r.actionPlan.filter(a => a.priority === "high").length >= 3 ? "high"
        : r.actionPlan.filter(a => a.priority === "high").length >= 1 ? "medium" : "low",
      estimatedRange: intake.budgetTier === "best_coverage" ? "medium_to_high"
        : intake.budgetTier === "minimal" ? "low" : "low_to_medium",
      notes: r.actionPlan.map(a => `${a.title}: ${a.cost}`),
    } as { effort: "low" | "medium" | "high"; estimatedRange: string; notes: string[] },

    nextActions: r.actionPlan.map((a, i) => ({
      priority: i + 1,
      title: a.title,
      description: a.desc,
      canMusicRightHelp: ["Register with a PRO", "Register with The MLC", "SoundExchange", "publishing admin"].some(k => a.title.includes(k)),
    })),

    createdAt: new Date().toISOString(),
  };
}

async function persistSubmission(
  intake: SongIntake,
  diagnosis: DiagnosisResult,
  output: ReturnType<typeof buildDiagnosisOutput>,
  userId: string | null,
): Promise<string | null> {
  try {
    const db = getSupabaseAdmin();
    if (!db) return null;

    const { data, error } = await db
      .from("mvp_song_submissions")
      .insert({
        user_id: userId,
        user_type: intake.userType,
        email: intake.email,
        artist_name: intake.artistName,
        song_title: intake.songTitle,
        release_status: intake.releaseStatus,
        raw_input_json: intake,
        diagnosis_json: output,
        source: "web",
      })
      .select("id")
      .single();

    if (error) { console.error("DB insert error:", error.message); return null; }
    return data?.id ?? null;
  } catch (e) {
    console.error("Persist failed:", e);
    return null;
  }
}

// ── Label helpers ────────────────────────────────────────────────────────────

function accountNote(s: string): string {
  return {
    active: "Registered and active",
    missing: "Not registered — may miss royalties",
    unknown: "Status uncertain",
    has_account_song_status_unknown: "Account exists but song registration unconfirmed",
  }[s] ?? "";
}

function gapTitle(g: string): string {
  return {
    missing_writers: "No writers documented",
    split_incomplete: "Ownership splits incomplete",
    missing_isrc: "No ISRC code",
    metadata_incomplete: "Incomplete song metadata",
    missing_pro_account: "No PRO registration",
    missing_mlc_account: "No MLC registration",
    missing_soundexchange_account: "No SoundExchange registration",
    missing_distributor: "No distributor",
    pro_song_status_unknown: "PRO song registration unconfirmed",
    soundexchange_song_status_unknown: "SoundExchange song registration unconfirmed",
    copyright_not_started: "Copyright not registered",
    copyright_review_needed: "Copyright choice unclear",
  }[g] ?? g;
}

function gapToReason(g: string): string {
  return {
    missing_writers: "No writer credits on file — may affect publishing royalties and sync licensing",
    split_incomplete: "Writer splits don't add up to 100% — ownership is ambiguous",
    missing_isrc: "Released recordings need an ISRC to be tracked across platforms",
    metadata_incomplete: "Song title or artist name missing — blocking downstream registration",
    missing_pro_account: "No PRO means performance royalties (radio, public play) cannot be collected",
    missing_mlc_account: "No MLC means US mechanical royalties from streams may not be claimed",
    missing_soundexchange_account: "No SoundExchange means digital radio royalties (Pandora, SiriusXM) uncollected",
    missing_distributor: "No distributor means the recording isn't on streaming platforms",
    pro_song_status_unknown: "PRO account exists but this song may not be registered",
    soundexchange_song_status_unknown: "SoundExchange account exists but recording status is unclear",
    copyright_not_started: "Copyright registration was requested but not yet started",
    copyright_review_needed: "Copyright choice is unclear — may affect legal protection",
  }[g] ?? g;
}

function gapAffects(g: string): string[] {
  return {
    missing_writers: ["Sync licensing", "Publishing royalties", "MLC registration"],
    split_incomplete: ["Publishing royalties", "Sync licensing"],
    missing_isrc: ["Streaming distribution", "SoundExchange", "Neighboring rights"],
    metadata_incomplete: ["All downstream registrations"],
    missing_pro_account: ["Performance royalties"],
    missing_mlc_account: ["Mechanical royalties"],
    missing_soundexchange_account: ["Digital performance royalties"],
    missing_distributor: ["Distribution", "Streaming revenue"],
    pro_song_status_unknown: ["Performance royalties"],
    soundexchange_song_status_unknown: ["Digital performance royalties"],
    copyright_not_started: ["Legal protection", "Sync licensing"],
    copyright_review_needed: ["Legal protection"],
  }[g] ?? [];
}

function gapSeverity(g: string): "high" | "medium" | "low" {
  const high = ["missing_pro_account", "missing_mlc_account", "missing_isrc", "missing_writers", "metadata_incomplete"];
  const medium = ["split_incomplete", "missing_soundexchange_account", "pro_song_status_unknown", "soundexchange_song_status_unknown", "missing_distributor"];
  if (high.includes(g)) return "high";
  if (medium.includes(g)) return "medium";
  return "low";
}

function routeReason(route: string, status: string): string {
  if (status === "active") return "All required registrations in place";
  const blocked: Record<string, string> = {
    performance: "PRO account missing or unconfirmed",
    mechanical: "MLC registration missing",
    digitalPerformance: "SoundExchange registration missing or unconfirmed",
    distribution: "Distributor or ISRC missing",
    sync: "Writer splits incomplete or unconfirmed",
  };
  const atRisk: Record<string, string> = {
    performance: "PRO account exists but song registration unconfirmed",
    digitalPerformance: "SoundExchange account exists but recording status unclear",
    sync: "Ownership documentation incomplete",
  };
  if (status === "at_risk") return atRisk[route] ?? "Registration status uncertain";
  if (status === "blocked") return blocked[route] ?? "Required registration missing";
  if (status === "partial") return "Partially set up — ISRC or distributor missing";
  return "Cannot determine — insufficient information";
}
