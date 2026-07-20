'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Mail, Database, Bell, Gift, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 font-sans">
            <Navbar />

            {/* Ambient Background Lights */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-yellow-500/10 blur-[130px]" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-yellow-500/5 blur-[130px]" />
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-yellow-500/3 blur-[100px]" />
            </div>

            <div className="relative max-w-4xl mx-auto px-6 py-24 sm:py-32">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/rsvp"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors text-sm font-medium group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to RSVP
                    </Link>
                </div>

                {/* Page Header */}
                <header className="mb-16 border-b border-zinc-800 pb-10">
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs font-semibold uppercase tracking-wider mb-4">
                        🛡️ Legal & Privacy
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Policy</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Last Updated: July 20, 2026 • CyberX Community
                    </p>
                </header>

                {/* Policy Sections */}
                <div className="space-y-12">
                    {/* Intro */}
                    <section className="bg-zinc-900/40 backdrop-blur-md border border-zinc-850 rounded-2xl p-6 sm:p-8">
                        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                            At <strong>CyberX Community</strong>, we believe in building the next generation of cybersecurity professionals with transparency and trust. This Privacy Policy details how we handle the information you share when registering for our events, communicating with us, or subscribing to community updates.
                        </p>
                    </section>

                    {/* Section 1: Information Collection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                                <Database size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold">1. Information We Collect</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-sm pl-13">
                            When you register for an event (RSVP) or apply to join our community, we collect necessary personal details to facilitate your participation. This includes:
                        </p>
                        <ul className="list-disc pl-18 space-y-2 text-zinc-400 text-sm">
                            <li><strong className="text-zinc-200">Identity Details:</strong> Your full name.</li>
                            <li><strong className="text-zinc-200">Contact Information:</strong> Your email address and WhatsApp number.</li>
                            <li><strong className="text-zinc-200">Event Interactions:</strong> Any questions, suggestions, or inputs you submit anonymously or publicly for our speakers.</li>
                            <li><strong className="text-zinc-250">Professional Details:</strong> (For applications) Your school/organization, domain interests, skillset, and resume files.</li>
                        </ul>
                    </section>

                    {/* Section 2: How We Use Your Data */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                                <Mail size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold">2. Data Usage & Communications</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-sm pl-13">
                            Your email address and other communication details are stored to deliver a seamless experience. We use this information to:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-13">
                            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 space-y-2">
                                <div className="flex items-center gap-2 text-yellow-500 font-semibold text-sm">
                                    <Bell size={16} />
                                    <span>Updates & Reminders</span>
                                </div>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Send event confirmations, digital access passes (QR codes), joining links, calendar invites, and critical reminders for upcoming events.
                                </p>
                            </div>
                            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 space-y-2">
                                <div className="flex items-center gap-2 text-yellow-500 font-semibold text-sm">
                                    <Gift size={16} />
                                    <span>Sponsor Offers & Perks</span>
                                </div>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    Deliver exclusive training resources, certifications, discounts, job boards, and promotional offers curated from our official community sponsors.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Third Party & Sponsor Protection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold">3. No Data Sharing with Sponsors</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-sm pl-13">
                            We respect your inbox. <strong className="text-zinc-200">We do not sell, rent, or distribute your email address or personal contact details directly to any sponsors or third-parties.</strong> Any communication regarding sponsor offers, deals, or giveaways is distributed directly by CyberX on behalf of the sponsors. You will never receive unsolicited messages from third-parties because of CyberX.
                        </p>
                    </section>

                    {/* Section 4: Storage and Security */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold">4. Data Retention & Deletion</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-sm pl-13">
                            Your information is securely saved in our databases. We keep your data only as long as you wish to remain an active part of our community communications. If at any point you want to opt-out, you can click the unsubscribe links inside our emails or contact us at <a href="mailto:info@cyberx.org.in" className="text-yellow-500 hover:underline">info@cyberx.org.in</a> to have your personal data permanently removed.
                        </p>
                    </section>
                </div>

                {/* Footer divider */}
                <footer className="mt-20 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-xs">
                    <p className="flex items-center justify-center gap-1.5">
                        Made with <Heart size={12} className="text-red-500 fill-red-500" /> by the CyberX Community Team
                    </p>
                    <p className="mt-2">
                        &copy; 2026 CyberX Community. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}
