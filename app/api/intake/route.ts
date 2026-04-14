import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, stageName, distributor, pros, songCount, topSong, notes } = body;

  if (!email || !name) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }

  // Save to Supabase if env vars are set
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      await supabase.from("audit_requests").insert({
        name, email,
        stage_name: stageName,
        distributor,
        pros: pros || [],
        song_count: songCount,
        top_song: topSong,
        notes,
        status: "pending",
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Supabase error:", e);
    }
  }

  // Email notification via Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "MusicRight.AI <noreply@musicright.ai>",
          to: process.env.OWNER_EMAIL || "contact@musicright.ai",
          subject: `New audit request — ${stageName}`,
          html: `
            <h2>🎵 New Metadata Audit Request</h2>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Artist:</b> ${stageName}</p>
            <p><b>Distributor:</b> ${distributor}</p>
            <p><b>PROs:</b> ${(pros || []).join(", ") || "None"}</p>
            <p><b>Songs:</b> ${songCount}</p>
            <p><b>Top Song:</b> ${topSong}</p>
            <p><b>Notes:</b> ${notes || "—"}</p>
          `,
        }),
      });
    } catch (e) {
      console.error("Email error:", e);
    }
  }

  return NextResponse.json({ success: true });
}
