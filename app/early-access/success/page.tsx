import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Early Access Reserved — MusicRight.AI" };

export default function EarlyAccessSuccessPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-6">
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
        <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30 flex items-center justify-center text-3xl mx-auto mb-6">
          ✓
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-3">You&apos;re in.</h1>
        <p className="text-[#a0a0a0] text-base leading-relaxed mb-8">
          Your $5 Early Access place is reserved. You&apos;re now in the Creator Wallet first-user list.
          We&apos;ll email you next steps as the full product opens.
        </p>

        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6 text-left mb-6">
          <div className="text-[#555] text-[10px] font-bold uppercase tracking-wider mb-4">What happens next</div>
          <div className="flex flex-col gap-4">
            {[
              { n: "1", title: "Add your first song", desc: "Start the guided song packet — title, credits, splits, audio link." },
              { n: "2", title: "MusicRight routes the work", desc: "Copyright Office, PRO, MLC, SoundExchange, and distributor tasks move into the team queue." },
              { n: "3", title: "Track in your Creator Wallet", desc: "Every completed step is recorded. Rewards and discounts unlock as your catalog grows." },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {s.n}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{s.title}</div>
                  <div className="text-[#555] text-xs mt-0.5 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/start"
            className="h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm flex items-center justify-center hover:bg-[#00b894] transition-colors">
            Start Song Packet →
          </Link>
          <Link href="/dashboard"
            className="h-12 px-6 rounded-xl border border-[#2e2e2e] text-white font-semibold text-sm flex items-center justify-center hover:border-[#00d4aa]/40 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
