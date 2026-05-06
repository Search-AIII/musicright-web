import type { SongIntake, DiagnosisResult, ActionItem, RoyaltyRouteStatus, AccountStatus, MetadataReadiness } from "./types";

export function diagnose(intake: SongIntake): DiagnosisResult {
  let score = 100;
  const gaps: string[] = [];

  // ── Metadata readiness ──────────────────────────────────────────────────
  const hasWriters = (intake.writers?.length ?? 0) > 0;
  const splitTotal = intake.splitTotal ?? (intake.writers?.reduce((s, w) => s + (w.split ?? 0), 0) ?? 0);
  const splitComplete = intake.knowsSplits && splitTotal >= 99 && splitTotal <= 101;
  const hasISRC = intake.hasISRC;
  const isReleased = intake.releaseStatus === "released";

  if (!hasWriters)                               { gaps.push("missing_writers");      score -= 15; }
  if (hasWriters && !splitComplete)               { gaps.push("split_incomplete");     score -= 10; }
  if (isReleased && !hasISRC)                    { gaps.push("missing_isrc");         score -= 12; }
  if (!intake.songTitle || !intake.artistName)   { gaps.push("metadata_incomplete");  score -= 8;  }

  // ── Account gaps ────────────────────────────────────────────────────────
  const pro  = intake.accounts.pro;
  const mlc  = intake.accounts.mlc;
  const se   = intake.accounts.soundexchange;
  const dist = intake.accounts.distributor;

  const proStatus  = pro?.status  ?? (intake.accounts.pro  ? pro!.status  : "missing");
  const mlcStatus  = mlc?.status  ?? "missing";
  const seStatus   = se?.status   ?? "missing";
  const distStatus = dist?.status ?? (intake.distributor ? "active" : "missing");

  if (!pro || pro.status === "missing")   { gaps.push("missing_pro_account");          score -= 20; }
  if (!mlc || mlc.status === "missing")   { gaps.push("missing_mlc_account");          score -= 15; }
  if (!se  || se.status  === "missing")   { gaps.push("missing_soundexchange_account"); score -= 10; }
  if (distStatus === "missing")           { gaps.push("missing_distributor");           score -= 10; }

  // ── Registration uncertainty ─────────────────────────────────────────────
  if (pro?.status === "has_account_song_status_unknown")  { gaps.push("pro_song_status_unknown");          score -= 5; }
  if (se?.status  === "has_account_song_status_unknown")  { gaps.push("soundexchange_song_status_unknown"); score -= 5; }

  // ── Copyright ───────────────────────────────────────────────────────────
  const cpr = intake.accounts.copyright;
  if (intake.copyrightChoice === "include" && (!cpr || cpr.status === "missing"))   { gaps.push("copyright_not_started");  score -= 5; }
  if (intake.copyrightChoice === "unsure")                                           { gaps.push("copyright_review_needed"); score -= 2; }

  score = Math.max(0, Math.min(100, score));

  // ── Royalty route mapping ────────────────────────────────────────────────
  function routeFromStatus(s: AccountStatus | undefined, hasSongStatus?: boolean): RoyaltyRouteStatus {
    if (!s || s === "missing") return "blocked";
    if (s === "has_account_song_status_unknown") return "at_risk";
    if (s === "unknown") return "at_risk";
    return "active";
  }

  const performance     = routeFromStatus(pro?.status);
  const mechanical      = routeFromStatus(mlc?.status);
  const digitalPerf     = routeFromStatus(se?.status);
  const distribution: RoyaltyRouteStatus = (distStatus === "active" && hasISRC) ? "active" : (distStatus === "active") ? "partial" : "blocked";
  const sync: RoyaltyRouteStatus = (!hasWriters || !splitComplete) ? "at_risk" : "unknown";

  // ── Action plan ──────────────────────────────────────────────────────────
  const actionPlan: ActionItem[] = [];

  if (!hasWriters || !splitComplete)
    actionPlan.push({ priority: "high", title: "Confirm writer splits", desc: "Document who wrote the song and each person's ownership percentage.", effort: "15 min", cost: "Free", affects: "Sync licensing, publishing royalties, MLC registration" });

  if (!pro || pro.status === "missing")
    actionPlan.push({ priority: "high", title: "Register with a PRO (ASCAP, BMI, or SESAC)", desc: "A PRO collects performance royalties every time your song plays publicly.", effort: "30–60 min", cost: "Free (ASCAP/BMI) or annual fee (SESAC)", affects: "Performance royalties, publishing royalties" });

  if (!mlc || mlc.status === "missing")
    actionPlan.push({ priority: "high", title: "Register with The MLC", desc: "The MLC pays mechanical royalties on every US on-demand stream.", effort: "20–40 min", cost: "Free", affects: "Mechanical royalties on Spotify, Apple Music, etc." });

  if (isReleased && !hasISRC)
    actionPlan.push({ priority: "high", title: "Obtain and register your ISRC", desc: "The ISRC is the unique ID for this recording. Without it, royalty collection may be incomplete.", effort: "10 min", cost: "Free via most distributors", affects: "Streaming distribution, SoundExchange, neighboring rights" });

  if (!se || se.status === "missing")
    actionPlan.push({ priority: "medium", title: "Register with SoundExchange", desc: "SoundExchange collects digital performance royalties for radio streams on Pandora, SiriusXM, and more.", effort: "20 min", cost: "Free", affects: "Digital performance royalties" });

  if (pro?.status === "has_account_song_status_unknown")
    actionPlan.push({ priority: "medium", title: "Verify this song is registered with your PRO", desc: "You have a PRO account but we couldn't confirm this song was registered. Log in and check.", effort: "10 min", cost: "Free", affects: "Performance royalties" });

  if (se?.status === "has_account_song_status_unknown")
    actionPlan.push({ priority: "medium", title: "Verify this recording is in SoundExchange", desc: "You have a SoundExchange account but the recording status is unknown.", effort: "10 min", cost: "Free", affects: "Digital performance royalties" });

  if (!intake.accounts.publishingAdmin)
    actionPlan.push({ priority: "medium", title: "Consider a publishing admin", desc: "A publishing admin (Songtrust, DistroKid Publishing, etc.) can help collect international royalties your PRO may miss.", effort: "30 min setup", cost: "$0–$99/yr depending on provider", affects: "International performance and mechanical royalties" });

  if (intake.copyrightChoice === "include" && (!cpr || cpr.status === "missing"))
    actionPlan.push({ priority: "low", title: "Register copyright with the U.S. Copyright Office", desc: "Provides legal protection and enables statutory damages in infringement cases.", effort: "1–2 hrs", cost: "$45–$65 per registration", affects: "Legal protection, sync licensing negotiation" });

  // ── Budget-aware filtering ────────────────────────────────────────────────
  if (intake.budgetTier === "minimal") {
    // Keep only first 3 high-priority items
    const filtered = actionPlan.filter(a => a.priority === "high").slice(0, 3);
    if (filtered.length < actionPlan.length)
      filtered.push(...actionPlan.filter(a => a.priority === "medium").slice(0, 1));
    actionPlan.splice(0, actionPlan.length, ...filtered);
  }

  // ── Active route count ────────────────────────────────────────────────────
  const routes = [performance, mechanical, digitalPerf, distribution, sync];
  const activeRouteCount = routes.filter(r => r === "active").length;

  // ── Metadata readiness ────────────────────────────────────────────────────
  let metadataReadiness: MetadataReadiness = "ready";
  if (gaps.includes("missing_writers") || gaps.includes("metadata_incomplete")) metadataReadiness = "blocked";
  else if (gaps.includes("split_incomplete") || gaps.includes("missing_isrc")) metadataReadiness = "partial";

  return {
    score,
    metadataReadiness,
    gaps,
    royaltyRoutes: { performance, mechanical, digitalPerformance: digitalPerf, distribution, sync },
    accountCoverage: {
      pro:           (pro?.status  ?? "missing") as AccountStatus,
      mlc:           (mlc?.status  ?? "missing") as AccountStatus,
      soundexchange: (se?.status   ?? "missing") as AccountStatus,
      distributor:   distStatus as AccountStatus,
      publishingAdmin: (intake.accounts.publishingAdmin?.status ?? "unknown") as AccountStatus,
      copyright:     (cpr?.status  ?? "unknown") as AccountStatus,
    },
    actionPlan,
    activeRouteCount,
    totalRouteCount: 5,
  };
}
