'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Download, 
  LogOut, 
  Users, 
  HelpCircle, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Star,
  MessageSquare,
  Award,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function RsvpEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ averageRating: 0, totalFeedbacks: 0, ratingCounts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'with_feedback', 'with_question'
  const [activeTab, setActiveTab] = useState('rsvp'); // 'rsvp' or 'feedbacks'
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const router = useRouter();

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/rsvp/entries');

      if (response.status === 401) {
        // Redirect to admin login if unauthorized
        router.push('/hot_admin');
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setEntries(data.entries || []);
        setFeedbacks(data.feedbacks || []);
        if (data.feedbackStats) {
          setFeedbackStats(data.feedbackStats);
        }
      } else {
        setError(data.error || 'Failed to fetch RSVP entries');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [router]);

  // Click outside to close export dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (exportDropdownOpen && !e.target.closest('.export-container')) {
        setExportDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [exportDropdownOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('auth-token');
    router.push('/hot_admin');
    router.refresh();
  };

  // Filtering RSVP entries based on search term & filter mode
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Filter mode check
      if (filterMode === 'with_feedback' && !entry.feedback) return false;
      if (filterMode === 'with_question' && (!entry.anonymousQuestion || !entry.anonymousQuestion.trim())) return false;

      // Search term check
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchName = entry.name && entry.name.toLowerCase().includes(term);
      const matchEmail = entry.email && entry.email.toLowerCase().includes(term);
      const matchQuestion = entry.anonymousQuestion && entry.anonymousQuestion.toLowerCase().includes(term);
      const matchEvent = entry.eventName && entry.eventName.toLowerCase().includes(term);
      const matchFeedbackComment = entry.feedback?.comment && entry.feedback.comment.toLowerCase().includes(term);
      const matchFeedbackLabel = entry.feedback?.ratingLabel && entry.feedback.ratingLabel.toLowerCase().includes(term);

      return matchName || matchEmail || matchQuestion || matchEvent || matchFeedbackComment || matchFeedbackLabel;
    });
  }, [entries, searchTerm, filterMode]);

  // Filtering all Feedbacks list for "Feedbacks" tab
  const filteredFeedbacks = useMemo(() => {
    if (!searchTerm.trim()) return feedbacks;
    const term = searchTerm.toLowerCase();
    return feedbacks.filter((fb) => {
      const matchName = fb.candidateName && fb.candidateName.toLowerCase().includes(term);
      const matchEmail = fb.candidateEmail && fb.candidateEmail.toLowerCase().includes(term);
      const matchComment = fb.comment && fb.comment.toLowerCase().includes(term);
      const matchLabel = fb.ratingLabel && fb.ratingLabel.toLowerCase().includes(term);
      const matchCert = fb.certificateNo && fb.certificateNo.toLowerCase().includes(term);
      return matchName || matchEmail || matchComment || matchLabel || matchCert;
    });
  }, [feedbacks, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = entries.length;
    const withQuestions = entries.filter(e => e.anonymousQuestion && e.anonymousQuestion.trim().length > 0).length;
    const withFeedbackCount = entries.filter(e => e.feedback).length;

    // Calculate fallback average rating if needed
    let avg = feedbackStats.averageRating || 0;
    if (!avg && feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, f) => acc + (Number(f.rating) || 0), 0);
      avg = Number((sum / feedbacks.length).toFixed(1));
    }

    return { 
      total, 
      withQuestions,
      withFeedbackCount,
      totalFeedbacks: feedbackStats.totalFeedbacks || feedbacks.length,
      averageRating: avg
    };
  }, [entries, feedbacks, feedbackStats]);

  // Active view list and pagination
  const currentList = activeTab === 'rsvp' ? filteredEntries : filteredFeedbacks;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return currentList.slice(start, start + itemsPerPage);
  }, [currentList, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchTerm, itemsPerPage, filterMode, activeTab]);

  // Checkbox handlers
  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    const pageIds = paginatedList.map(e => e._id);
    const allSelectedOnPage = pageIds.every(id => selectedIds.has(id));

    const newSelected = new Set(selectedIds);
    if (allSelectedOnPage) {
      pageIds.forEach(id => newSelected.delete(id));
    } else {
      pageIds.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  // CSV Export logic
  const exportToCSV = (onlySelected = false) => {
    const list = onlySelected 
      ? entries.filter(e => selectedIds.has(e._id))
      : filteredEntries;
    
    if (list.length === 0) return;

    const headers = [
      'Name', 
      'Email', 
      'Anonymous Question', 
      'Feedback Rating', 
      'Feedback Label', 
      'Feedback Comment', 
      'Registered Date', 
      'Event Name'
    ];

    const csvRows = [
      headers.join(','),
      ...list.map(e => [
        `"${(e.name || '').replace(/"/g, '""')}"`,
        `"${(e.email || '').replace(/"/g, '""')}"`,
        `"${(e.anonymousQuestion || '').replace(/"/g, '""')}"`,
        `"${e.feedback?.rating ? e.feedback.rating + '/5' : 'N/A'}"`,
        `"${(e.feedback?.ratingLabel || '').replace(/"/g, '""')}"`,
        `"${(e.feedback?.comment || '').replace(/"/g, '""')}"`,
        `"${e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : 'N/A'}"`,
        `"${(e.eventName || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp_entries_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setExportDropdownOpen(false);
  };

  // Render star ratings
  const renderStars = (rating) => {
    const numeric = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={13} 
            className={`${star <= numeric ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`} 
          />
        ))}
      </div>
    );
  };

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F0F] text-[#9A9A9A] font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-[#E6C200] animate-spin" />
          <span className="text-lg font-medium tracking-wide">Loading registrations & feedback...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F5F5F5] font-sans selection:bg-[#E6C200] selection:text-black relative overflow-hidden">
      
      {/* Premium ambient light backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/5 blur-[130px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/5 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-30 bg-[#0E0E0E]/80 backdrop-blur-md border-b border-white/5 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E6C200] rounded-md h-8 w-8 flex items-center justify-center text-black font-extrabold text-xs">CX</div>
            <h1 className="text-lg font-semibold tracking-tight text-[#F5F5F5]">
              CyberX <span className="text-[#A0A0A0] font-normal">Admin Panel</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/hot_admin/dashboard')} 
              className="text-xs text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors border border-white/5 rounded-lg px-3 py-1.5 flex items-center gap-1.5"
            >
              <ArrowLeft size={12} /> Applicants
            </button>
            <button 
              onClick={handleLogout} 
              className="text-xs text-[#A0A0A0] hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight">RSVP Registrations & Feedback</h2>
            <p className="text-[#A0A0A0] text-sm mt-1">Manage attendee registrations, view candidate feedback reviews, and analyze ratings.</p>
          </div>
          <button 
            onClick={fetchEntries}
            className="self-start sm:self-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 transition-all hover:scale-105 flex items-center gap-2 text-xs text-zinc-300"
            title="Refresh database"
          >
            <RefreshCw size={15} className={`${loading ? 'animate-spin text-[#E6C200]' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Total RSVP */}
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/5 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl text-[#E6C200]">
                <Users size={20} />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/10 border border-yellow-500/20 text-[#E6C200] px-2 py-0.5 rounded-full font-bold">
                Total RSVP
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">{stats.total}</div>
            <div className="text-xs text-[#A0A0A0] mt-1">Registrations saved in osintevent</div>
          </div>

          {/* Card 2: Overall Average Feedback Score */}
          <div className="bg-[#151515] border border-yellow-500/20 bg-gradient-to-br from-[#151515] via-[#151515] to-[#E6C200]/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/10 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/20 transition-all duration-300" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-yellow-500/20 rounded-xl text-[#E6C200]">
                <Star size={20} className="fill-[#E6C200]" />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/20 border border-yellow-500/30 text-[#E6C200] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                <Sparkles size={10} /> Overall Rating
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
                {stats.averageRating > 0 ? stats.averageRating : 'N/A'}
              </span>
              {stats.averageRating > 0 && (
                <span className="text-sm font-semibold text-[#A0A0A0]">/ 5.0</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <span className="text-[11px] text-[#A0A0A0]">
                {stats.totalFeedbacks} {stats.totalFeedbacks === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>

          {/* Card 3: Feedbacks Received */}
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/5 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl text-[#E6C200]">
                <MessageSquare size={20} />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/10 border border-yellow-500/20 text-[#E6C200] px-2 py-0.5 rounded-full font-bold">
                Feedbacks
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">{stats.totalFeedbacks}</div>
            <div className="text-xs text-[#A0A0A0] mt-1">Submitted candidate reviews</div>
          </div>

          {/* Card 4: Questions */}
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/5 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl text-[#E6C200]">
                <HelpCircle size={20} />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/10 border border-yellow-500/20 text-[#E6C200] px-2 py-0.5 rounded-full font-bold">
                Questions
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">{stats.withQuestions}</div>
            <div className="text-xs text-[#A0A0A0] mt-1">Attendees submitted anonymous question</div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('rsvp')}
            className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
              activeTab === 'rsvp' 
                ? 'text-[#E6C200]' 
                : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
            }`}
          >
            <Users size={16} />
            RSVP Registrations ({filteredEntries.length})
            {activeTab === 'rsvp' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E6C200] rounded-t-md" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
              activeTab === 'feedbacks' 
                ? 'text-[#E6C200]' 
                : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
            }`}
          >
            <MessageSquare size={16} />
            All Feedbacks ({filteredFeedbacks.length})
            {activeTab === 'feedbacks' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E6C200] rounded-t-md" />
            )}
          </button>
        </div>

        {/* Filter and Export Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] h-4 w-4" />
              <input 
                type="text" 
                placeholder={
                  activeTab === 'rsvp' 
                    ? "Search name, email, question, or feedback comment..." 
                    : "Search feedback candidate name, email, or comment..."
                }
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#151515] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#E6C200]/50 transition-colors" 
              />
            </div>

            {activeTab === 'rsvp' && (
              <div className="flex items-center gap-1.5 bg-[#151515] border border-white/5 rounded-xl p-1 w-full sm:w-auto self-stretch sm:self-auto justify-center">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filterMode === 'all' 
                      ? 'bg-[#E6C200] text-black shadow' 
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
                  }`}
                >
                  All ({entries.length})
                </button>
                <button
                  onClick={() => setFilterMode('with_feedback')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    filterMode === 'with_feedback' 
                      ? 'bg-[#E6C200] text-black shadow' 
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
                  }`}
                >
                  <Star size={12} className={filterMode === 'with_feedback' ? 'fill-black' : ''} />
                  With Feedback ({stats.withFeedbackCount})
                </button>
                <button
                  onClick={() => setFilterMode('with_question')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    filterMode === 'with_question' 
                      ? 'bg-[#E6C200] text-black shadow' 
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
                  }`}
                >
                  Questions ({stats.withQuestions})
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {activeTab === 'rsvp' && selectedIds.size > 0 && (
              <div className="text-xs text-[#A0A0A0] hidden sm:block mr-2">
                <span className="text-[#E6C200] font-semibold">{selectedIds.size}</span> selected
              </div>
            )}

            {/* Export Dropdown */}
            {activeTab === 'rsvp' && (
              <div className="relative export-container">
                <button 
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)} 
                  className="bg-[#E6C200] hover:bg-[#CCAD00] text-black text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Download size={16} /> Export
                </button>
                
                {exportDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#1C1C1C] border border-white/5 rounded-xl shadow-xl z-20 py-1.5">
                    <button 
                      onClick={() => exportToCSV(false)} 
                      className="block w-full text-left px-4 py-2 text-xs text-[#F5F5F5] hover:bg-white/5 transition-colors"
                    >
                      Export All Filtered ({filteredEntries.length})
                    </button>
                    <button 
                      onClick={() => exportToCSV(true)} 
                      disabled={selectedIds.size === 0} 
                      className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                        selectedIds.size > 0 
                          ? 'text-[#F5F5F5] hover:bg-white/5' 
                          : 'text-[#555] cursor-not-allowed'
                      }`}
                    >
                      Export Selected ({selectedIds.size})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RSVP Entries View */}
        {activeTab === 'rsvp' && (
          filteredEntries.length === 0 ? (
            <div className="py-20 text-center text-[#555] border border-dashed border-white/5 rounded-2xl bg-[#151515]/20">
              No registrations found matching the query.
            </div>
          ) : (
            <div className="bg-[#151515]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#151515] border-b border-white/5 text-[#555] text-xs uppercase font-bold tracking-wider">
                      <th className="py-4 px-6 w-12 text-center">
                        <input
                          type="checkbox"
                          className="rounded cursor-pointer accent-[#E6C200] w-4 h-4 bg-transparent border-white/10"
                          checked={
                            paginatedList.length > 0 && 
                            paginatedList.every(e => selectedIds.has(e._id))
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="py-4 px-6 w-1/5">Attendee</th>
                      <th className="py-4 px-6 w-1/4">Feedback & Rating</th>
                      <th className="py-4 px-6 w-1/4">Anonymous Question</th>
                      <th className="py-4 px-6 w-1/6">Event Registered</th>
                      <th className="py-4 px-6 w-1/6 text-right">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {paginatedList.map((entry) => (
                      <tr 
                        key={entry._id} 
                        className={`hover:bg-white/[0.01] transition-colors ${
                          selectedIds.has(entry._id) ? 'bg-[#E6C200]/5' : ''
                        }`}
                      >
                        <td className="py-4 px-6 text-center">
                          <input
                            type="checkbox"
                            className="rounded cursor-pointer accent-[#E6C200] w-4 h-4 bg-transparent border-white/10"
                            checked={selectedIds.has(entry._id)}
                            onChange={() => handleSelectRow(entry._id)}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[#F5F5F5] font-semibold">{entry.name}</div>
                          <div className="text-[#A0A0A0] text-xs mt-0.5">{entry.email}</div>
                        </td>
                        
                        {/* Feedback Column */}
                        <td className="py-4 px-6">
                          {entry.feedback ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                {renderStars(entry.feedback.rating)}
                                <span className="text-xs font-bold text-yellow-400">
                                  {entry.feedback.rating}.0
                                </span>
                                {entry.feedback.ratingLabel && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-yellow-500/10 text-[#E6C200] border border-yellow-500/20">
                                    {entry.feedback.ratingLabel}
                                  </span>
                                )}
                              </div>
                              {entry.feedback.comment && entry.feedback.comment.trim().length > 0 ? (
                                <div className="text-[#F5F5F5] bg-[#1E1E1E] border border-yellow-500/10 px-3 py-1.5 rounded-xl text-xs italic font-normal text-zinc-300 leading-relaxed max-w-sm">
                                  &ldquo;{entry.feedback.comment}&rdquo;
                                </div>
                              ) : (
                                <span className="text-[#666] text-[11px] italic">No comment written</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#555] text-xs italic bg-white/5 px-2.5 py-1 rounded-lg inline-block">
                              No feedback yet
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          {entry.anonymousQuestion && entry.anonymousQuestion.trim().length > 0 ? (
                            <div className="text-[#F5F5F5] bg-[#1E1E1E] border border-white/5 px-3 py-2 rounded-xl text-xs max-w-lg italic font-normal text-zinc-300 leading-relaxed">
                              &ldquo;{entry.anonymousQuestion}&rdquo;
                            </div>
                          ) : (
                            <span className="text-[#555] text-xs italic">No question submitted</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[#F5F5F5] text-xs font-semibold max-w-xs truncate">{entry.eventName}</div>
                          <div className="text-[#E6C200] text-[10px] uppercase font-bold tracking-wider mt-0.5">{entry.eventDate}</div>
                        </td>
                        <td className="py-4 px-6 text-right text-xs text-[#A0A0A0] whitespace-nowrap">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination / Table Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-white/5 bg-[#151515] gap-4">
                <div className="flex items-center gap-4 text-xs text-[#A0A0A0]">
                  <span>
                    Showing <span className="text-[#F5F5F5] font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="text-[#F5F5F5] font-semibold">
                      {Math.min(currentPage * itemsPerPage, filteredEntries.length)}
                    </span>{' '}
                    of <span className="text-[#F5F5F5] font-semibold">{filteredEntries.length}</span> entries
                  </span>
                  
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-[#0E0E0E] border border-white/5 rounded-lg px-2 py-1 text-[#F5F5F5] outline-none"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-1 text-xs text-[#A0A0A0] font-semibold">
                    <span className="text-[#F5F5F5] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">{currentPage}</span>
                    <span className="mx-1">/</span>
                    <span>{totalPages || 1}</span>
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* All Feedbacks View */}
        {activeTab === 'feedbacks' && (
          filteredFeedbacks.length === 0 ? (
            <div className="py-20 text-center text-[#555] border border-dashed border-white/5 rounded-2xl bg-[#151515]/20">
              No feedback submissions found in database.
            </div>
          ) : (
            <div className="bg-[#151515]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#151515] border-b border-white/5 text-[#555] text-xs uppercase font-bold tracking-wider">
                      <th className="py-4 px-6 w-1/4">Candidate</th>
                      <th className="py-4 px-6 w-1/6">Rating Score</th>
                      <th className="py-4 px-6 w-1/3">Comment / Review</th>
                      <th className="py-4 px-6 w-1/6">Cert No</th>
                      <th className="py-4 px-6 w-1/6 text-right">Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {paginatedList.map((fb, idx) => (
                      <tr key={fb._id || idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-[#F5F5F5] font-semibold">{fb.candidateName || 'N/A'}</div>
                          <div className="text-[#A0A0A0] text-xs mt-0.5">{fb.candidateEmail}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              {renderStars(fb.rating)}
                              <span className="text-xs font-bold text-yellow-400">{fb.rating}.0</span>
                            </div>
                            {fb.ratingLabel && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-yellow-500/10 text-[#E6C200] border border-yellow-500/20 w-fit">
                                {fb.ratingLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {fb.comment && fb.comment.trim().length > 0 ? (
                            <div className="text-[#F5F5F5] bg-[#1E1E1E] border border-white/5 px-3.5 py-2 rounded-xl text-xs italic font-normal text-zinc-200 leading-relaxed max-w-lg">
                              &ldquo;{fb.comment}&rdquo;
                            </div>
                          ) : (
                            <span className="text-[#555] text-xs italic">No comment provided</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-mono font-bold text-[#E6C200] bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/20">
                            {fb.certificateNo || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-xs text-[#A0A0A0] whitespace-nowrap">
                          {fb.submittedAt ? new Date(fb.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Feedbacks tab */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-white/5 bg-[#151515] gap-4">
                <div className="flex items-center gap-4 text-xs text-[#A0A0A0]">
                  <span>
                    Showing <span className="text-[#F5F5F5] font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="text-[#F5F5F5] font-semibold">
                      {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)}
                    </span>{' '}
                    of <span className="text-[#F5F5F5] font-semibold">{filteredFeedbacks.length}</span> feedbacks
                  </span>
                  
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-[#0E0E0E] border border-white/5 rounded-lg px-2 py-1 text-[#F5F5F5] outline-none"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-1 text-xs text-[#A0A0A0] font-semibold">
                    <span className="text-[#F5F5F5] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">{currentPage}</span>
                    <span className="mx-1">/</span>
                    <span>{totalPages || 1}</span>
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
