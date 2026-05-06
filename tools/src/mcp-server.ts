#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { diagnose } from "./lib/diagnosis.js";
import { parseAccountDescription, inferDistributor } from "./lib/parser.js";
import type { SongIntake } from "./lib/types.js";

const server = new McpServer({
  name: "musicright",
  version: "1.0.0",
});

const AccountStatusSchema = z.enum(["active", "missing", "unknown", "has_account_song_status_unknown"]);

const IntakeAccountSchema = z.object({
  provider: z.string().optional(),
  status: AccountStatusSchema,
  emailOrUsername: z.string().optional(),
});

const SongIntakeSchema = z.object({
  userType: z.enum(["experienced", "first_time"]),
  songTitle: z.string(),
  artistName: z.string(),
  email: z.string(),
  releaseStatus: z.enum(["released", "unreleased"]),
  distributor: z.string().optional(),
  hasISRC: z.boolean().optional(),
  isrc: z.string().optional(),
  writers: z.array(z.object({
    name: z.string(),
    split: z.number().optional(),
    proAffiliation: z.string().optional(),
  })).optional(),
  knowsSplits: z.boolean().optional(),
  splitTotal: z.number().optional(),
  budgetTier: z.enum(["minimal", "balanced", "best_coverage"]).optional(),
  copyrightChoice: z.enum(["include", "not_now", "unsure", "already_registered", "exclude_from_plan"]).optional(),
  freeformAccountDescription: z.string().optional(),
  accounts: z.object({
    pro: IntakeAccountSchema.optional(),
    mlc: IntakeAccountSchema.optional(),
    soundexchange: IntakeAccountSchema.optional(),
    distributor: IntakeAccountSchema.optional(),
    publishingAdmin: IntakeAccountSchema.optional(),
    copyright: IntakeAccountSchema.optional(),
  }),
});

server.registerTool(
  "musicright_diagnose",
  {
    description: "Run a full royalty health diagnosis for a song. Returns a score (0–100), gaps, royalty route statuses, and a prioritized action plan.",
    inputSchema: {
      intake: SongIntakeSchema.describe("Full SongIntake object. Use musicright_parse_accounts to populate accounts from freeform text."),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  async ({ intake }) => {
    const result = diagnose(intake as SongIntake);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.registerTool(
  "musicright_parse_accounts",
  {
    description: "Parse a freeform description of a musician's accounts (PRO, MLC, distributor, etc.) and return structured account statuses. Use before musicright_diagnose when the user describes their situation in natural language.",
    inputSchema: {
      text: z.string().describe("Freeform description, e.g. 'I have ASCAP but haven't registered this song, DistroKid active, no MLC'"),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  async ({ text }) => {
    const accounts = parseAccountDescription(text);
    const distributor = inferDistributor(text);
    return {
      content: [{ type: "text", text: JSON.stringify({ accounts, inferredDistributor: distributor }, null, 2) }],
    };
  }
);

server.registerTool(
  "musicright_full_check",
  {
    description: "One-shot royalty health check. Parses account description from natural language then runs full diagnosis. Returns score, gaps, routes, and action plan.",
    inputSchema: {
      songTitle:   z.string().describe("Song title"),
      artistName:  z.string().describe("Artist or band name"),
      released:    z.boolean().optional().describe("Has the song been released? Default true"),
      hasISRC:     z.boolean().optional().describe("Does the recording have an ISRC code?"),
      writers:     z.string().optional().describe("Writers as comma-separated 'Name split%', e.g. 'Jane Doe 50%, John Smith 50%'"),
      accounts:    z.string().optional().describe("Natural language account description, e.g. 'I have ASCAP, DistroKid, but no MLC yet'"),
      budgetTier:  z.enum(["minimal", "balanced", "best_coverage"]).optional().describe("Budget preference for action plan. Default: balanced"),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  async ({ songTitle, artistName, released, hasISRC, writers, accounts, budgetTier }) => {
    const accountText = accounts ?? "";
    const parsedAccounts = parseAccountDescription(accountText);
    const inferredDist = inferDistributor(accountText);

    const writerList: SongIntake["writers"] = [];
    if (writers) {
      for (const w of writers.split(",")) {
        const match = w.trim().match(/^(.+?)\s+(\d+)%?$/);
        if (match) {
          writerList.push({ name: match[1].trim(), split: Number(match[2]) });
        } else {
          writerList.push({ name: w.trim() });
        }
      }
    }

    const intake: SongIntake = {
      userType: "experienced",
      songTitle,
      artistName,
      email: "",
      releaseStatus: released === false ? "unreleased" : "released",
      distributor: inferredDist,
      hasISRC: hasISRC ?? undefined,
      writers: writerList.length > 0 ? writerList : undefined,
      knowsSplits: writerList.some(w => w.split !== undefined),
      splitTotal: writerList.reduce((s, w) => s + (w.split ?? 0), 0) || undefined,
      budgetTier: budgetTier ?? "balanced",
      accounts: parsedAccounts,
    };

    const result = diagnose(intake);
    const output = {
      song: { title: songTitle, artist: artistName },
      score: result.score,
      metadataReadiness: result.metadataReadiness,
      gaps: result.gaps,
      royaltyRoutes: result.royaltyRoutes,
      accountCoverage: result.accountCoverage,
      topActions: result.actionPlan.filter(a => a.priority === "high"),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
