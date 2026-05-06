export type UserType = "experienced" | "first_time";

export type AccountStatus =
  | "active"
  | "missing"
  | "unknown"
  | "has_account_song_status_unknown";

export type BudgetTier = "minimal" | "balanced" | "best_coverage";

export type MetadataReadiness = "ready" | "partial" | "blocked";

export type RoyaltyRouteStatus = "active" | "at_risk" | "blocked" | "partial" | "unknown";

export interface IntakeAccount {
  provider?: string;
  status: AccountStatus;
  emailOrUsername?: string;
}

export interface WriterInput {
  name: string;
  split?: number;
  proAffiliation?: string;
}

export interface SongIntake {
  userType: UserType;
  songTitle: string;
  artistName: string;
  email: string;
  releaseStatus: "released" | "unreleased";
  distributor?: string;
  hasISRC?: boolean;
  isrc?: string;
  writers?: WriterInput[];
  knowsSplits?: boolean;
  splitTotal?: number;
  budgetTier?: BudgetTier;
  copyrightChoice?: "include" | "not_now" | "unsure" | "already_registered" | "exclude_from_plan";
  freeformAccountDescription?: string;
  accounts: {
    pro?: IntakeAccount;
    mlc?: IntakeAccount;
    soundexchange?: IntakeAccount;
    distributor?: IntakeAccount;
    publishingAdmin?: IntakeAccount;
    copyright?: IntakeAccount;
  };
}

export interface ActionItem {
  priority: "high" | "medium" | "low";
  title: string;
  desc: string;
  effort: string;
  cost: string;
  affects: string;
}

export interface DiagnosisResult {
  score: number;
  metadataReadiness: MetadataReadiness;
  gaps: string[];
  royaltyRoutes: {
    performance: RoyaltyRouteStatus;
    mechanical: RoyaltyRouteStatus;
    digitalPerformance: RoyaltyRouteStatus;
    distribution: RoyaltyRouteStatus;
    sync: RoyaltyRouteStatus;
  };
  accountCoverage: {
    pro: AccountStatus;
    mlc: AccountStatus;
    soundexchange: AccountStatus;
    distributor: AccountStatus;
    publishingAdmin: AccountStatus;
    copyright: AccountStatus;
  };
  actionPlan: ActionItem[];
  activeRouteCount: number;
  totalRouteCount: number;
}
