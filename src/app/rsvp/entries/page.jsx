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
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  Calendar
} from 'lucide-react';

export default function RsvpEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Local filtering based on search query
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchSearch =
        searchTerm === '' ||
        (entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.email && entry.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.anonymousQuestion && entry.anonymousQuestion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.eventName && entry.eventName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [entries, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = entries.length;
    const withQuestions = entries.filter(e => e.anonymousQuestion && e.anonymousQuestion.trim().length > 0).length;
    return { total, withQuestions };
  }, [entries]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchTerm, itemsPerPage]);

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
    const pageIds = paginatedEntries.map(e => e._id);
    const allSelectedOnPage = pageIds.every(id => selectedIds.has(id));

    const newSelected = new Set(selectedIds);
    if (allSelectedOnPage) {
      pageIds.forEach(id => newSelected.delete(id));
    } else {
      pageIds.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAllEntries = () => {
    const newSelected = new Set(filteredEntries.map(e => e._id));
    setSelectedIds(newSelected);
  };

  // CSV Export logic
  const exportToCSV = (onlySelected = false) => {
    const list = onlySelected 
      ? entries.filter(e => selectedIds.has(e._id))
      : filteredEntries;
    
    if (list.length === 0) return;

    const headers = ['Name', 'Email', 'Anonymous Question', 'Registered Date', 'Event Name'];
    const csvRows = [
      headers.join(','),
      ...list.map(e => [
        `"${(e.name || '').replace(/"/g, '""')}"`,
        `"${(e.email || '').replace(/"/g, '""')}"`,
        `"${(e.anonymousQuestion || '').replace(/"/g, '""')}"`,
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

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F0F] text-[#9A9A9A] font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-[#E6C200] animate-spin" />
          <span className="text-lg font-medium tracking-wide">Loading registrations...</span>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight">RSVP Event Registrations</h2>
            <p className="text-[#A0A0A0] text-sm mt-1">Manage, filter and export attendees from the OSINT Event collection.</p>
          </div>
          <button 
            onClick={fetchEntries}
            className="self-start sm:self-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 transition-all hover:scale-105"
            title="Refresh database"
          >
            <RefreshCw size={16} className={`${loading ? 'animate-spin text-[#E6C200]' : ''}`} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/5 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-[#E6C200]">
                <Users size={22} />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/10 border border-yellow-500/20 text-[#E6C200] px-2 py-0.5 rounded-full font-bold">
                Total RSVP
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">{stats.total}</div>
            <div className="text-xs text-[#A0A0A0] mt-1">Registrations saved in osintevent</div>
          </div>

          <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/5 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-[#E6C200]">
                <HelpCircle size={22} />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/10 border border-yellow-500/20 text-[#E6C200] px-2 py-0.5 rounded-full font-bold">
                Questions
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">{stats.withQuestions}</div>
            <div className="text-xs text-[#A0A0A0] mt-1">Attendees submitted anonymous question</div>
          </div>

          <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group col-span-1">
            <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/5 rounded-full blur-xl translate-x-4 -translate-y-4 group-hover:bg-yellow-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-[#E6C200]">
                <Calendar size={22} />
              </div>
              <span className="text-[10px] tracking-wider uppercase bg-yellow-500/10 border border-yellow-500/20 text-[#E6C200] px-2 py-0.5 rounded-full font-bold">
                Main Event Date
              </span>
            </div>
            <div className="text-base font-bold text-[#F5F5F5] tracking-tight truncate">
              {entries[0]?.eventDate || 'OSINT Event'}
            </div>
            <div className="text-xs text-[#A0A0A0] mt-2 line-clamp-1">
              {entries[0]?.eventName || 'How Investigators Find Anyone Online'}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Filter and Export Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by name, email, or question..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#151515] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none focus:border-[#E6C200]/50 transition-colors" 
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {selectedIds.size > 0 && (
              <div className="text-xs text-[#A0A0A0] hidden sm:block mr-2">
                <span className="text-[#E6C200] font-semibold">{selectedIds.size}</span> selected
              </div>
            )}

            {/* Export Dropdown */}
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
          </div>
        </div>

        {/* Entries Table Card */}
        {filteredEntries.length === 0 ? (
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
                          paginatedEntries.length > 0 && 
                          paginatedEntries.every(e => selectedIds.has(e._id))
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-4 px-6 w-1/4">Attendee</th>
                    <th className="py-4 px-6 w-2/5">Anonymous Question</th>
                    <th className="py-4 px-6 w-1/4">Event Registered</th>
                    <th className="py-4 px-6 w-1/6 text-right">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {paginatedEntries.map((entry) => (
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
        )}
      </main>
    </div>
  );
}
