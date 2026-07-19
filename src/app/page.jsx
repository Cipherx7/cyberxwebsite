"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

/* ─── Animated counter hook ─── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── Fade-in-on-scroll wrapper ─── */
function FadeIn({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Floating particle background ─── */
function ParticleField() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 8}s`,
      width: `${2 + Math.random() * 3}px`,
      height: `${2 + Math.random() * 3}px`,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="particle-field">
      {particles.map((style, i) => (
        <div key={i} className="particle" style={style} />
      ))}
    </div>
  );
}

/* Navbar is now imported from @/components/Navbar */

/* ─── Stats section ─── */
const STATS = [
  { value: 500, suffix: "+", label: "Community Members" },
  { value: 25, suffix: "+", label: "Events Hosted" },
  { value: 15, suffix: "+", label: "CTF Competitions" },
  { value: 8, suffix: "", label: "City Chapters" },
];

function StatCard({ value, suffix, label }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="stat-card">
      <span className="stat-number">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ─── Feature card ─── */
const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "CTF Competitions",
    desc: "Test your hacking skills across web exploitation, cryptography, reverse engineering, and PWN challenges.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Workshops & Talks",
    desc: "Learn from industry experts through hands-on workshops, webinars, and knowledge-sharing sessions on cutting-edge topics.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Open Source Tools",
    desc: "Contribute to and use community-built cybersecurity tools. Build your portfolio while making an impact.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "City Chapters",
    desc: "Join a local chapter or start one in your city. Connect with nearby cybersecurity enthusiasts and grow together.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Mentorship",
    desc: "Get guided by experienced professionals. From career advice to technical deep-dives, we've got you covered.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
      </svg>
    ),
    title: "Scholarship Program",
    desc: "Access exclusive scholarships for cybersecurity certifications and training programs through our partnerships.",
  },
];

/* ─── Main Page ─── */
export default function HomePage() {
  return (
    <div className="home-page">
      <ParticleField />
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="hero-section">
        {/* Background glow orbs */}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="grid-overlay" />

        <div className="hero-content">
          <FadeIn>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Open Community · Est. 2023
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="hero-title">
              Where <span className="text-gradient">Cybersecurity</span>
              <br />
              Meets Innovation
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="hero-subtitle">
              CyberX is a student-driven cybersecurity community building the
              next generation of security professionals through CTFs, workshops,
              open-source tools, and real-world collaboration.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="hero-actions">
              <Link href="/apply" className="btn-primary">
                <span>Join the Community</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/rsvp" className="btn-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Upcoming Events</span>
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="stats-grid">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="about-section">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="section-header">
              <span className="section-tag">About Us</span>
              <h2 className="section-title">
                Built by Students.{" "}
                <span className="text-gradient">Driven by Passion.</span>
              </h2>
              <p className="section-desc">
                CyberX started as a small group of cybersecurity enthusiasts in
                Nashik and has grown into a multi-city community of 500+ members.
                We believe in learning by doing — whether it&apos;s cracking a CTF
                challenge, building security tools, or mentoring the next
                generation of ethical hackers.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ UPCOMING EVENT ============ */}
      <section className="event-section">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="section-header">
              <span className="section-tag">Live Session</span>
              <h2 className="section-title">
                Learn from the <span className="text-gradient">Experts</span>
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="event-container">
              <div className="event-banner-card">
                <div className="event-banner-content">
                  <span className="event-banner-badge">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-cyber-yellow)] animate-pulse" style={{ marginRight: '0.25rem' }} />
                    Live Online Event
                  </span>
                  <h3 className="event-banner-title">
                    How Investigators Find Anyone Online using OSINT
                  </h3>
                  <p className="event-banner-desc">
                    What if the internet already contains the answers you&apos;re looking for? Join us as we reveal how investigators turn scattered public data into actionable intelligence.
                  </p>
                  
                  <div className="event-banner-meta">
                    <div className="event-meta-item">
                      <div className="event-meta-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div className="event-meta-text">
                        <span className="event-meta-label">Speaker</span>
                        <span className="event-meta-val">Saad Sarraj (cybersudo)</span>
                      </div>
                    </div>

                    <div className="event-meta-item">
                      <div className="event-meta-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <div className="event-meta-text">
                        <span className="event-meta-label">Date & Time</span>
                        <span className="event-meta-val">25th July | 3:00 PM IST</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="event-banner-footer">
                  <Link href="/rsvp" className="btn-primary">
                    <span>Reserve a Spot</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="features-section">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="section-header">
              <span className="section-tag">What We Do</span>
              <h2 className="section-title">
                Everything You Need to{" "}
                <span className="text-gradient">Level Up</span>
              </h2>
            </div>
          </FadeIn>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="cta-card">
              <div className="cta-glow" />
              <h2 className="cta-title">
                Ready to Start Your{" "}
                <span className="text-gradient">Cybersecurity Journey?</span>
              </h2>
              <p className="cta-desc">
                Join 500+ community members who are learning, building, and
                growing together. No experience required — just curiosity.
              </p>
              <div className="cta-actions">
                <Link href="/apply" className="btn-primary btn-lg">
                  <span>Apply Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/ctfs" className="btn-secondary">
                  <span>Browse CTFs</span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="max-w-7xl mx-auto px-6">
          <div className="footer-grid">
            <div className="footer-brand">
              <Image
                src="/assets/logo.png"
                alt="CyberX Logo"
                width={140}
                height={40}
                className="object-contain mb-4"
              />
              <p className="footer-tagline">
                Connecting motivated learners and practitioners in cybersecurity.
              </p>
              <div className="footer-socials">
                <a
                  href="https://www.linkedin.com/company/cyberx-nashik-community/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/cyberx.nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/Cipherx7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-heading">Community</h4>
              <Link href="/apply" className="footer-link">Join Us</Link>
              <Link href="/chapters" className="footer-link">Chapters</Link>
              <Link href="/hall-of-fame" className="footer-link">Hall of Fame</Link>
              <Link href="/scholarship" className="footer-link">Scholarships</Link>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-heading">Resources</h4>
              <Link href="/ctfs" className="footer-link">CTF Challenges</Link>
              <Link href="/rsvp" className="footer-link">Events</Link>
              <Link href="/media" className="footer-link">Media</Link>
              <Link href="/sponsor" className="footer-link">Sponsor Us</Link>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-heading">Connect</h4>
              <a href="https://www.linkedin.com/company/cyberx-nashik-community/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
              <a href="https://www.instagram.com/cyberx.nashik" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
              <a href="https://www.commudle.com/communities/cyberx-nashik" target="_blank" rel="noopener noreferrer" className="footer-link">Commudle</a>
              <a href="https://github.com/Cipherx7" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CyberX Community — All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
