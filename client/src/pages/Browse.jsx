import { useEffect, useState, useCallback } from 'react';
import { getQuestions } from '../services/api';
import FilterPanel from '../components/FilterPanel';
import QuestionCard from '../components/QuestionCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { SearchX, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const EMPTY_FILTERS = {
    company: '',
    role: '',
    round: '',
    difficulty: '',
    year: '',
    questionType: '',
    keyword: '',
};

const Browse = () => {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 9;

    const fetchQuestions = useCallback(async (currentFilters, currentPage) => {
        setLoading(true);
        try {
            const params = { page: currentPage, limit: LIMIT };
            Object.entries(currentFilters).forEach(([k, v]) => {
                if (v) params[k] = v;
            });
            const { data } = await getQuestions(params);
            setQuestions(data.questions);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch {
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load + when appliedFilters / page changes
    useEffect(() => {
        fetchQuestions(appliedFilters, page);
    }, [appliedFilters, page, fetchQuestions]);

    const handleSearch = () => {
        setPage(1);
        setAppliedFilters({ ...filters });
    };

    const handleClear = () => {
        setFilters(EMPTY_FILTERS);
        setAppliedFilters(EMPTY_FILTERS);
        setPage(1);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 mb-1">Browse Questions</h1>
                <p className="text-slate-500">Explore real interview questions from top companies, filtered just for you.</p>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <FilterPanel filters={filters} onChange={handleFilterChange} onClear={handleClear} />
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleSearch}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm hover:-translate-y-0.5 transition-all"
                    >
                        <Search size={15} />
                        Search
                    </button>
                </div>
            </div>

            {/* Results count */}
            {!loading && (
                <div className="mb-5 text-sm text-slate-500">
                    {total > 0 ? (
                        <span>Showing <strong className="text-slate-700">{questions.length}</strong> of <strong className="text-slate-700">{total}</strong> questions</span>
                    ) : null}
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <LoadingSkeleton count={9} />
            ) : questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center fade-in">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
                        <SearchX size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No questions found</h3>
                    <p className="text-slate-500 mb-5 max-w-sm">Try adjusting your filters or clear them to see all questions.</p>
                    <button
                        onClick={handleClear}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {questions.map((q) => (
                            <QuestionCard key={q._id} question={q} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-10">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${page === pageNum
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {totalPages > 5 && <span className="text-slate-500 text-sm">... of {totalPages}</span>}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Browse;
