'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, ArrowRight, ShieldCheck, CheckCircle2, MessageCircleQuestion, Globe, Linkedin } from 'lucide-react';
import { detectLanguage, getTranslations, languageNames } from './translations';

export default function RsvpPage() {
    const [lang, setLang] = useState('en');
    const [t, setT] = useState(getTranslations('en'));
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', privacyAccepted: false, anonymousQuestion: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.privacyAccepted) {
            setErrorMessage(t.errorRequired);
            return;
        }

        if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
            setErrorMessage(t.errorGmailOnly);
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(data.error || t.errorGeneric);
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage(t.errorNetwork);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{t.successTitle}</h2>
                    <p className="text-zinc-400">
                        {t.successMessage} <span className="text-white font-medium">{formData.email}</span>.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="mt-8 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors w-full"
                    >
                        {t.backHome}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20">
                
                {/* Header */}
                <header className="mb-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="text-yellow-500">CYBER</span>X
                        <span className="text-sm font-normal text-zinc-500 ml-2 tracking-normal border-l border-zinc-800 pl-4">{t.communityLabel}</span>
                    </h1>

                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-zinc-700 hover:text-white transition-all backdrop-blur-md"
                            aria-label="Change language"
                        >
                            <Globe size={16} className="text-yellow-500" />
                            <span>{languageNames[lang]}</span>
                            <svg className={`w-3 h-3 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Event Details Left Side */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse" />
                                {t.badge}
                            </div>
                            
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                                {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">{t.titleHighlight}</span>
                            </h2>
                            
                            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
                                {t.description}
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 font-medium">{t.speakerLabel}</p>
                                        <p className="text-white font-semibold text-lg">{t.speakerName}</p>
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
                                    <span>Speaker's LinkedIn</span>
                                </a>
                            </div>

                            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 space-y-3">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 font-medium">{t.dateLabel}</p>
                                    <p className="text-white font-semibold text-lg">{t.dateValue}</p>
                                    <p className="text-xs text-zinc-400 mt-1">{t.timeValue}<br/>{t.timeAlt}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RSVP Form Right Side */}
                    <div className="relative">
                        {/* Glow effect behind form */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-transparent blur-3xl -z-10 rounded-3xl" />
                        
                        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{t.formTitle}</h3>
                                <p className="text-zinc-400 text-sm">{t.formSubtitle}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-zinc-300">{t.nameLabel}</label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                        placeholder={t.namePlaceholder}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">{t.emailLabel}</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                                        placeholder={t.emailPlaceholder}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="anonymousQuestion" className="text-sm font-medium text-zinc-300">{t.questionLabel}</label>
                                        <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">{t.questionOptional}</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-3 left-4 text-zinc-600">
                                            <MessageCircleQuestion size={16} />
                                        </div>
                                        <textarea
                                            id="anonymousQuestion"
                                            name="anonymousQuestion"
                                            value={formData.anonymousQuestion}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all resize-none text-sm"
                                            placeholder={t.questionPlaceholder}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 pt-2">
                                    <div className="flex items-center h-5 mt-1">
                                        <input
                                            id="privacyAccepted"
                                            name="privacyAccepted"
                                            type="checkbox"
                                            checked={formData.privacyAccepted}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-yellow-500 focus:ring-yellow-500/50 focus:ring-offset-zinc-900 cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <label htmlFor="privacyAccepted" className="text-sm text-zinc-400 cursor-pointer select-none">
                                        {t.privacyText} <a href="#" className="text-yellow-500 hover:underline">{t.privacyLink}</a> {t.privacyConsent}
                                    </label>
                                </div>

                                {errorMessage && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                                        <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                                        <p>{errorMessage}</p>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-4 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t.loadingButton}
                                        </span>
                                    ) : (
                                        <>
                                            {t.submitButton}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
