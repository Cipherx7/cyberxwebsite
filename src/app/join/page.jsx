'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
    MessageSquare, 
    MessageCircle, 
    Instagram, 
    Calendar, 
    Users, 
    ArrowRight, 
    Send, 
    Check, 
    Heart, 
    MessageCircleCode, 
    ThumbsUp, 
    ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default function JoinUsPage() {
    const [likedPosts, setLikedPosts] = useState({});

    const handleLike = (id) => {
        setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 font-sans">
            <Navbar />

            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-yellow-500/10 blur-[130px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-yellow-500/5 blur-[130px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15 mix-blend-overlay" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
                
                {/* Header */}
                <header className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs font-semibold uppercase tracking-wider">
                        ⚡ Connect With Us
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">CyberX</span> Community
                    </h1>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
                        Whether you want to learn hacking, discuss threat intel, attend local meetups, or follow our journey—choose your channel to get started.
                    </p>
                </header>

                {/* Grid layout for major channels */}
                <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">

                    {/* Discord Card */}
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-[0_15px_30px_rgba(0,0,0,0.5)] group hover:border-zinc-700 transition-all duration-300">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 bg-indigo-500/15 text-indigo-400 rounded-xl flex items-center justify-center">
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Discord Server</h2>
                                            <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Active Chat & Collabs</p>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2.5 py-1 rounded-full font-bold">
                                    3,200+ Members
                                </span>
                            </div>
                            
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Join our central hub to interact with speakers, share custom security tools, organize CTF teams, and chat with local security experts.
                            </p>

                            {/* Discord Chat Feed Preview */}
                            <div className="bg-zinc-950/80 rounded-2xl border border-zinc-850 p-4 font-mono text-xs space-y-3 shadow-inner">
                                <div className="flex items-center justify-between pb-2 border-b border-zinc-900 text-[10px] text-zinc-500">
                                    <span>#general-chat</span>
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <div className="space-y-2 text-zinc-400 max-h-[140px] overflow-y-auto">
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-500 font-bold">saad_s</span>
                                        <span className="text-zinc-500">[Speaker]</span>
                                        <span>Hey guys, slides for the OSINT session are uploaded! 🚀</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-white font-semibold">cipher_7</span>
                                        <span>Awesome! Can we get a link to the CTF sandbox?</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-white font-semibold">lucy_sec</span>
                                        <span>Is anyone participating in the HackTheBox tournament this weekend?</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-indigo-400 font-semibold">alex_d</span>
                                        <span>Count me in! Let's create a team channel.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a 
                            href="https://discord.gg/cyberx" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]"
                        >
                            Connect on Discord
                            <ExternalLink size={14} />
                        </a>
                    </div>

                    {/* WhatsApp Card */}
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-[0_15px_30px_rgba(0,0,0,0.5)] group hover:border-zinc-700 transition-all duration-300">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 bg-emerald-500/15 text-emerald-400 rounded-xl flex items-center justify-center">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">WhatsApp Group</h2>
                                            <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Direct Alerts</p>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                                    1,500+ Members
                                </span>
                            </div>
                            
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Get immediate notifications on new event launches, workshops, CTFs, and special community resources delivered straight to your phone.
                            </p>

                            {/* WhatsApp Feed Preview */}
                            <div className="bg-zinc-950/80 rounded-2xl border border-zinc-850 p-4 space-y-3 shadow-inner">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                                    <div className="w-6 h-6 bg-yellow-500 text-black font-black rounded-full flex items-center justify-center text-[9px]">CX</div>
                                    <span className="text-xs font-semibold text-zinc-300">CyberX Announcements</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-xs max-w-[85%] relative">
                                        <p className="text-zinc-300 leading-relaxed">
                                            🚨 <strong>Upcoming Live Session Alert!</strong><br/>
                                            How Investigators Find Anyone Online using OSINT by Saad Sarraj on 25th July. Check rsvp link below!
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-zinc-500">
                                            <span>09:42 AM</span>
                                            <Check size={10} className="text-emerald-400" />
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-xs max-w-[85%] relative">
                                        <p className="text-zinc-300 leading-relaxed">
                                            Congratulations to the winners of our last CTF! 🏆 Certificates have been sent via email.
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-zinc-500">
                                            <span>Yesterday</span>
                                            <Check size={10} className="text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a 
                            href="https://chat.whatsapp.com/cyberx" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                        >
                            Join WhatsApp Channel
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                {/* Additional Channels row */}
                <div className="grid md:grid-cols-3 gap-6 items-stretch mb-16">
                    
                    {/* Instagram Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-800 transition-colors">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-pink-500">
                                <Instagram size={20} />
                                <h3 className="font-bold text-base text-white">Instagram Feed</h3>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                Catch event highlights, cybersecurity tips, slides, and meme posts.
                            </p>

                            {/* Instagram Mock Feed */}
                            <div className="grid grid-cols-2 gap-2">
                                <div 
                                    className="aspect-square bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex flex-col justify-between cursor-pointer group/post relative overflow-hidden"
                                    onClick={() => handleLike('i1')}
                                >
                                    <div className="text-[10px] font-bold text-yellow-500">OSINT</div>
                                    <div className="text-[8px] text-zinc-500">July 25</div>
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/post:opacity-100 transition-opacity">
                                        <Heart size={14} className={likedPosts['i1'] ? 'text-red-500 fill-red-500' : 'text-white'} />
                                    </div>
                                </div>
                                <div 
                                    className="aspect-square bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex flex-col justify-between cursor-pointer group/post relative overflow-hidden"
                                    onClick={() => handleLike('i2')}
                                >
                                    <div className="text-[10px] font-bold text-yellow-500">CTF</div>
                                    <div className="text-[8px] text-zinc-500">Winners</div>
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/post:opacity-100 transition-opacity">
                                        <Heart size={14} className={likedPosts['i2'] ? 'text-red-500 fill-red-500' : 'text-white'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a 
                            href="https://instagram.com/cyberx_community" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-5 w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                            Follow on Instagram
                        </a>
                    </div>

                    {/* Commudle Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-800 transition-colors">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <Users size={20} />
                                <h3 className="font-bold text-base text-white">Commudle</h3>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                Join our official registration partner community page for tickets and announcements.
                            </p>

                            {/* Commudle Mock Feed */}
                            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[10px] space-y-2">
                                <div className="border-b border-zinc-900 pb-1.5 font-semibold text-zinc-300">Upcoming RSVP</div>
                                <div className="flex justify-between items-center text-zinc-400">
                                    <span>OSINT Investigator Session</span>
                                    <span className="text-yellow-500">25th July</span>
                                </div>
                                <div className="flex justify-between items-center text-zinc-400">
                                    <span>Intro to Malware Analysis</span>
                                    <span className="text-zinc-650">Completed</span>
                                </div>
                            </div>
                        </div>
                        <a 
                            href="https://commudle.com/communities/cyberx" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-5 w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                            Join on Commudle
                        </a>
                    </div>

                    {/* Meetup Card */}
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-800 transition-colors">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-red-500">
                                <Calendar size={20} />
                                <h3 className="font-bold text-base text-white">Meetup Group</h3>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                Be part of our physical chapters and hands-on workshops in Nashik.
                            </p>

                            {/* Meetup Mock Feed */}
                            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[10px] space-y-2">
                                <div className="border-b border-zinc-900 pb-1.5 font-semibold text-zinc-300">Local Events</div>
                                <div className="text-zinc-400">
                                    <p className="font-bold text-white">CyberX Chapter Meetup #4</p>
                                    <p className="text-zinc-500">Threat Hunting 101 • In-Person</p>
                                </div>
                            </div>
                        </div>
                        <a 
                            href="https://meetup.com/cyberx" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-5 w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                            Follow on Meetup
                        </a>
                    </div>
                </div>

                {/* Core member invitation section */}
                <div className="relative rounded-3xl overflow-hidden border border-zinc-800 p-8 sm:p-12 bg-gradient-to-br from-zinc-900 to-black">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="max-w-2xl space-y-4 relative z-10">
                        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Contribute</span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                            Looking to do more? <br className="hidden sm:inline"/>Apply for the Core Team.
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Organize CTFs, manage social channels, develop open-source community utilities, and gain exclusive mentorship perks. We are looking for passionate cybersecurity learners to build the community.
                        </p>
                        <div className="pt-4">
                            <Link 
                                href="/apply" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] group"
                            >
                                Apply as Core Member
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
