import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase-server";

export const runtime = "nodejs";

// Monthly leak estimate per gap code (rough industry averages, shown as "up to X")
const GAP_MONTHLY_LEAK: Record<string, number> = {
  missing_mlc_account: 340,
  missing_soundexchange_account: 180,
  missing_pro_account: 200,
  pro_song_status_unknown: 150,
  soundexchange_song_status_unknown: 100,
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error } = await supabase
    .from("mvp_song_submissions")
    .select("id, created_at, song_title, artist_name, release_status, user_type, raw_input_json, diagnosis_json")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("songs fetch error:", error.message);
    return NextResponse.json({ error: "Failed to load songs" }, { status: 500 });
  }

  const songs = (rows ?? []).map((row) => {
    const raw = row.raw_input_json as Record<string, unknown> ?? {};
    const diag = row.diagnosis_json as Record<string, unknown> ?? {};
    const gaps = (diag.registrationGaps as Array<{ code: string; title: string; severity: string }>) ?? [];
    const score = (diag.score as number) ?? 0;

    const status: "full" | "partial" | "none" =
      score >= 80 ? "full" : score >= 30 ? "partial" : "none";

    // Account coverage as flat object {system -> status}
    const coverageArr = (diag.accountCoverage as Array<{ system: string; status: string }>) ?? [];
    const accountCoverage: Record<string, string> = {};
    for (const c of coverageArr) {
      accountCoverage[c.system] = c.status;
    }

    return {
      id: row.id,
      songTitle: row.song_title,
      artistName: row.artist_name,
      releaseStatus: row.release_status,
      createdAt: row.created_at,
      score,
      status,
      hasISRC: raw.hasISRC === true,
      distributor: (raw.distributor as string) ?? null,
      gaps,
      accountCoverage,
      actions: (diag.nextActions as Array<{ title: string; description: string }>) ?? [],
    };
  });

  // Aggregate leaks across all songs
  const leakMap: Record<string, { title: string; songCount: number; monthlyLeak: number | null }> = {};
  for (const song of songs) {
    for (const gap of song.gaps) {
      if (!leakMap[gap.code]) {
        leakMap[gap.code] = { title: gap.title, songCount: 0, monthlyLeak: GAP_MONTHLY_LEAK[gap.code] ?? null };
      }
      leakMap[gap.code].songCount += 1;
    }
  }
  const leaks = Object.entries(leakMap).map(([code, v]) => ({
    code,
    title: v.title,
    songCount: v.songCount,
    monthlyLeak: v.monthlyLeak ? v.monthlyLeak * v.songCount : null,
    annualLeak: v.monthlyLeak ? v.monthlyLeak * v.songCount * 12 : null,
  }));

  // Aggregate actions across all songs (deduped by title)
  const actionMap: Record<string, string> = {};
  for (const song of songs) {
    for (const a of song.actions) {
      if (!actionMap[a.title]) actionMap[a.title] = a.description;
    }
  }
  const actions = Object.entries(actionMap).map(([title, description]) => ({ title, description }));

  const totalMonthlyLeak = leaks.reduce((s, l) => s + (l.monthlyLeak ?? 0), 0);
  const overallScore = songs.length > 0
    ? Math.round(songs.reduce((s, song) => s + song.score, 0) / songs.length)
    : null;

  return NextResponse.json({
    songs,
    leaks,
    actions,
    totalMonthlyLeak,
    totalAnnualLeak: totalMonthlyLeak * 12,
    overallScore,
  });
}
