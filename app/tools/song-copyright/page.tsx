import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Copyright a Song — Step-by-Step Guide",
  description: "Honest guide to protecting your music. Understand automatic copyright, when to file with the U.S. Copyright Office, and how to do it without a lawyer.",
};

const STEPS = [
  {
    num: "01",
    title: "Understand what you already own",
    body: `Your song is automatically copyrighted the moment it's created and fixed in a tangible form — a recording, a written score, even a voice memo. You don't need to do anything to "get" copyright. You already have it.

What automatic copyright gives you: the right to reproduce, distribute, create derivative works, and publicly perform your song. Anyone who does those things without permission infringes your copyright.

What it doesn't give you: the ability to sue for statutory damages (up to $150,000 per willful infringement) or attorney's fees. For that, you need formal registration.`,
  },
  {
    num: "02",
    title: "Understand the two copyrights in every song",
    body: `Every recorded song has two separate copyrights:

1. The composition copyright — covers the melody and lyrics. This belongs to the songwriter(s).
2. The sound recording copyright — covers the actual recorded performance. This belongs to whoever paid for the recording (usually the artist, producer, or label).

You need to register both separately if you own both. If you're an artist who writes their own songs and funds their own recordings, you own both and should register both.`,
  },
  {
    num: "03",
    title: "Decide whether to register formally",
    body: `Formal registration with the U.S. Copyright Office is optional — but strongly recommended if:
• You're releasing commercially (streaming, sync licensing, radio)
• You have collaborators who might dispute ownership later
• You're pitching to labels, publishers, or sync agents
• You want to sue if someone samples or steals your music

Cost: $45–$65 per registration (online). You can register up to 10 songs on one "group" application for a single fee if they're all unpublished.

The earlier you register, the better. Registration before infringement (or within 3 months of publication) is required to claim statutory damages.`,
  },
  {
    num: "04",
    title: "File with the U.S. Copyright Office",
    body: `Go to copyright.gov and create an account. Use the electronic Copyright Office (eCO) portal — it's the fastest and cheapest method.

For a song (composition):
• Select "Literary Works" for lyrics-only, or "Performing Arts" for music + lyrics
• Upload a deposit copy (MP3, PDF of sheet music, or both)
• Pay $45–$65 online

For a sound recording:
• Select "Sound Recordings"
• Upload the final master recording (MP3 or WAV)
• Pay $45–$65 online

Processing time: 3–13 months for the certificate to arrive. But your effective registration date is the date you filed, which is what matters legally.`,
  },
  {
    num: "05",
    title: "Document your work with timestamps",
    body: `While waiting for your certificate (which takes months), protect yourself with timestamps:
• Send yourself the files by email — creates a dated record
• Upload to a timestamped cloud service (Google Drive, Dropbox)
• Register with your DAW's project save history
• Use a notary for high-stakes works

These aren't substitutes for registration, but they establish a timeline of creation that can support your case if something goes wrong before your certificate arrives.`,
  },
  {
    num: "06",
    title: "Register with your PRO and MLC",
    body: `Copyright registration protects your ownership. PRO and MLC registration makes sure you actually get paid.

ASCAP, BMI, or SESAC collect performance royalties when your song is played live, on radio, or on streaming platforms. The MLC collects mechanical royalties from streaming. Neither has access to your copyright registration — you have to register separately with each.

Missing PRO registration = lost performance royalties.
Missing MLC registration = lost mechanical royalties from streaming.

Both registrations are free and take 10–15 minutes.`,
  },
];

export default function SongCopyrightPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d4aa] to-[#00b4d8]" />
            <span className="font-bold text-sm">MusicRight<span className="text-[#00d4aa]">.AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-[#555] text-sm hover:text-white transition-colors">← All Tools</Link>
            <Link href="/start" className="h-8 px-4 rounded-lg bg-[#00d4aa] text-[#080808] text-xs font-bold hover:bg-[#00b894] transition-colors">
              Royalty Check →
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-10">
          <Link href="/tools" className="text-[#555] text-sm hover:text-[#a0a0a0] mb-4 block">← All Tools</Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a1a1a] text-[#555] text-xs font-semibold mb-4">
            Free Guide · Updated 2025
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">How to Copyright a Song</h1>
          <p className="text-[#a0a0a0] text-base leading-relaxed">
            No lawyers, no jargon. Here&apos;s exactly what you own automatically, what formal registration gets you,
            and how to file with the U.S. Copyright Office in 20 minutes.
          </p>
        </div>

        {/* Quick summary */}
        <div className="rounded-2xl border border-[#00d4aa]/20 bg-[#00d4aa]/5 p-6 mb-10">
          <div className="text-[#00d4aa] text-xs font-bold uppercase tracking-wider mb-3">The short version</div>
          <div className="flex flex-col gap-2">
            {[
              "You already own the copyright — automatic from the moment you create it.",
              "Register formally at copyright.gov to unlock the right to sue for damages.",
              "Registration costs $45–$65 and takes 20 minutes to file.",
              "Register separately with your PRO and The MLC to actually collect royalties.",
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#00d4aa] font-black text-sm mt-0.5 flex-shrink-0">✓</span>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-xs font-black text-[#555]">
                {step.num}
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-white font-black text-lg mb-3">{step.title}</h2>
                <div className="text-[#a0a0a0] text-sm leading-relaxed whitespace-pre-line">{step.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Common questions */}
        <div className="mt-12 rounded-2xl border border-[#1a1a1a] bg-[#0e0e0e] p-6">
          <h2 className="text-white font-black text-lg mb-6">Common questions</h2>
          <div className="flex flex-col gap-6">
            {[
              {
                q: "Do I need a lawyer to register my copyright?",
                a: "No. The U.S. Copyright Office online portal (copyright.gov) is designed for self-filing. Most independent artists file without an attorney. Use one if you're dealing with co-ownership disputes or large-scale licensing deals."
              },
              {
                q: "Can I copyright a beat or instrumental?",
                a: "Yes. Instrumentals qualify as musical works. Register them as 'Performing Arts' with a deposit copy of the audio file. If you also wrote lyrics to the beat, register the complete song as one work."
              },
              {
                q: "What if two people wrote the song together?",
                a: "Joint works: both authors own the copyright equally unless you have a written agreement saying otherwise. Get a split sheet signed before release to document the agreed ownership percentages."
              },
              {
                q: "Does copyright registration expire?",
                a: "For works created on or after January 1, 1978, copyright lasts for the life of the author plus 70 years. For works with multiple authors, it's 70 years after the last surviving author's death."
              },
              {
                q: "Is poor man's copyright real?",
                a: "No. Mailing yourself a sealed envelope with your song does not create any legal protection. The U.S. Copyright Office does not recognize this as registration. File formally."
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <div className="text-white font-semibold text-sm mb-2">{q}</div>
                <div className="text-[#555] text-sm leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/tools/split-sheet"
            className="h-12 px-6 rounded-xl border border-[#1a1a1a] bg-[#0e0e0e] text-white font-semibold text-sm flex items-center justify-center hover:border-[#2e2e2e] transition-colors">
            Generate Split Sheet →
          </Link>
          <Link href="/start"
            className="h-12 px-8 rounded-xl bg-[#00d4aa] text-[#080808] font-bold text-sm flex items-center justify-center hover:bg-[#00b894] transition-colors">
            Check My Royalty Setup →
          </Link>
        </div>

        <div className="mt-6 text-[#555] text-xs leading-relaxed">
          This guide is for informational purposes only. It is not legal advice. For disputes involving significant commercial interests, consult an entertainment attorney licensed in your jurisdiction.
        </div>
      </div>
    </div>
  );
}
