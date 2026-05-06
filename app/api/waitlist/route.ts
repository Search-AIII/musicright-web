import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email as string)?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const record = {
    email,
    artist_name: (body.artistName as string)?.trim() || null,
    song_title: (body.songTitle as string)?.trim() || null,
    user_type: body.userType as string || null,
    wants_help: body.wantsHelp === true,
    source: (body.source as string) || "results_page",
    notes: (body.notes as string)?.trim() || null,
  };

  const db = getSupabaseAdmin();
  if (db) {
    try {
      const { error } = await db.from("mvp_waitlist").insert(record);
      if (error && !error.message.includes("duplicate")) {
        console.error("Waitlist insert error:", error.message);
      }
    } catch (e) {
      console.error("Waitlist DB error:", e);
    }
  }

  // Notify via email if configured
  if (process.env.RESEND_API_KEY) {
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MusicRight.AI <noreply@musicright.ai>",
        to: process.env.OWNER_EMAIL ?? "contact@musicright.ai",
        subject: `New lead — ${record.artist_name ?? email}`,
        html: `
          <h2>🎵 New MusicRight Lead</h2>
          <p><b>Email:</b> ${email}</p>
          <p><b>Artist:</b> ${record.artist_name ?? "—"}</p>
          <p><b>Song:</b> ${record.song_title ?? "—"}</p>
          <p><b>User type:</b> ${record.user_type ?? "—"}</p>
          <p><b>Wants help:</b> ${record.wants_help ? "Yes" : "No"}</p>
          <p><b>Source:</b> ${record.source}</p>
        `,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
