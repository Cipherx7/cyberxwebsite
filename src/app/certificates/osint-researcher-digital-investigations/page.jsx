'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar, Mail, Loader2, ArrowLeft, Linkedin, ExternalLink,
  Wrench, BookOpen, Globe, Search as SearchIcon,
  Shield, Users, Award, X, ChevronDown, Link as LinkIcon,
  Star, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_BASE = '/api/certificates';

/* ── Tools actually used in the session (from summary.txt) ── */
const SESSION_TOOLS = [
  { name: 'IDCrawl', desc: 'Social Media Search', url: 'https://www.idcrawl.com', icon: SearchIcon },
  { name: 'ContactOut', desc: 'LinkedIn Email Finder', url: 'https://contactout.com', icon: Mail },
  { name: 'SignalHire', desc: 'Contact Finder', url: 'https://www.signalhire.com', icon: Users },
  { name: 'PimEyes', desc: 'Face Search Engine', url: 'https://pimeyes.com', icon: Globe },
  { name: 'FaceCheck.ID', desc: 'Face Recognition Search', url: 'https://facecheck.id', icon: Shield },
  { name: 'Google Images', desc: 'Reverse Image Search', url: 'https://images.google.com', icon: SearchIcon },
  { name: 'Hunter.io', desc: 'Email & Username Tools', url: 'https://hunter.io', icon: Mail },
  { name: 'Have I Been Pwned', desc: 'Breach Checker', url: 'https://haveibeenpwned.com', icon: Shield },
];

/* ── Full session summary paragraphs (from summary.txt) ── */
const SESSION_SUMMARY = [
  `The session began with a welcome address from the CyberX Nashik team, followed by the introduction of Saad Sarraj, Founder & CEO of CyberSudo, an OSINT researcher, digital investigator, and cybersecurity enthusiast from Germany. He introduced the concept of Open-Source Intelligence (OSINT) as the process of gathering information from publicly available resources such as the internet, search engines, and social media platforms. Before beginning the live demonstration, he emphasized that OSINT is a skill that improves through practice and highlighted the importance of conducting investigations legally and ethically. He explained that while investigators may discover sensitive information, it should never be misused or used to gain unauthorized access to someone's accounts.`,

  `To demonstrate a real-world investigation, Saad started with nothing more than the name and location of a person and showed how investigators gradually gather information using publicly available sources. He introduced participants to Google search operators, including the use of quotation marks for exact searches, the site: operator to search within a specific website, and the minus (-) operator to exclude unwanted search results. He explained how these techniques help narrow thousands of search results into a manageable number and save significant investigation time. During the investigation, he searched for the individual's LinkedIn profile, GitHub account, news articles, and other publicly indexed information while documenting every useful finding.`,

  `As the investigation progressed, the session focused on expanding the target's digital footprint using people search engines and professional networking platforms. Saad demonstrated how investigators can discover additional social media profiles, retrieve email addresses associated with LinkedIn accounts using browser extensions, and identify alternative names or previously used identities through publicly available certificates and profile information. He also introduced facial recognition techniques to locate publicly available images and showed how username searches across hundreds of websites can reveal additional online accounts and digital activity. Throughout the demonstration, he repeatedly stressed that successful OSINT investigations rely not only on tools but also on an investigator's ability to connect small pieces of information and verify findings from multiple sources.`,

  `Towards the end of the session, Saad discussed how public breach databases can help investigators determine whether an email address has appeared in previous data breaches and how this information can provide additional context during an investigation. He clarified that the purpose of such searches is to understand a person's digital footprint rather than to misuse leaked information. The webinar concluded with an interactive question-and-answer session, where participants asked about career opportunities in OSINT, the role of artificial intelligence in digital investigations, ethical boundaries, dark web investigations, and practical advice for beginners entering cybersecurity. He encouraged attendees to continue learning through practice, build projects, and develop an investigative mindset, reminding them that OSINT is a skill that grows with continuous experience and real-world application.`,
];

/* ── Expandable summary component ── */
function ExpandableSummary() {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const COLLAPSED_HEIGHT = 260; // px visible before "Read more"

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  const needsExpansion = contentHeight > COLLAPSED_HEIGHT;

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: expanded || !needsExpansion ? `${contentHeight + 40}px` : `${COLLAPSED_HEIGHT}px` }}
      >
        <div className="space-y-4">
          {SESSION_SUMMARY.map((para, i) => (
            <p key={i} className="text-sm text-zinc-400 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Gradient fade + Read more button */}
      {needsExpansion && !expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900/95 via-zinc-900/80 to-transparent flex items-end justify-center pb-2">
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-xs text-zinc-300 hover:text-white font-semibold transition-all"
          >
            Read full summary
            <ChevronDown size={13} />
          </button>
        </div>
      )}

      {needsExpansion && expanded && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setExpanded(false)}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-xs text-zinc-300 hover:text-white font-semibold transition-all"
          >
            Show less
            <ChevronDown size={13} className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Event Page ── */
export default function OsintEventPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | found | not_found | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (rating < 1 || rating > 5) {
      setRatingError(true);
      return;
    }
    setRatingError(false);

    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.certificates?.length > 0) {
        // Redirect to the dedicated preview page
        router.push(`/certificates/view/${data.certificates[0].certificateNo}`);
      } else {
        setErrorMsg(data.error || 'No certificate is associated with this email for this event.');
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

            {/*
              ── RIGHT COLUMN: Certificate Download (2/5) ──
              On mobile (order-1) this renders FIRST.
              On desktop (lg:order-2) this stays on the right.
            */}
            <div className="lg:col-span-2 order-1 lg:order-2">
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
                        <p className="text-xs text-zinc-500">Submit feedback to get your certificate</p>
                      </div>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                      {/* Email Address */}
                      <div className="space-y-2">
                        <label htmlFor="cert-email" className="text-sm font-medium text-zinc-300">
                          Email Address <span className="text-red-400">*</span>
                        </label>
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

                      {/* Rating Slider Bar (1 to 5 Scale - Mandatory) */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label htmlFor="cert-rating-slider" className="text-sm font-medium text-zinc-300">
                            Rate this Event <span className="text-red-400">*</span>
                          </label>
                          <span className="text-xs font-bold px-3 py-0.5 rounded-full border transition-all bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                            {rating === 0
                              ? 'Slide to rate'
                              : `${rating}/5 — ${
                                  { 1: 'Needs Improvement', 2: 'Fair', 3: 'Good', 4: 'Excellent', 5: 'Outstanding' }[rating]
                                }`}
                          </span>
                        </div>

                        {/* Clean Slidable Bar Box */}
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center">
                          <input
                            type="range"
                            id="cert-rating-slider"
                            min="1"
                            max="5"
                            step="1"
                            value={rating || 3}
                            onChange={(e) => {
                              setRating(Number(e.target.value));
                              setRatingError(false);
                            }}
                            className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 focus:outline-none"
                          />
                        </div>

                        {ratingError && (
                          <div className="flex items-center gap-1.5 text-xs text-red-400 pt-0.5">
                            <AlertCircle size={14} />
                            <span>Please slide the bar to select your rating before proceeding.</span>
                          </div>
                        )}
                      </div>

                      {/* Optional Comment Box */}
                      <div className="space-y-2 pt-1">
                        <label htmlFor="cert-comment" className="text-sm font-medium text-zinc-300 flex items-center justify-between">
                          <span>Feedback / Suggestions</span>
                          <span className="text-zinc-500 text-xs font-normal">Optional</span>
                        </label>
                        <textarea
                          id="cert-comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          placeholder="What did you think of the OSINT session? Share your thoughts!"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all resize-none placeholder:text-zinc-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] group"
                      >
                        {status === 'loading' ? (
                          <><Loader2 size={18} className="animate-spin" /> Submitting & Generating…</>
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

            {/*
              ── LEFT COLUMN: Session Content (3/5) ──
              On mobile (order-2) this renders BELOW the download card.
              On desktop (lg:order-1) this stays on the left.
            */}
            <div className="lg:col-span-3 order-2 lg:order-1 space-y-8">

              {/* Session Summary — expandable */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Session Summary</h2>
                </div>
                <ExpandableSummary />
              </div>

              {/* Tools & Resources Mentioned */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Wrench size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Tools & Resources</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SESSION_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 hover:border-yellow-500/30 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-yellow-500/10 flex items-center justify-center text-zinc-500 group-hover:text-yellow-500 transition-all shrink-0 mt-0.5">
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-white group-hover:text-yellow-500 transition-colors">{tool.name}</p>
                            <ExternalLink size={10} className="text-zinc-600 group-hover:text-yellow-500/50 transition-colors shrink-0" />
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{tool.desc}</p>
                        </div>
                      </a>
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
                      <p className="text-sm text-zinc-400">Founder & CEO of CyberSudo · OSINT Researcher & Digital Investigator</p>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      Cybersecurity enthusiast from Germany with extensive experience in open-source intelligence gathering, threat analysis, and digital investigations.
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
