'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Calendar, ArrowRight, Home, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RsvpPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 flex flex-col justify-between">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/5 blur-[130px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 pt-32 pb-16 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles size={14} />
          Registration Status
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          No Active Event Registrations
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
          RSVP registrations for our recent event <span className="text-white font-medium">&ldquo;How Investigators Find Anyone Online using OSINT&rdquo;</span> have ended. Check out our Events page for upcoming sessions and past recordings!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <Link
            href="/events"
            className="w-full sm:w-auto px-6 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] text-sm"
          >
            <Calendar size={18} />
            Explore All Events
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Certificate banner box */}
        <div className="mt-12 p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl max-w-lg text-left flex items-start gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Attended the OSINT Workshop?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              If you attended our OSINT workshop on 25th July, you can claim and download your verified Certificate of Completion.
            </p>
            <Link 
              href="/certificates/osint-researcher-digital-investigations" 
              className="text-xs font-semibold text-yellow-500 hover:text-yellow-400 inline-flex items-center gap-1"
            >
              Get OSINT Certificate &rarr;
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-zinc-900 text-center text-xs text-zinc-600 relative z-10">
        © {new Date().getFullYear()} CyberX Community. All rights reserved.
      </footer>
    </div>
  );
}
