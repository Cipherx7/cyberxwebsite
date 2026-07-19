"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Sparkles, Clock } from "lucide-react";

export default function HallOfFame() {
    return (
        <div className="min-h-screen bg-[var(--color-cyber-black)] text-[var(--color-cyber-text)] selection:bg-[var(--color-cyber-yellow)] selection:text-black">
            <style jsx global>{`
                .hof-hero-grid {
                    background-image: linear-gradient(
                            rgba(255, 255, 255, 0.015) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0.015) 1px,
                            transparent 1px
                        );
                    background-size: 80px 80px;
                }
                .premium-glow {
                    text-shadow: 0 0 30px rgba(230, 194, 0, 0.2);
                }
                .coming-soon-card {
                    background: rgba(24, 24, 27, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
            `}</style>

            {/* ═══ HERO ═══ */}
            <header className="relative border-b border-[var(--color-cyber-border)] overflow-hidden">
                <div className="absolute inset-0 hof-hero-grid pointer-events-none" />
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[var(--color-cyber-yellow)] rounded-full blur-[200px] opacity-[0.03] pointer-events-none" />

                <div className="relative max-w-3xl mx-auto px-6 pt-8 pb-12">
                    {/* Nav */}
                    <nav className="flex items-center justify-between mb-16">
                        <Link
                            href="/"
                            className="text-sm text-[var(--color-cyber-text-muted)] hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Home
                        </Link>
                        <div className="relative w-28 h-9">
                            <Image
                                src="/assets/logo.png"
                                alt="CyberX"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </nav>

                    {/* Title */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-cyber-yellow)]/15 bg-[var(--color-cyber-yellow)]/5 mb-5">
                            <Shield
                                size={14}
                                className="text-[var(--color-cyber-yellow)]"
                            />
                            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--color-cyber-yellow)]">
                                Security Research & Contributions
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 premium-glow">
                            Hall of <span className="text-[var(--color-cyber-yellow)]">Fame</span>
                        </h1>

                        <p className="text-[var(--color-cyber-text-secondary)] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                            Recognizing talented ethical hackers, bug hunters, and community contributors who help make the digital space safer.
                        </p>
                    </div>
                </div>
            </header>

            {/* ═══ COMING SOON DISPLAY ═══ */}
            <main className="max-w-2xl mx-auto px-6 py-20 text-center">
                <div className="coming-soon-card rounded-2xl p-12 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                    {/* Background visual details */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-cyber-yellow)] to-transparent opacity-40"></div>

                    <div className="w-16 h-16 rounded-full bg-[var(--color-cyber-yellow)]/10 flex items-center justify-center text-[var(--color-cyber-yellow)]">
                        <Clock size={28} className="animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                            Hall of Fame Coming Soon <Sparkles size={18} className="text-[var(--color-cyber-yellow)]" />
                        </h2>
                        <p className="text-sm text-[var(--color-cyber-text-secondary)] leading-relaxed max-w-md mx-auto">
                            Our responsible disclosure program and submission pipeline are being updated. We will list outstanding researchers and contributors who report verified vulnerabilities soon.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="border-t border-[var(--color-cyber-border)] mt-12 py-10">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="text-sm text-[var(--color-cyber-text-secondary)] mb-1">
                        Found a vulnerability?{" "}
                        <a
                            href="mailto:security@cyberx.org.in"
                            className="text-[var(--color-cyber-yellow)] hover:underline"
                        >
                            Report it responsibly
                        </a>
                    </p>
                    <p className="text-xs text-[var(--color-cyber-text-muted)] mt-4">
                        © 2026 CyberX Community — All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
