import Link from "next/link";

export const metadata = { title: "Terms of Service — MusicRight.AI" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[#00d4aa] text-sm hover:underline">← Back to MusicRight.AI</Link>
        <h1 className="text-3xl font-black mt-8 mb-2">Terms of Service</h1>
        <p className="text-[#555] text-sm mb-10">Last updated: May 2026</p>

        {[
          { title: "1. Service Description", body: "MusicRight.AI provides royalty readiness information, registration gap analysis, and account coverage summaries for music creators. Our service is informational and organizational — we do not guarantee specific royalty earnings, and results may vary based on your catalog, registration history, and platform policies." },
          { title: "2. No Earnings Guarantee", body: "Royalty Health Scores, gap analyses, and action plans are estimates based on the information you provide. MusicRight.AI does not guarantee that following our recommendations will result in specific earnings or royalty payments. The music rights landscape is complex and changes frequently." },
          { title: "3. Your Data", body: "By submitting a song for analysis, you grant MusicRight.AI permission to process and store that information to provide and improve our services. We do not sell your personal data to third parties. Song metadata and account information you provide is used solely to generate your royalty readiness report." },
          { title: "4. Paid Services", body: "Setup ($49/song) and Done For You ($149/song) services are processed on a per-song basis. We will contact you to confirm scope before beginning work. Results depend on platform acceptance and your account eligibility. We cannot guarantee registration approval from PROs, The MLC, SoundExchange, or any other third-party platform." },
          { title: "5. AI-Assisted Music", body: "MusicRight.AI can help organize registration planning for AI-assisted music. However, registration eligibility for AI-generated content varies by platform and jurisdiction. We encourage you to review current U.S. Copyright Office guidance on works containing AI-generated material." },
          { title: "6. Limitation of Liability", body: "MusicRight.AI is not liable for indirect, incidental, or consequential damages arising from use of our service. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim." },
          { title: "7. Changes", body: "We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms." },
          { title: "8. Contact", body: "For questions about these terms, contact us at legal@musicright.ai." },
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
