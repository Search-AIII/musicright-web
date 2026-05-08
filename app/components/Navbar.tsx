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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/8 bg-white/92 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10 2v7.5C10 10.9 8.8 12 7.2 12c-1.7 0-2.9-1-2.9-2.3C4.3 8.4 5.5 7.5 7.2 7.5c.6 0 1.1.1 1.8.4V2H10z" fill="#fff"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight text-[#0a0a0a]">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[#666]">
          <Link href="/tools" className="hover:text-[#0a0a0a] transition-colors">Free Tools</Link>
          <Link href="/#pricing" className="hover:text-[#0a0a0a] transition-colors">Pricing</Link>
          <Link href="/generate" className="hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5">
            <span className="text-[#00d4aa] text-xs">✦</span> Generate
          </Link>
        </div>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#666] hover:text-[#0a0a0a] transition-colors">
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
              <Link href="/start" className="h-9 px-4 rounded-lg bg-[#00d4aa] text-white text-sm font-semibold hover:bg-[#00b894] transition-colors">
                + New Song Check
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-[#666] hover:text-[#0a0a0a] transition-colors">
                Sign in
              </Link>
              <Link href="/early-access" className="h-9 px-4 rounded-lg border border-[#00d4aa] text-[#00d4aa] text-sm font-semibold hover:bg-[#00d4aa]/5 transition-colors">
                $5 Early Access
              </Link>
              <Link href="/auth/login" className="h-9 px-4 rounded-lg bg-[#00d4aa] text-white text-sm font-semibold hover:bg-[#00b894] transition-colors">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-[#666]" onClick={() => setOpen(!open)}>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
        <div className="md:hidden border-t border-black/8 bg-white px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/tools" onClick={() => setOpen(false)} className="text-[#666] hover:text-[#0a0a0a]">Free Tools</Link>
          <Link href="/#pricing" onClick={() => setOpen(false)} className="text-[#666] hover:text-[#0a0a0a]">Pricing</Link>
          <Link href="/generate" onClick={() => setOpen(false)} className="text-[#00d4aa] font-semibold flex items-center gap-1.5"><span>✦</span> Generate</Link>
          {user ? (
            <Link href="/dashboard" className="h-10 flex items-center justify-center rounded-lg border border-[#e5e5e5] text-[#0a0a0a] font-semibold">
              My Dashboard
            </Link>
          ) : (
            <Link href="/auth/login" className="h-10 flex items-center justify-center rounded-lg border border-[#e5e5e5] text-[#0a0a0a] font-semibold">
              Sign in
            </Link>
          )}
          <Link href="/auth/login" className="h-10 flex items-center justify-center rounded-lg bg-[#00d4aa] text-white font-semibold" onClick={() => setOpen(false)}>
            Get started →
          </Link>
        </div>
      )}
    </nav>
  );
}
