"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/audit"
            className="h-9 px-4 rounded-lg bg-[#00d4aa] text-[#080808] text-sm font-semibold hover:bg-[#00b894] transition-colors"
          >
            Free audit →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#a0a0a0]"
          onClick={() => setOpen(!open)}
        >
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
          <Link href="#features" onClick={() => setOpen(false)} className="text-[#a0a0a0] hover:text-white">Features</Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="text-[#a0a0a0] hover:text-white">Pricing</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="text-[#a0a0a0] hover:text-white">Dashboard</Link>
          <Link href="/audit" className="h-10 flex items-center justify-center rounded-lg bg-[#00d4aa] text-[#080808] font-semibold">
            Free audit →
          </Link>
        </div>
      )}
    </nav>
  );
}
