'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Mail, Loader2, ArrowLeft, Linkedin, ExternalLink,
  Wrench, BookOpen, Globe, Search as SearchIcon, Database,
  FileText, Shield, Users, Award, X
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_BASE = '/api/certificates';

const SESSION_TOOLS = [
  { name: 'Maltego', desc: 'Link analysis & data visualization for investigations', icon: Globe },
  { name: 'Shodan', desc: 'Search engine for internet-connected devices', icon: SearchIcon },
  { name: 'theHarvester', desc: 'Email, subdomain & name gathering tool', icon: Database },
  { name: 'SpiderFoot', desc: 'Automated OSINT reconnaissance platform', icon: Globe },
  { name: 'Google Dorking', desc: 'Advanced search operators for intel gathering', icon: SearchIcon },
  { name: 'OSINT Framework', desc: 'Collection of OSINT tools organized by category', icon: FileText },
  { name: 'Recon-ng', desc: 'Full-featured web reconnaissance framework', icon: Shield },
  { name: 'Social Media Analysis', desc: 'Techniques for extracting public social data', icon: Users },
];

const SESSION_TOPICS = [
  'Introduction to OSINT & its legal framework',
  'Passive vs Active reconnaissance techniques',
  'Email & identity footprinting methodologies',
  'Social media intelligence (SOCMINT) deep-dive',
  'Geolocation & image analysis for investigations',
  'Domain & infrastructure mapping',
  'Dark web monitoring basics',
  'Building an OSINT workflow for real-world cases',
];



/* ── Main Event Page ── */
export default function OsintEventPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | not_found | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.certificates?.length > 0) {
        // Redirect to the dedicated preview page
        router.push(`/certificates/view/${data.certificates[0].certificateNo}`);
      } else {
        setStatus('not_found');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>
      <div className="grid-overlay fixed inset-0 pointer-events-none" />

      <div className="relative z-10">
        {/* ═══ BREADCRUMB ═══ */}
        <div className="pt-24 sm:pt-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <Link href="/certificates" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-yellow-500 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Certificates
            </Link>
          </div>
        </div>

        {/* ═══ EVENT HEADER ═══ */}
        <section className="pt-6 pb-10 sm:pb-14 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-2.5 py-0.5 rounded-full font-bold">Online</span>
              <span className="text-[10px] tracking-widest uppercase bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-0.5 rounded-full font-bold">Technical</span>
              <span className="text-[10px] tracking-widest uppercase bg-green-500/10 border border-green-500/30 text-green-400 px-2.5 py-0.5 rounded-full font-bold">Completed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              OSINT Researcher & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Digital Investigations</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-3xl leading-relaxed">
              How Investigators Find Anyone Online — Discover how professionals transform scattered public data into actionable intelligence using powerful OSINT techniques and frameworks.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
              <span className="flex items-center gap-2"><Calendar size={14} className="text-yellow-500" /> 25th July, 2026 · 3:00 PM IST</span>
              <span className="flex items-center gap-2"><Award size={14} className="text-yellow-500" /> Speaker: Saad Sarraj (cybersudo)</span>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT — 2 COLUMN ═══ */}
        <section className="px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            {/* ── LEFT COLUMN: Session Summary (3/5) ── */}
            <div className="lg:col-span-3 space-y-8">

              {/* Session Summary */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Session Summary</h2>
                </div>
                <div className="space-y-3">
                  {SESSION_TOPICS.map((topic, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm text-zinc-300 leading-relaxed group-hover:text-white transition-colors">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Mentioned */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Wrench size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Tools Covered in Session</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SESSION_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.name}
                        className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 hover:border-yellow-500/20 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-yellow-500/10 flex items-center justify-center text-zinc-500 group-hover:text-yellow-500 transition-all shrink-0 mt-0.5">
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{tool.name}</p>
                          <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{tool.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Speaker Card */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                    <Users size={24} />
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-semibold">Speaker</p>
                      <h3 className="text-lg font-bold text-white">Saad Sarraj</h3>
                      <p className="text-sm text-zinc-400">aka cybersudo</p>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      OSINT specialist and digital investigations expert with extensive experience in open-source intelligence gathering, threat analysis, and cyber investigations.
                    </p>
                    <a
                      href="https://www.linkedin.com/in/saadsarraj/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a66c2]/10 border border-[#0a66c2]/30 text-[#0a66c2] hover:bg-[#0a66c2]/20 rounded-lg text-sm font-semibold transition-all mt-1"
                    >
                      <Linkedin size={14} />
                      Connect on LinkedIn
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Certificate Download (2/5) ── */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Download Certificate Card */}
                <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  {/* Gold accent top */}
                  <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500" />

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Award size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Download Certificate</h2>
                        <p className="text-xs text-zinc-500">Enter your registered email</p>
                      </div>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="cert-email" className="text-sm font-medium text-zinc-300">Email Address</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                          <input
                            type="email"
                            id="cert-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] group"
                      >
                        {status === 'loading' ? (
                          <><Loader2 size={18} className="animate-spin" /> Searching…</>
                        ) : (
                          <>Get Certificate</>
                        )}
                      </button>
                    </form>

                    {/* Not Found */}
                    {status === 'not_found' && (
                      <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-center space-y-2">
                        <div className="flex items-center justify-center gap-2 text-zinc-300 text-sm font-medium">
                          <X size={16} className="text-red-400" /> No certificates found
                        </div>
                        <p className="text-zinc-500 text-xs">
                          No certificate is associated with this email for this event. Please check the email or contact CyberX support.
                        </p>
                      </div>
                    )}

                    {/* Error */}
                    {errorMsg && (
                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-sm">{errorMsg}</div>
                    )}


                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">Quick Info</p>
                  <div className="space-y-2 text-xs text-zinc-500">
                    <div className="flex justify-between"><span>Event Date</span><span className="text-white font-medium">25th July, 2026</span></div>
                    <div className="flex justify-between"><span>Mode</span><span className="text-white font-medium">Online</span></div>
                    <div className="flex justify-between"><span>Certificate</span><span className="text-green-400 font-medium">Available</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-zinc-800/50 py-8 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} CyberX Community — All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <Link href="/certificates" className="hover:text-yellow-500 transition-colors">Certificates</Link>
              <Link href="/rsvp" className="hover:text-yellow-500 transition-colors">Events</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
