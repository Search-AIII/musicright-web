import type { SongIntake, IntakeAccount } from "./types";
import { parseAccountDescription, inferDistributor } from "./parser";

export function normalizeIntake(raw: Partial<SongIntake>): SongIntake {
  // String cleanup
  const songTitle = raw.songTitle?.trim() ?? "";
  const artistName = raw.artistName?.trim() ?? "";
  const email = raw.email?.trim().toLowerCase() ?? "";

  // Merge parsed freeform accounts into explicit account values
  let accounts = { ...(raw.accounts ?? {}) };
  if (raw.freeformAccountDescription) {
    const parsed = parseAccountDescription(raw.freeformAccountDescription);
    // Explicit values win; parsed fills gaps
    for (const key of Object.keys(parsed) as Array<keyof typeof parsed>) {
      if (!accounts[key]) {
        accounts[key] = parsed[key] as IntakeAccount;
      }
    }
  }

  // Infer distributor from freeform text if not set
  const distributor = raw.distributor ||
    (raw.freeformAccountDescription ? inferDistributor(raw.freeformAccountDescription) : undefined);

  // If distributor name is set but no distributor account, add it
  if (distributor && !accounts.distributor) {
    accounts.distributor = { provider: distributor, status: "active" };
  }

  // Compute split total from writers if not provided
  const writers = raw.writers?.filter(w => w.name.trim()) ?? [];
  const splitTotal = raw.splitTotal ??
    (writers.length > 0 ? writers.reduce((s, w) => s + (w.split ?? 0), 0) : undefined);
  const knowsSplits = raw.knowsSplits ?? (splitTotal !== undefined && splitTotal > 0);

  return {
    userType: raw.userType ?? "first_time",
    songTitle,
    artistName,
    email,
    releaseStatus: raw.releaseStatus ?? "released",
    distributor,
    hasISRC: raw.hasISRC,
    isrc: raw.isrc?.trim(),
    writers: writers.length > 0 ? writers : undefined,
    knowsSplits,
    splitTotal,
    budgetTier: raw.budgetTier ?? "balanced",
    copyrightChoice: raw.copyrightChoice,
    freeformAccountDescription: raw.freeformAccountDescription?.trim(),
    accounts,
  };
}
