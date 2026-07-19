"use client";

import Image from "next/image";
import Link from "next/link";
import { Presentation, Sparkles, Video } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function MediaPage() {
    return (
        <div className="min-h-screen bg-[var(--color-cyber-black)] text-[var(--color-cyber-text)] font-[var(--font-inter)] selection:bg-[var(--color-cyber-yellow)] selection:text-black">
            {/* ═══ Inline Styles ═══ */}
            <style jsx global>{`
                .media-hero-grid {
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
                    text-shadow: 0 0 30px rgba(230, 194, 0, 0.2);
                }
                .coming-soon-card {
                    background: rgba(24, 24, 27, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
            `}</style>

            <Navbar />

            {/* ═══════════ HERO ═══════════ */}
            <header className="relative border-b border-[var(--color-cyber-border)] overflow-hidden pt-20">
                {/* Grid Background */}
                <div className="absolute inset-0 media-hero-grid pointer-events-none" />
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[var(--color-cyber-yellow)] rounded-full blur-[200px] opacity-[0.035] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
                    {/* Title Area */}
                    <div className="text-center max-w-3xl mx-auto mt-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-cyber-yellow)]/15 bg-[var(--color-cyber-yellow)]/5 mb-6">
                            <Presentation
                                size={14}
                                className="text-[var(--color-cyber-yellow)]"
                            />
                            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--color-cyber-yellow)]">
                                Community Resources
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-glow-yellow">
                            Featured{" "}
                            <span className="text-[var(--color-cyber-yellow)] relative">
                                Talks & Media
                                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--color-cyber-yellow)] to-transparent" />
                            </span>
                        </h1>

                        <p className="text-[var(--color-cyber-text-secondary)] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                            Presentations, media recordings, invited talks, and conference summaries from the CyberX community.
                        </p>
                    </div>
                </div>
            </header>

            {/* ═══ COMING SOON DISPLAY ═══ */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
                <div className="coming-soon-card rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-cyber-yellow)] to-transparent opacity-40"></div>

                    <div className="w-16 h-16 rounded-full bg-[var(--color-cyber-yellow)]/10 flex items-center justify-center text-[var(--color-cyber-yellow)]">
                        <Video size={28} className="animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2 flex-wrap">
                            Media Archive Coming Soon <Sparkles size={18} className="text-[var(--color-cyber-yellow)]" />
                        </h2>
                        <p className="text-sm text-[var(--color-cyber-text-secondary)] leading-relaxed max-w-md mx-auto">
                            We are compiling our lecture slide decks, workshop walkthrough videos, and technical papers. The complete archive will be accessible here soon.
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

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="border-t border-[var(--color-cyber-border)] py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-xs text-[var(--color-cyber-text-muted)]">
                        © 2026 CyberX Community — All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
