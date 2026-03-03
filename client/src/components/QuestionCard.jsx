import { useState } from 'react';
import { Building2, Briefcase, ChevronDown, ChevronUp, Calendar, Eye, EyeOff, Tag } from 'lucide-react';
import Badge from './Badge';

const roundColors = {
    'Technical Round 1': 'bg-blue-50 text-blue-700',
    'Technical Round 2': 'bg-blue-50 text-blue-700',
    'System Design': 'bg-purple-50 text-purple-700',
    'HR Round': 'bg-pink-50 text-pink-700',
    'Online Assessment': 'bg-amber-50 text-amber-700',
    'Manager Round': 'bg-slate-100 text-slate-700',
    'Resume Screening': 'bg-slate-100 text-slate-700',
    'Other': 'bg-slate-100 text-slate-700',
};

const typeColors = [
    'bg-indigo-50 text-indigo-700',
    'bg-cyan-50 text-cyan-700',
    'bg-violet-50 text-violet-700',
    'bg-teal-50 text-teal-700',
];

const QuestionCard = ({ question: q }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const roundClass = roundColors[q.round] || 'bg-slate-100 text-slate-700';

    return (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 card-hover shadow-sm fade-in flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-2.5 py-1 rounded-lg">
                            <Building2 size={11} />
                            {q.company}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${roundClass}`}>
                            {q.round}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Briefcase size={11} />
                            {q.role}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Calendar size={11} />
                            {q.year}
                        </span>
                    </div>
                </div>
                <Badge difficulty={q.difficulty} />
            </div>

            {/* Question */}
            <p className="text-slate-800 font-medium text-sm leading-relaxed line-clamp-4">
                {q.question}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
                {q.questionTypes?.map((type, i) => (
                    <span
                        key={type}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${typeColors[i % typeColors.length]}`}
                    >
                        <Tag size={10} />
                        {type}
                    </span>
                ))}
            </div>

            {/* Answer Toggle */}
            {q.answer && (
                <div className="border-t border-slate-100 pt-3">
                    <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        {showAnswer ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showAnswer ? 'Hide Answer' : 'View Answer'}
                    </button>
                    {showAnswer && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed fade-in">
                            {q.answer}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
