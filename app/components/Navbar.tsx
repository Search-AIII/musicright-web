"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase-browser";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar?: string; initial: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) return;
      const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Artist";
      setUser({ name, avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture, initial: name[0].toUpperCase() });
    });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#080808" />
              <circle cx="7" cy="7" r="6" stroke="#080808" strokeWidth="1.5" />
              <path d="M4 7h6M7 4v6" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[#a0a0a0]">
          <Link href="/tools" className="hover:text-white transition-colors">Free Tools</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/generate" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="text-[#00d4aa] text-xs">✦</span> Generate
          </Link>
        </div>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] text-xs font-bold">
                    {user.initial}
                  </div>
                )}
                {user.name}
              </Link>
              <Link href="/start" className="h-9 px-4 rounded-lg bg-[#00d4aa] text-[#080808] text-sm font-semibold hover:bg-[#00b894] transition-colors">
                + New Song Check
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/early-access" className="h-9 px-4 rounded-lg border border-[#a78bfa]/30 bg-[#a78bfa]/5 text-[#a78bfa] text-sm font-semibold hover:bg-[#a78bfa]/10 transition-colors">
                $5 Early Access
              </Link>
              <Link href="/start/first-time" className="h-9 px-4 rounded-lg bg-[#00d4aa] text-[#080808] text-sm font-semibold hover:bg-[#00b894] transition-colors">
                Check My Song →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-[#a0a0a0]" onClick={() => setOpen(!open)}>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#080808] px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/tools" onClick={() => setOpen(false)} className="text-[#a0a0a0] hover:text-white">Free Tools</Link>
          <Link href="/#pricing" onClick={() => setOpen(false)} className="text-[#a0a0a0] hover:text-white">Pricing</Link>
          <Link href="/generate" onClick={() => setOpen(false)} className="text-[#00d4aa] font-semibold hover:text-[#00b894] flex items-center gap-1.5"><span>✦</span> Generate</Link>
          {user ? (
            <Link href="/dashboard" className="h-10 flex items-center justify-center rounded-lg border border-[#2e2e2e] text-white font-semibold">
              My Dashboard
            </Link>
          ) : (
            <Link href="/auth/login" className="h-10 flex items-center justify-center rounded-lg border border-[#2e2e2e] text-white font-semibold">
              Sign in
            </Link>
          )}
          <Link href="/start/first-time" className="h-10 flex items-center justify-center rounded-lg bg-[#00d4aa] text-[#080808] font-semibold" onClick={() => setOpen(false)}>
            Check My Song →
          </Link>
        </div>
      )}
    </nav>
  );
}
