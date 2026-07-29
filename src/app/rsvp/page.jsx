'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Linkedin, 
  Award, 
  Download, 
  Mail, 
  AlertCircle, 
  HelpCircle, 
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { detectLanguage, getTranslations, languageNames } from './translations';
import Navbar from '@/components/Navbar';

export default function RsvpPage() {
    const router = useRouter();
    const [lang, setLang] = useState('en');
    const [t, setT] = useState(getTranslations('en'));
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [lookupEmail, setLookupEmail] = useState('');

    useEffect(() => {
        const detected = detectLanguage();
        setLang(detected);
        setT(getTranslations(detected));
    }, []);

    const switchLanguage = (code) => {
        setLang(code);
        setT(getTranslations(code));
        setShowLangMenu(false);
    };

    const handleCertificateLookup = (e) => {
        e.preventDefault();
        if (!lookupEmail.trim()) return;
        router.push(`/certificates/osint-researcher-digital-investigations?email=${encodeURIComponent(lookupEmail.trim())}`);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
            <Navbar />

            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20 pt-24 sm:pt-28">
                
                {/* Header with Language Switcher */}
                <header className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Registrations Closed
                    </div>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-zinc-700 hover:text-white transition-all backdrop-blur-md"
                            aria-label="Change language"
                        >
                            <Globe size={16} className="text-yellow-500" />
                            <span className="hidden sm:inline">{languageNames[lang]}</span>
                            <svg className={`w-3 h-3 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showLangMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                                    {Object.entries(languageNames).map(([code, name]) => (
                                        <button
                                            key={code}
                                            onClick={() => switchLanguage(code)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                                                lang === code
                                                    ? 'bg-yellow-500/10 text-yellow-500'
                                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                            }`}
                                        >
                                            <span>{name}</span>
                                            {lang === code && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    
                    {/* Event Details Left Side */}
                    <div className="space-y-8 sm:space-y-10">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] tracking-widest uppercase bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full font-bold">
                                    Registrations Closed
                                </span>
                                <span className="text-[10px] tracking-widest uppercase bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Event Concluded
                                </span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
                                {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">{t.titleHighlight}</span>
                            </h1>
                            
                            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
                                {t.description}
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 font-medium">{t.speakerLabel}</p>
                                        <p className="text-white font-semibold text-base sm:text-lg">{t.speakerName}</p>
                                        <p className="text-xs text-zinc-400 mt-1">{t.speakerRole}<br/>{t.speakerTitle}</p>
                                    </div>
                                </div>
                                <a 
                                    href="https://www.linkedin.com/in/saadsarraj/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 text-xs text-yellow-500 hover:text-yellow-400 font-semibold transition-colors mt-2"
                                >
                                    <Linkedin size={12} />
                                    <span>Speaker&apos;s LinkedIn</span>
                                </a>
                            </div>

                            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 font-medium">{t.dateLabel}</p>
                                    <p className="text-white font-semibold text-base sm:text-lg">{t.dateValue}, 2026</p>
                                    <p className="text-xs text-zinc-400 mt-1">{t.timeValue}<br/>{t.timeAlt}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certificate Download Section Right Side (Replaces RSVP Form) */}
                    <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 via-yellow-500/10 to-transparent blur-3xl -z-10 rounded-3xl" />
                        
                        <div className="bg-zinc-900/90 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6">
                            
                            {/* Gold top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500" />

                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                    <Award size={14} /> Certificate Ready
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Claim Your Certificate
                                </h2>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Registrations for this live session are now closed. If you attended or registered for this event, enter your registered email address below to download your verified certificate of completion.
                                </p>
                            </div>

                            {/* Direct Certificate Lookup Form */}
                            <form onSubmit={handleCertificateLookup} className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label htmlFor="lookup-email" className="text-sm font-medium text-zinc-300">
                                        Registered Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="email"
                                            id="lookup-email"
                                            value={lookupEmail}
                                            onChange={(e) => setLookupEmail(e.target.value)}
                                            placeholder="Enter your registered email..."
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all placeholder:text-zinc-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(234,179,8,0.25)] hover:shadow-[0_0_35px_rgba(234,179,8,0.45)] group text-sm sm:text-base cursor-pointer"
                                >
                                    <Download size={18} />
                                    <span>Download Certificate</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            {/* Direct Link to Certificate Portal */}
                            <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3">
                                <Link
                                    href="/certificates/osint-researcher-digital-investigations"
                                    className="w-full bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 hover:text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs transition-colors"
                                >
                                    <span>Open Event Certificate Page</span>
                                    <ExternalLink size={12} className="text-yellow-500" />
                                </Link>

                                <Link
                                    href="/certificates"
                                    className="text-center text-xs text-zinc-500 hover:text-yellow-500 transition-colors"
                                >
                                    View All Community Certificates →
                                </Link>
                            </div>

                            {/* Need Help Box */}
                            <div className="p-4 bg-zinc-950/60 border border-zinc-850 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-yellow-500">
                                    <HelpCircle size={14} /> Need Help Finding Your Certificate?
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Facing issues with your email or certificate? Contact support:
                                </p>
                                <div className="flex items-center gap-3 pt-1 text-xs">
                                    <a href="mailto:info@cyberx.org.in" className="text-zinc-300 hover:text-yellow-500 transition-colors flex items-center gap-1 font-medium">
                                        <Mail size={12} className="text-yellow-500" /> Email Support
                                    </a>
                                    <span className="text-zinc-700">•</span>
                                    <a href="https://chat.whatsapp.com/BWn6IAb6CS7ETceveQKneO" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                                        <MessageCircle size={12} /> WhatsApp
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
