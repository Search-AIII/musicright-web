import Link from "next/link";

export const metadata = { title: "Privacy Policy — MusicRight.AI" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[#00d4aa] text-sm hover:underline">← Back to MusicRight.AI</Link>
        <h1 className="text-3xl font-black mt-8 mb-2">Privacy Policy</h1>
        <p className="text-[#555] text-sm mb-10">Last updated: May 2026</p>

        {[
          { title: "What we collect", body: "When you use MusicRight.AI, we collect: your email address, artist name, song title, account status information you provide, and diagnosis results. If you sign in with Google, we receive your name, email, and profile picture from Google." },
          { title: "How we use it", body: "We use your information to generate royalty readiness reports, save your song history to your dashboard, send you relevant updates about your songs if you opt in, and improve our diagnosis engine. We do not use your data for advertising." },
          { title: "Data storage", body: "Your data is stored securely in Supabase (PostgreSQL), hosted in the United States. We use row-level security to ensure you can only access your own data." },
          { title: "Third parties", body: "We use Supabase for authentication and database, Google OAuth for sign-in, and optionally Resend for transactional email. We do not sell, rent, or share your personal data with third parties for marketing purposes." },
          { title: "Cookies & sessions", body: "We use cookies to maintain your login session. No tracking or advertising cookies are used." },
          { title: "Your rights", body: "You may request deletion of your account and associated data at any time by emailing privacy@musicright.ai. We will process deletion requests within 30 days." },
          { title: "Contact", body: "For privacy questions or data requests, contact privacy@musicright.ai." },
        ].map(s => (
          <div key={s.title} className="mb-8">
            <h2 className="text-base font-bold text-white mb-2">{s.title}</h2>
            <p className="text-[#a0a0a0] text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
