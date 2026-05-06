import type { IntakeAccount, AccountStatus, SongIntake } from "./types";

const PLATFORMS: Record<string, { category: keyof SongIntake["accounts"]; provider: string }[]> = {
  distributor: [
    { category: "distributor", provider: "DistroKid" },
    { category: "distributor", provider: "TuneCore" },
    { category: "distributor", provider: "CD Baby" },
    { category: "distributor", provider: "Amuse" },
    { category: "distributor", provider: "UnitedMasters" },
    { category: "distributor", provider: "AWAL" },
    { category: "distributor", provider: "Stem" },
    { category: "distributor", provider: "RouteNote" },
    { category: "distributor", provider: "Symphonic" },
  ],
  pro: [
    { category: "pro", provider: "ASCAP" },
    { category: "pro", provider: "BMI" },
    { category: "pro", provider: "SESAC" },
    { category: "pro", provider: "PRS" },
    { category: "pro", provider: "SOCAN" },
  ],
  mlc: [
    { category: "mlc", provider: "The MLC" },
    { category: "mlc", provider: "MLC" },
    { category: "mlc", provider: "Harry Fox" },
  ],
  soundexchange: [
    { category: "soundexchange", provider: "SoundExchange" },
  ],
  publishingAdmin: [
    { category: "publishingAdmin", provider: "Songtrust" },
    { category: "publishingAdmin", provider: "DistroKid Publishing" },
    { category: "publishingAdmin", provider: "CD Baby Pro" },
    { category: "publishingAdmin", provider: "Downtown Music" },
    { category: "publishingAdmin", provider: "Sentric" },
  ],
};

const NEGATIVE_INDICATORS = [
  "don't have", "dont have", "no ", "never", "not registered", "haven't", "havent",
  "don't think", "dont think", "not signed up", "missing", "need to",
];
const UNCERTAIN_INDICATORS = [
  "maybe", "think so", "not sure", "unsure", "might", "possibly", "i think", "not certain",
  "probably", "believe", "perhaps",
];
const SONG_UNCERTAIN = [
  "but not sure", "but unsure", "account but", "registered there", "added there",
  "if this song", "for this song", "song is there", "song in there",
];

function detectStatus(text: string, platformIndex: number): AccountStatus {
  // Get surrounding context (50 chars before and after the platform mention)
  const ctx = text.slice(Math.max(0, platformIndex - 60), platformIndex + 80).toLowerCase();

  const isNegative  = NEGATIVE_INDICATORS.some(n => ctx.includes(n));
  const isUncertain = UNCERTAIN_INDICATORS.some(u => ctx.includes(u));
  const isSongUncertain = SONG_UNCERTAIN.some(s => ctx.includes(s));

  if (isNegative) return "missing";
  if (isSongUncertain) return "has_account_song_status_unknown";
  if (isUncertain) return "unknown";
  return "active";
}

export function parseAccountDescription(text: string): Partial<SongIntake["accounts"]> {
  const result: Partial<SongIntake["accounts"]> = {};
  const lower = text.toLowerCase();

  for (const group of Object.values(PLATFORMS)) {
    for (const { category, provider } of group) {
      const idx = lower.indexOf(provider.toLowerCase());
      if (idx === -1) continue;
      const status = detectStatus(text, idx);
      // First match wins per category
      if (!result[category]) {
        result[category] = { provider, status } as IntakeAccount;
      }
    }
  }

  return result;
}

// Also infer distributor from text if mentioned in intake
export function inferDistributor(text: string): string | undefined {
  const lower = text.toLowerCase();
  const distributors = ["distrokid", "tunecore", "cd baby", "amuse", "unitedmasters", "awal", "stem", "routenote", "symphonic"];
  for (const d of distributors) {
    if (lower.includes(d)) {
      // Capitalize properly
      return PLATFORMS.distributor.find(p => p.provider.toLowerCase() === d)?.provider ?? d;
    }
  }
  return undefined;
}
