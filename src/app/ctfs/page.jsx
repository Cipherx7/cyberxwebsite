"use client";

import Image from "next/image";
import Link from "next/link";
import { Flag, Calendar, Globe, Trophy, Shield, Cpu, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CTFsPage() {
    return (
        <div className="min-h-screen bg-[var(--color-cyber-black)] text-[var(--color-cyber-text)] font-[var(--font-inter)] selection:bg-[var(--color-cyber-yellow)] selection:text-black">
            {/* ═══ Inline Styles for Animations & Glows ═══ */}
            <style jsx global>{`
                .ctf-hero-grid {
                    background-image: linear-gradient(
                            rgba(255, 255, 255, 0.015) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0.015) 1px,
                            transparent 1px
                        );
                    background-size: 60px 60px;
                }
                .text-glow-yellow {
                    text-shadow: 0 0 35px rgba(230, 194, 0, 0.25);
                }
                .premium-card {
                    background: rgba(20, 20, 20, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(230, 194, 0, 0.15);
                    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7),
                        0 0 40px rgba(230, 194, 0, 0.03);
                }
            `}</style>

            <Navbar />

            {/* ═══════════ HERO ═══════════ */}
            <header className="relative border-b border-[var(--color-cyber-border)] overflow-hidden pt-20">
                <div className="absolute inset-0 ctf-hero-grid pointer-events-none" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[var(--color-cyber-yellow)] rounded-full blur-[200px] opacity-[0.035] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
                    {/* Title Area */}
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-cyber-yellow)]/15 bg-[var(--color-cyber-yellow)]/5 mb-6">
                            <Flag size={14} className="text-[var(--color-cyber-yellow)]" />
                            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--color-cyber-yellow)]">
                                Hacking Competitions
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 text-glow-yellow">
                            Capture The <span className="text-[var(--color-cyber-yellow)] relative">Flag
                                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--color-cyber-yellow)] to-transparent" />
                            </span>
                        </h1>
                        <p className="text-[var(--color-cyber-text-secondary)] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                            Sharpen your skills, solve security challenges, and compete with security enthusiasts from across the globe.
                        </p>
                    </div>
                </div>
            </header>

            {/* ═══════════ MAIN CONTENT ═══════════ */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="premium-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
                    {/* Glowing effect inside card */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--color-cyber-yellow)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="space-y-6 max-w-xl">
                            {/* Live Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-cyber-yellow)]/20 bg-[var(--color-cyber-yellow)]/10 text-[var(--color-cyber-yellow)] text-xs font-semibold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-cyber-yellow)] animate-pulse" />
                                Upcoming Event
                            </div>

                            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                CyberX Independence Day CTF 2026
                            </h2>

                            <p className="text-[var(--color-cyber-text-secondary)] text-sm sm:text-base leading-relaxed">
                                Get ready for our flag-ship, high-octane virtual hacking arena. Solve security puzzles in web exploitation, cryptography, reverse engineering, binary analysis, and forensic analysis.
                            </p>

                            {/* Details Row */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-cyber-yellow)]">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[var(--color-cyber-text-muted)] uppercase font-bold tracking-wider">Date</p>
                                        <p className="text-sm font-semibold text-white">August 15, 2026</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                                        <Globe size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[var(--color-cyber-text-muted)] uppercase font-bold tracking-wider">Format</p>
                                        <p className="text-sm font-semibold text-white">Online (Jeopardy)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA / Registration Section */}
                        <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 p-8 rounded-xl md:w-80 shrink-0 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-cyber-yellow)] mb-4">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Registration</h3>
                            <p className="text-xs text-[var(--color-cyber-text-secondary)] mb-6 leading-relaxed">
                                Join team/individual registration queues soon. Keep an eye out for updates!
                            </p>
                            <button
                                disabled
                                className="w-full py-3 bg-[var(--color-cyber-border)] border border-white/15 text-[var(--color-cyber-text-secondary)] font-semibold rounded-lg text-sm tracking-wider uppercase cursor-not-allowed opacity-75"
                            >
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl text-center">
                        <div className="mx-auto w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                            <Trophy size={20} />
                        </div>
                        <h4 className="font-bold text-white mb-1">Prizes & Glory</h4>
                        <p className="text-xs text-[var(--color-cyber-text-muted)]">Prizes for top teams, community certifications, and special roles.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl text-center">
                        <div className="mx-auto w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                            <Cpu size={20} />
                        </div>
                        <h4 className="font-bold text-white mb-1">Dynamic Infrastructure</h4>
                        <p className="text-xs text-[var(--color-cyber-text-muted)]">Containers spun up dynamically for interactive exploit target environments.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl text-center">
                        <div className="mx-auto w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                            <Shield size={20} />
                        </div>
                        <h4 className="font-bold text-white mb-1">Ethical Play</h4>
                        <p className="text-xs text-[var(--color-cyber-text-muted)]">Strictly curated environment following ethical frameworks.</p>
                    </div>
                </div>
            </main>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="border-t border-[var(--color-cyber-border)] py-10 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs text-[var(--color-cyber-text-muted)]">
                        © 2026 CyberX Community — All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
