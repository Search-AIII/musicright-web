#!/usr/bin/env node
import { Command } from "commander";
import { diagnose } from "./lib/diagnosis.js";
import { parseAccountDescription, inferDistributor } from "./lib/parser.js";
import type { SongIntake } from "./lib/types.js";
import { readFileSync } from "fs";

const program = new Command();

program
  .name("musicright")
  .description("MusicRight royalty health check CLI")
  .version("1.0.0");

program
  .command("check")
  .description("Run a royalty health check for a song")
  .requiredOption("-t, --title <title>", "Song title")
  .requiredOption("-a, --artist <artist>", "Artist name")
  .option("-d, --description <text>", "Your accounts description (freeform)", "")
  .option("--released", "Song is released (default)", true)
  .option("--unreleased", "Song is not yet released")
  .option("--isrc", "Song has an ISRC code")
  .option("--writers <writers>", "Writers as 'Name1 50%, Name2 50%'")
  .option("--budget <tier>", "Budget tier: minimal|balanced|best_coverage", "balanced")
  .option("--json", "Output raw JSON")
  .action((opts) => {
    const released = !opts.unreleased;
    const accounts = parseAccountDescription(opts.description);
    const inferredDist = inferDistributor(opts.description);

    const writerList: SongIntake["writers"] = [];
    if (opts.writers) {
      for (const w of opts.writers.split(",")) {
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
      songTitle: opts.title,
      artistName: opts.artist,
      email: "",
      releaseStatus: released ? "released" : "unreleased",
      distributor: inferredDist,
      hasISRC: opts.isrc ?? undefined,
      writers: writerList.length > 0 ? writerList : undefined,
      knowsSplits: writerList.some(w => w.split !== undefined),
      splitTotal: writerList.reduce((s, w) => s + (w.split ?? 0), 0) || undefined,
      budgetTier: opts.budget as SongIntake["budgetTier"],
      accounts,
    };

    const result = diagnose(intake);

    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    printReport(opts.title, opts.artist, result);
  });

program
  .command("parse")
  .description("Parse freeform account description")
  .argument("<text>", "Account description text")
  .option("--json", "Output raw JSON")
  .action((text, opts) => {
    const accounts = parseAccountDescription(text);
    const dist = inferDistributor(text);
    if (opts.json) {
      console.log(JSON.stringify({ accounts, inferredDistributor: dist }, null, 2));
      return;
    }
    console.log("\n=== Parsed Accounts ===");
    for (const [key, val] of Object.entries(accounts)) {
      if (val) {
        const v = val as { provider?: string; status: string };
        console.log(`  ${key}: ${v.provider ?? key} — ${v.status}`);
      }
    }
    if (dist) console.log(`  inferred distributor: ${dist}`);
  });

program
  .command("score")
  .description("Run diagnosis from a JSON intake file")
  .argument("<file>", "Path to SongIntake JSON file")
  .option("--json", "Output raw JSON")
  .action((file, opts) => {
    let intake: SongIntake;
    try {
      intake = JSON.parse(readFileSync(file, "utf-8"));
    } catch (e) {
      console.error(`Failed to read ${file}: ${(e as Error).message}`);
      process.exit(1);
    }
    const result = diagnose(intake);
    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    printReport(intake.songTitle, intake.artistName, result);
  });

function printReport(title: string, artist: string, result: ReturnType<typeof diagnose>) {
  const bar = (n: number) => "█".repeat(Math.round(n / 5)) + "░".repeat(20 - Math.round(n / 5));
  const routeIcon = (s: string) => ({ active: "✅", at_risk: "⚠️ ", blocked: "❌", partial: "🔶", unknown: "❓" }[s] ?? "❓");

  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`  MusicRight Royalty Check`);
  console.log(`  "${title}" — ${artist}`);
  console.log(`╚══════════════════════════════════════╝`);
  console.log(`\n  Score: ${result.score}/100  [${bar(result.score)}]`);
  console.log(`  Metadata: ${result.metadataReadiness.toUpperCase()}`);

  console.log(`\n  Royalty Routes:`);
  for (const [route, status] of Object.entries(result.royaltyRoutes)) {
    const label = route.replace(/([A-Z])/g, " $1").trim();
    console.log(`    ${routeIcon(status)} ${label.padEnd(22)} ${status}`);
  }

  if (result.gaps.length > 0) {
    console.log(`\n  Gaps found: ${result.gaps.length}`);
    for (const g of result.gaps) {
      console.log(`    • ${g.replace(/_/g, " ")}`);
    }
  }

  if (result.actionPlan.length > 0) {
    console.log(`\n  Action Plan:`);
    for (const a of result.actionPlan) {
      const icon = a.priority === "high" ? "🔴" : a.priority === "medium" ? "🟡" : "🟢";
      console.log(`\n    ${icon} [${a.priority.toUpperCase()}] ${a.title}`);
      console.log(`       ${a.desc}`);
      console.log(`       Effort: ${a.effort}  Cost: ${a.cost}`);
    }
  }
  console.log("");
}

program.parse();
