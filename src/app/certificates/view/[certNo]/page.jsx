'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Download, ArrowLeft, Linkedin, Share2, CheckCircle2,
  Loader2, AlertCircle, Mail, ExternalLink, Copy, Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { generateCertificateBlob, downloadCertificate } from '@/lib/generateCertificateClient';

/* ─────────────────────────────────────────────────────────────
   Canvas Preview — renders certificate in real-time
───────────────────────────────────────────────────────────── */
function CertificateCanvas({ candidateName, certificateNo }) {
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!candidateName || !certificateNo) return;
    setRendered(false);
    setRenderError(false);

    generateCertificateBlob({ candidateName, certificateNo })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          setRendered(true);
        };
        img.src = url;
      })
      .catch(() => setRenderError(true));
  }, [candidateName, certificateNo]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      {/* Shimmer while loading */}
      {!rendered && !renderError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-yellow-500" />
            <p className="text-zinc-500 text-sm">Rendering certificate…</p>
          </div>
        </div>
      )}
      {renderError && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
          <div className="flex flex-col items-center gap-2 text-red-400">
            <AlertCircle size={28} />
            <p className="text-sm">Failed to render certificate</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
        style={{ opacity: rendered ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Copy-link helper button
───────────────────────────────────────────────────────────── */
function CopyLinkBtn({ certNo }) {
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/certificates/view/${certNo}`
    : `https://cyberx.org.in/certificates/view/${certNo}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <button
      onClick={handleCopy}
      id="copy-cert-link"
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-semibold rounded-xl transition-all"
    >
      {copied
        ? <><CheckCircle2 size={16} className="text-green-400" /> Copied!</>
        : <><Copy size={16} /> Copy Certificate Link</>}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Preview Page
───────────────────────────────────────────────────────────── */
export default function CertificateViewPage() {
  const { certNo } = useParams();
  const [cert, setCert] = useState(null);
  const [loadStatus, setLoadStatus] = useState('loading'); // loading | ready | error
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!certNo) return;
    fetch(`/api/certificates/${certNo}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCert(data);
          setLoadStatus('ready');
        } else {
          setLoadStatus('error');
        }
      })
      .catch(() => setLoadStatus('error'));
  }, [certNo]);

  const handleDownload = async () => {
    if (!cert) return;
    setDownloading(true);
    try {
      await downloadCertificate({
        candidateName: cert.candidateName,
        certificateNo: cert.certificateNo,
      });
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // LinkedIn "Add to Profile" deep-link
  const linkedinUrl = cert
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
      `&name=${encodeURIComponent('OSINT Researcher & Digital Investigations — CyberX')}` +
      `&organizationName=${encodeURIComponent('CyberX Community')}` +
      `&issueYear=2026&issueMonth=7` +
      `&certUrl=${encodeURIComponent(`https://cyberx.org.in/certificates/view/${cert.certificateNo}`)}` +
      `&certId=${encodeURIComponent(cert.certificateNo)}`
    : '#';

  // Native share
  const handleShare = async () => {
    if (!cert) return;
    const shareUrl = `${window.location.origin}/certificates/view/${cert.certificateNo}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cert.candidateName}'s CyberX Certificate`,
          text: `I earned the OSINT Researcher & Digital Investigations certificate from CyberX Community!`,
          url: shareUrl,
        });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Certificate link copied to clipboard!');
    }
  };

  // Pre-computed mailto URL for support link
  const mailtoUrl = cert
    ? `mailto:info@cyberx.org.in?subject=${encodeURIComponent(`Certificate Issue - ${cert.certificateNo}`)}&body=${encodeURIComponent(`Certificate ID: ${cert.certificateNo}\nName: ${cert.candidateName}\nIssue: `)}`
    : 'mailto:info@cyberx.org.in';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Navbar />

      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-500/5 blur-[120px]" />
      </div>
      <div className="grid-overlay fixed inset-0 pointer-events-none" />

      <div className="relative z-10 pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <Link
            href="/certificates/osint-researcher-digital-investigations"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-yellow-500 transition-colors group mb-8"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to event
          </Link>

          {/* ── Loading ── */}
          {loadStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 size={36} className="animate-spin text-yellow-500" />
              <p className="text-zinc-500">Fetching certificate…</p>
            </div>
          )}

          {/* ── Error ── */}
          {loadStatus === 'error' && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <AlertCircle size={40} className="text-red-400" />
              <p className="text-white font-bold text-lg">Certificate not found</p>
              <p className="text-zinc-500 text-sm max-w-sm">
                The certificate ID <span className="font-mono text-zinc-300">{certNo}</span> doesn't exist or has been revoked.
              </p>
              <Link
                href="/certificates/osint-researcher-digital-investigations"
                className="mt-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl text-sm transition-all"
              >
                Search again
              </Link>
            </div>
          )}

          {/* ── Ready ── */}
          {loadStatus === 'ready' && cert && (
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

              {/* LEFT — Certificate Preview (3/5) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Badge */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase">
                    <Shield size={11} /> Verified Certificate
                  </div>
                  <span className="text-zinc-600 text-xs font-mono">{cert.certificateNo}</span>
                </div>

                <CertificateCanvas
                  candidateName={cert.candidateName}
                  certificateNo={cert.certificateNo}
                />

                <p className="text-zinc-600 text-xs text-center">
                  This certificate is digitally issued by CyberX Community and can be independently verified.
                </p>
              </div>

              {/* RIGHT — Actions panel (2/5) */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24 space-y-5">

                  {/* Cert details card */}
                  <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500" />
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-semibold mb-0.5">Awarded to</p>
                        <p className="text-xl font-extrabold text-white leading-tight">{cert.candidateName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Event</span>
                          <span className="text-zinc-200 font-medium leading-snug">{cert.eventTitle}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Date</span>
                          <span className="text-zinc-200 font-medium">{cert.eventDate}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Category</span>
                          <span className="text-zinc-200 font-medium">{cert.eventCategory}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Status</span>
                          <span className="text-green-400 font-bold">{cert.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    {/* Download */}
                    <button
                      id="download-cert-btn"
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {downloading
                        ? <><Loader2 size={18} className="animate-spin" /> Generating PNG…</>
                        : <><Download size={18} /> Download Certificate (PNG)</>}
                    </button>

                    {/* LinkedIn */}
                    <a
                      id="linkedin-add-btn"
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#0a66c2] hover:bg-[#0958a8] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(10,102,194,0.2)] hover:shadow-[0_0_30px_rgba(10,102,194,0.35)]"
                    >
                      <Linkedin size={18} />
                      Add to LinkedIn Profile
                      <ExternalLink size={13} className="opacity-70" />
                    </a>

                    {/* Share */}
                    <button
                      id="share-cert-btn"
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                      <Share2 size={16} /> Share Certificate
                    </button>

                    {/* Copy link */}
                    <CopyLinkBtn certNo={cert.certificateNo} />
                  </div>

                  {/* Support footer */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">Need help?</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      If there's an error in your certificate details or you have any other issue, reach out to us:
                    </p>
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-1.5 text-yellow-500 hover:text-yellow-400 text-xs font-semibold transition-colors"
                    >
                      <Mail size={13} />
                      info@cyberx.org.in
                      <ExternalLink size={10} />
                    </a>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} CyberX Community — All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
            <Link href="/certificates" className="hover:text-yellow-500 transition-colors">Certificates</Link>
            <a href="mailto:info@cyberx.org.in" className="hover:text-yellow-500 transition-colors flex items-center gap-1">
              info@cyberx.org.in <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
