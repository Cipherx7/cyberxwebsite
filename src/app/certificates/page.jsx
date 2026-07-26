'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, CheckCircle2, X, Award, Calendar, Tag, Shield, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_BASE = '/api/certificates';

const EVENTS = [
  {
    id: 'osint-researcher-digital-investigations',
    title: 'OSINT Researcher & Digital Investigations',
    date: '25th July, 2026',
    category: 'Technical',
    type: 'Online',
    speaker: 'Saad Sarraj (cybersudo)',
    description: 'How Investigators Find Anyone Online using OSINT — Learn how investigators turn scattered public data into actionable intelligence.',
    status: 'completed',
  },
];

/* ── Floating particles ── */
function Particles() {
  const [dots, setDots] = useState([]);
  useEffect(() => {
    setDots(
      Array.from({ length: 20 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${6 + Math.random() * 8}s`,
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
      }))
    );
  }, []);
  return (
    <div className="particle-field">
      {dots.map((s, i) => (
        <div key={i} className="particle" style={s} />
      ))}
    </div>
  );
}

/* ── Verify Section ── */
function VerifySection() {
  const [certNo, setCertNo] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNo.trim()) return;
    setStatus('loading');
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/${certNo.trim()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data);
        setStatus('found');
      } else {
        setStatus('not_found');
      }
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Verify Certificate</h3>
          <p className="text-xs text-zinc-500">Enter a certificate ID to verify its authenticity</p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="flex gap-3">
        <input
          type="text"
          value={certNo}
          onChange={(e) => setCertNo(e.target.value)}
          placeholder="e.g. CX-12345"
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all font-mono"
          id="verify-cert-input"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 text-sm shrink-0"
        >
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
          Verify
        </button>
      </form>

      {status === 'found' && result && (
        <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
            <CheckCircle2 size={16} /> Certificate Verified
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-3">
            <div><span className="text-zinc-500 block">Name</span><span className="text-white font-medium">{result.candidateName}</span></div>
            <div><span className="text-zinc-500 block">Event</span><span className="text-white font-medium">{result.eventTitle}</span></div>
            <div><span className="text-zinc-500 block">Date</span><span className="text-white font-medium">{result.eventDate}</span></div>
            <div><span className="text-zinc-500 block">Status</span><span className="text-green-400 font-medium">{result.status}</span></div>
          </div>
        </div>
      )}
      {status === 'not_found' && (
        <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <X size={16} /> No certificate found with this ID.
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}
    </div>
  );
}

/* ── Main Certificates Listing Page ── */
export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Particles />
      <Navbar />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>
      <div className="grid-overlay fixed inset-0 pointer-events-none" />

      <div className="relative z-10">
        {/* ═══ HERO ═══ */}
        <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse" />
              Certificate Portal
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Achievements</span>,{' '}
              Verified
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Download certificates from CyberX events or verify the authenticity of any certificate issued by the community.
            </p>
          </div>
        </section>

        {/* ═══ EVENTS ═══ */}
        <section className="px-4 sm:px-6 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[11px] tracking-widest uppercase text-yellow-500 font-bold">Past Events</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Events with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Certificates</span>
              </h2>
            </div>

            <div className="grid gap-5">
              {EVENTS.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/certificates/${evt.id}`}
                  className="block bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 hover:border-yellow-500/20 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] tracking-widest uppercase bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-2.5 py-0.5 rounded-full font-bold">
                          {evt.type}
                        </span>
                        <span className="text-[10px] tracking-widest uppercase bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-0.5 rounded-full font-bold">
                          {evt.category}
                        </span>
                        <span className="text-[10px] tracking-widest uppercase bg-green-500/10 border border-green-500/30 text-green-400 px-2.5 py-0.5 rounded-full font-bold">
                          Completed
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">{evt.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{evt.description}</p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-yellow-500" />{evt.date}</span>
                        <span className="flex items-center gap-1.5"><Award size={12} className="text-yellow-500" />Speaker: {evt.speaker}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 px-5 py-3 bg-yellow-500 group-hover:bg-yellow-400 text-black text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.15)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]">
                      <Download size={16} /> Get Certificate
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ VERIFY ═══ */}
        <section className="px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-2xl mx-auto">
            <VerifySection />
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-zinc-800/50 py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} CyberX Community — All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <Link href="/rsvp" className="hover:text-yellow-500 transition-colors">Events</Link>
              <a href="https://team.cyberx.org.in/public/certificates" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors flex items-center gap-1">
                Portal <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
