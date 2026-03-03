import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getPending,
    approveQuestion,
    rejectQuestion,
    deleteQuestion,
    editQuestion,
    getAnalytics,
} from '../services/api';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import {
    CheckCircle,
    XCircle,
    Trash2,
    Pencil,
    Shield,
    LogOut,
    LayoutDashboard,
    ClipboardList,
    BarChart2,
    Loader2,
    BookOpen,
    Users,
    AlignLeft,
    Building2,
    AlertTriangle,
    Save,
    X,
} from 'lucide-react';

// ── Edit Modal ──────────────────────────────────────────────────────────────
const EditModal = ({ question: q, onClose, onSave }) => {
    const [form, setForm] = useState({
        company: q.company,
        role: q.role,
        round: q.round,
        difficulty: q.difficulty,
        year: q.year,
        question: q.question,
        answer: q.answer || '',
        status: q.status,
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await editQuestion(q._id, form);
            toast.success('Question updated successfully.');
            onSave();
        } catch {
            toast.error('Failed to update.');
        } finally {
            setSaving(false);
        }
    };

    const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400';

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800 text-lg">Edit Question</h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Company</label>
                            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Role</label>
                            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Round</label>
                            <input value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Difficulty</label>
                            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className={inputCls}>
                                {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Year</label>
                            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                                {['pending', 'approved', 'rejected'].map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Question</label>
                        <textarea rows={4} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls + ' resize-none'} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Answer</label>
                        <textarea rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={inputCls + ' resize-none'} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Pending Card ────────────────────────────────────────────────────────────
const PendingCard = ({ q, onAction, duplicates }) => {
    const [processing, setProcessing] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const isDuplicate = duplicates.has(q._id);

    const handle = async (action, fn) => {
        setProcessing(action);
        try {
            await fn();
            onAction();
        } catch {
            toast.error('Action failed.');
        } finally {
            setProcessing('');
        }
    };

    return (
        <>
            {editOpen && (
                <EditModal
                    question={q}
                    onClose={() => setEditOpen(false)}
                    onSave={() => { setEditOpen(false); onAction(); }}
                />
            )}
            <div className={`bg-white rounded-2xl border p-5 shadow-sm fade-in ${isDuplicate ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>
                {isDuplicate && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mb-3">
                        <AlertTriangle size={13} />
                        Possible Duplicate Detected
                    </div>
                )}
                <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Building2 size={11} /> {q.company}
                    </span>
                    <span className="text-xs text-slate-500">{q.role}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-500">{q.round}</span>
                    <span className="ml-auto"><Badge difficulty={q.difficulty} /></span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-3">{q.question}</p>
                {q.answer && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 mb-4 line-clamp-2 italic">
                        Answer: {q.answer}
                    </p>
                )}
                <div className="flex flex-wrap gap-2">
                    <button
                        disabled={!!processing}
                        onClick={() => handle('approve', () => approveQuestion(q._id))}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60 transition-colors"
                    >
                        {processing === 'approve' ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                        Approve
                    </button>
                    <button
                        disabled={!!processing}
                        onClick={() => handle('reject', () => rejectQuestion(q._id))}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg disabled:opacity-60 transition-colors"
                    >
                        {processing === 'reject' ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                        Reject
                    </button>
                    <button
                        onClick={() => setEditOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                        <Pencil size={13} />
                        Edit
                    </button>
                    <button
                        disabled={!!processing}
                        onClick={() => {
                            if (window.confirm('Delete this question permanently?')) {
                                handle('delete', () => deleteQuestion(q._id));
                            }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg disabled:opacity-60 transition-colors ml-auto"
                    >
                        {processing === 'delete' ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        Delete
                    </button>
                </div>
            </div>
        </>
    );
};

// ── Main AdminDashboard ──────────────────────────────────────────────────────
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b'];

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('moderation');
    const [pending, setPending] = useState([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // Detect duplicates by similar question text
    const getDuplicateIds = (questions) => {
        const map = {};
        questions.forEach((q) => {
            const key = q.question.trim().substring(0, 60).toLowerCase();
            if (!map[key]) map[key] = [];
            map[key].push(q._id);
        });
        const dupIds = new Set();
        Object.values(map).forEach((ids) => {
            if (ids.length > 1) ids.forEach((id) => dupIds.add(id));
        });
        return dupIds;
    };

    const loadPending = useCallback(async () => {
        setPendingLoading(true);
        try {
            const { data } = await getPending();
            setPending(data.questions);
        } catch {
            toast.error('Failed to load pending questions.');
        } finally {
            setPendingLoading(false);
        }
    }, []);

    const loadAnalytics = useCallback(async () => {
        setAnalyticsLoading(true);
        try {
            const { data } = await getAnalytics();
            setAnalytics(data);
        } catch {
            toast.error('Failed to load analytics.');
        } finally {
            setAnalyticsLoading(false);
        }
    }, []);

    useEffect(() => { loadPending(); }, [loadPending]);
    useEffect(() => {
        if (tab === 'analytics') loadAnalytics();
    }, [tab, loadAnalytics]);

    const duplicateIds = getDuplicateIds(pending);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Admin Topbar */}
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Shield size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-slate-800 text-sm">Admin Dashboard</span>
                        <span className="hidden sm:inline text-slate-500 text-xs ml-2">InterviewHub</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                        <BookOpen size={13} />
                        View Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={15} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
                    {[
                        { id: 'moderation', label: 'Moderation', icon: <ClipboardList size={15} /> },
                        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                        >
                            {t.icon}
                            {t.label}
                            {t.id === 'moderation' && pending.length > 0 && (
                                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${tab === 'moderation' ? 'bg-white/20' : 'bg-red-100 text-red-600'}`}>
                                    {pending.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── MODERATION TAB ─────────────────────────────────────────────────── */}
                {tab === 'moderation' && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Pending Review</h2>
                                <p className="text-slate-500 text-sm">
                                    {pending.length} question{pending.length !== 1 ? 's' : ''} awaiting review
                                </p>
                            </div>
                            <button
                                onClick={loadPending}
                                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-200 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>

                        {pendingLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={32} className="animate-spin text-indigo-600" />
                            </div>
                        ) : pending.length === 0 ? (
                            <div className="flex flex-col items-center py-24 text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                    <CheckCircle size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">All caught up!</h3>
                                <p className="text-slate-500 text-sm">No pending questions to review.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pending.map((q) => (
                                    <PendingCard key={q._id} q={q} onAction={loadPending} duplicates={duplicateIds} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── ANALYTICS TAB ──────────────────────────────────────────────────── */}
                {tab === 'analytics' && (
                    <div>
                        {analyticsLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={32} className="animate-spin text-indigo-600" />
                            </div>
                        ) : analytics ? (
                            <div className="space-y-8 fade-in">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard icon={<AlignLeft size={18} />} label="Total Submissions" value={analytics.total} color="indigo" />
                                    <StatCard icon={<CheckCircle size={18} />} label="Approved" value={analytics.approved} color="emerald" />
                                    <StatCard icon={<XCircle size={18} />} label="Rejected" value={analytics.rejected} color="red" />
                                    <StatCard icon={<Loader2 size={18} />} label="Pending" value={analytics.pending} color="amber" />
                                </div>

                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Top Companies */}
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-5">
                                            <Building2 size={16} className="text-indigo-600" />
                                            <h3 className="font-bold text-slate-800">Top Companies</h3>
                                        </div>
                                        {analytics.topCompanies.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={220}>
                                                <BarChart data={analytics.topCompanies.slice(0, 8).map((c) => ({ name: c._id, count: c.count }))}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                                    />
                                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                                        {analytics.topCompanies.slice(0, 8).map((_, i) => (
                                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p className="text-slate-500 text-sm text-center py-10">No data yet.</p>
                                        )}
                                    </div>

                                    {/* Question Type Breakdown */}
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-5">
                                            <LayoutDashboard size={16} className="text-indigo-600" />
                                            <h3 className="font-bold text-slate-800">Question Types</h3>
                                        </div>
                                        {analytics.typeBreakdown.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={220}>
                                                <BarChart data={analytics.typeBreakdown.map((t) => ({ name: t._id, count: t.count }))}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                                    />
                                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                                        {analytics.typeBreakdown.map((_, i) => (
                                                            <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p className="text-slate-500 text-sm text-center py-10">No data yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Difficulty Breakdown */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-5">Difficulty Breakdown</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Easy', 'Medium', 'Hard'].map((d) => {
                                            const found = analytics.difficultyBreakdown.find((x) => x._id === d);
                                            const count = found?.count || 0;
                                            const total = analytics.approved || 1;
                                            const pct = Math.round((count / total) * 100);
                                            const colors = { Easy: 'bg-emerald-500', Medium: 'bg-amber-500', Hard: 'bg-red-500' };
                                            return (
                                                <div key={d} className="text-center">
                                                    <p className="text-sm font-semibold text-slate-600 mb-2">{d}</p>
                                                    <div className="relative w-16 h-16 mx-auto mb-2">
                                                        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                                            <circle
                                                                cx="18" cy="18" r="15.9155" fill="none"
                                                                stroke={d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444'}
                                                                strokeWidth="3"
                                                                strokeDasharray={`${pct} ${100 - pct}`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
                                                            {pct}%
                                                        </div>
                                                    </div>
                                                    <p className="text-2xl font-black text-slate-800">{count}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-20">Failed to load analytics.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
