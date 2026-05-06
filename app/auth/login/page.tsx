"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const supabase = createClient();

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) { setMessage({ text: error.message, type: "error" }); setLoading(false); }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email, password,
            options: { emailRedirectTo: `${location.origin}/auth/callback` },
          });

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else if (mode === "signup") {
      setMessage({ text: "Check your email to confirm your account.", type: "success" });
    } else {
      location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#00b4d8] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="3" fill="#080808" />
            <circle cx="7" cy="7" r="6" stroke="#080808" strokeWidth="1.5" />
            <path d="M4 7h6M7 4v6" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-bold text-base tracking-tight text-white">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-8">
          <h1 className="text-xl font-black text-white mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-[#555] text-sm mb-6">
            {mode === "signin" ? "Sign in to your MusicRight account." : "Start your free royalty check."}
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-11 rounded-xl border border-[#2e2e2e] text-white font-semibold text-sm flex items-center justify-center gap-3 hover:border-[#00d4aa]/40 hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-[#555] text-xs">or</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 rounded-lg bg-[#111] border border-[#2e2e2e] px-4 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
            />

            {message && (
              <div className={`text-xs px-3 py-2 rounded-lg ${message.type === "error" ? "text-[#ff4757] bg-[#ff4757]/10" : "text-[#00d4aa] bg-[#00d4aa]/10"}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm hover:bg-[#00b894] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-5 text-xs text-[#555]">
            {mode === "signin" ? (
              <>
                <span>No account?{" "}
                  <button onClick={() => { setMode("signup"); setMessage(null); }} className="text-[#00d4aa] hover:underline">Sign up free</button>
                </span>
                <button onClick={async () => {
                  if (!email) { setMessage({ text: "Enter your email first.", type: "error" }); return; }
                  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/dashboard` });
                  setMessage(error ? { text: error.message, type: "error" } : { text: "Reset link sent.", type: "success" });
                }} className="hover:text-white transition-colors">Forgot password?</button>
              </>
            ) : (
              <span>Already have an account?{" "}
                <button onClick={() => { setMode("signin"); setMessage(null); }} className="text-[#00d4aa] hover:underline">Sign in</button>
              </span>
            )}
          </div>
        </div>

        <p className="text-center text-[#333] text-xs mt-6">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="hover:text-[#555]">Terms</Link>
          {" "}and{" "}
          <Link href="/legal/privacy" className="hover:text-[#555]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
