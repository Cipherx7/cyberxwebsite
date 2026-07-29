'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Calendar, 
  Clock, 
  User, 
  Award, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Linkedin, 
  Sparkles,
  Users,
  Video,
  Globe,
  Bell
} from 'lucide-react';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'past'

  const pastEvents = [
    {
      id: 'osint-2026',
      title: 'How Investigators Find Anyone Online using OSINT',
      category: 'Technical Workshop',
      status: 'Completed',
      date: '25th July, 2026',
      time: '3:00 PM IST (11:30 AM CET)',
      location: 'Live Online Workshop',
      speaker: 'Saad Sarraj (cybersudo)',
      speakerRole: 'Cyber Security Engineer',
      speakerLinkedin: 'https://www.linkedin.com/in/saadsarraj/',
      rating: '4.8',
      totalReviews: '15+',
      description: 'What if the internet already contains the answers you\'re looking for? Join us as we reveal how investigators turn scattered public data into actionable intelligence using Open Source Intelligence (OSINT) tools and techniques.',
      highlights: [
        'Advanced Google Dorking & Social Media Footprinting',
        'Username & Email Correlation Techniques',
        'OSINT Investigation Frameworks & Ethics',
        'Real-world Case Analysis & Tooling'
      ],
      certUrl: '/certificates/osint-researcher-digital-investigations',
    }
  ];

  const upcomingEvents = []; // Currently no active upcoming event

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Navbar />

      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-yellow-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-yellow-500/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15 mix-blend-overlay" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pt-28 sm:pt-32 relative z-10">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            CyberX Community Events
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Workshops, Talks & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Tech Sessions</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Join expert-led security sessions, hands-on CTFs, and technical workshops designed to build real-world cybersecurity skills.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Events ({pastEvents.length + upcomingEvents.length})
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* UPCOMING EVENTS SECTION */}
        {(activeTab === 'all' || activeTab === 'upcoming') && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="text-yellow-500" size={22} />
                Upcoming Events
              </h2>
              <span className="text-xs text-zinc-500 font-medium">Updated Weekly</span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl">
                <div className="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                  <Bell size={26} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Active Upcoming Events Right Now</h3>
                <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                  We are finalizing our next high-impact cybersecurity workshop! Join the CyberX community or follow us to get notified as soon as registrations open.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/join"
                    className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    Join CyberX Community
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href="https://www.linkedin.com/company/cyberx-nashik-community/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 border border-zinc-700"
                  >
                    <Linkedin size={14} />
                    Follow LinkedIn
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* PAST EVENTS SECTION */}
        {(activeTab === 'all' || activeTab === 'past') && (
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-yellow-500" size={22} />
                Past Events & Workshops
              </h2>
              <span className="text-xs text-zinc-500 font-medium">Archive</span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {pastEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 hover:border-yellow-500/30 transition-all duration-300 shadow-2xl relative overflow-hidden group"
                >
                  {/* Subtle top glow line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500/50 via-yellow-300/80 to-yellow-500/50" />

                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Event Content (Left 8 cols) */}
                    <div className="lg:col-span-8 space-y-5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[11px] uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold px-3 py-1 rounded-full">
                          {event.category}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {event.status}
                        </span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1 ml-auto sm:ml-0">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <strong className="text-white">{event.rating}</strong> / 5.0 Rating
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-yellow-400 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-3">
                          {event.description}
                        </p>
                      </div>

                      {/* Key Highlights */}
                      <div className="pt-2">
                        <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-2">Key Topics Covered</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {event.highlights.map((h, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-950/60 border border-zinc-850 px-3 py-2 rounded-xl">
                              <CheckCircle2 size={14} className="text-yellow-500 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Event Meta & Actions (Right 4 cols) */}
                    <div className="lg:col-span-4 bg-zinc-950/70 border border-zinc-850 rounded-2xl p-5 sm:p-6 space-y-5 flex flex-col justify-between h-full">
                      <div className="space-y-4">
                        {/* Speaker info */}
                        <div className="flex items-start gap-3 border-b border-zinc-850 pb-4">
                          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0 border border-yellow-500/20">
                            <User size={20} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-zinc-500">Speaker</span>
                            <h4 className="text-sm font-bold text-white leading-tight">{event.speaker}</h4>
                            <p className="text-xs text-zinc-400">{event.speakerRole}</p>
                            {event.speakerLinkedin && (
                              <a
                                href={event.speakerLinkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-yellow-500 hover:underline mt-1 font-semibold"
                              >
                                <Linkedin size={12} />
                                LinkedIn Profile
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-2 text-xs text-zinc-300">
                          <div className="flex items-center gap-2.5">
                            <Calendar size={15} className="text-yellow-500 shrink-0" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock size={15} className="text-yellow-500 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Globe size={15} className="text-yellow-500 shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Certificate & Download CTA */}
                      <div className="pt-2 border-t border-zinc-850 space-y-2">
                        <Link
                          href={event.certUrl}
                          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]"
                        >
                          <Award size={16} />
                          Claim / View Certificate
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speaker Callout Footer */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500/10 via-zinc-900 to-yellow-500/10 border border-yellow-500/20 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Want to Speak or Host a Workshop at CyberX?</h3>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-6">
            We welcome cybersecurity researchers, ethical hackers, and industry engineers to share knowledge with our 2000+ member community.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-yellow-500/30 text-yellow-400 hover:text-yellow-300 text-xs font-bold rounded-xl transition-all"
          >
            <Users size={16} />
            Get Involved / Become a Speaker
          </Link>
        </div>

      </main>

      <footer className="py-8 border-t border-zinc-900 text-center text-xs text-zinc-600 mt-20 relative z-10">
        © {new Date().getFullYear()} CyberX Community. All rights reserved.
      </footer>
    </div>
  );
}
