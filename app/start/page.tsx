import Link from "next/link";

export const metadata = { title: "Start Your Song Check" };

export default function StartPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-14">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#080808" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="2" fill="#080808" />
          </svg>
        </div>
        <span className="font-bold text-[15px]">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5 text-[#00d4aa] text-xs font-semibold tracking-wide mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
          ADD ONE SONG · GET YOUR ROYALTY ROADMAP
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
          Add one song. See what could be<br />
          <span className="text-[#00d4aa]">blocking your royalties.</span>
        </h1>
        <p className="text-[#a0a0a0] text-base mb-10 max-w-md mx-auto leading-relaxed">
          MusicRight helps you organize registrations, accounts, and royalty routes across
          PRO, MLC, SoundExchange, distributor, and copyright workflows.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* First-time */}
          <Link href="/start/first-time" className="group rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-7 text-left hover:border-[#00d4aa]/30 transition-all flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center text-xl">🚀</div>
            <div>
              <div className="text-white font-bold text-base mb-1 group-hover:text-[#00d4aa] transition-colors">
                I&apos;m starting from scratch
              </div>
              <p className="text-[#555] text-sm leading-relaxed">
                Tell us about your song and budget. We&apos;ll map the best setup path to get you royalty-ready.
              </p>
            </div>
            <div className="text-[#00d4aa] text-sm font-semibold mt-auto">Get my setup plan →</div>
          </Link>

          {/* Experienced */}
          <Link href="/start/experienced" className="group rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-7 text-left hover:border-[#00d4aa]/30 transition-all flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center text-xl">🏦</div>
            <div>
              <div className="text-white font-bold text-base mb-1 group-hover:text-[#00d4aa] transition-colors">
                I&apos;ve registered songs before
              </div>
              <p className="text-[#555] text-sm leading-relaxed">
                Already have accounts? Tell MusicRight what you have — we&apos;ll organize what&apos;s covered and what&apos;s missing.
              </p>
            </div>
            <div className="text-[#00d4aa] text-sm font-semibold mt-auto">Review my setup →</div>
          </Link>
        </div>

        <p className="text-[#555] text-xs">
          Free · No credit card · Takes about 3 minutes
        </p>
      </div>
    </div>
  );
}
