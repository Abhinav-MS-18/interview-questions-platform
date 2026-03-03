import { useState } from 'react';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Flipkart', 'Infosys', 'Wipro', 'TCS', 'Cognizant', 'Capgemini', 'Adobe', 'Salesforce', 'Uber', 'Airbnb', 'Other'];
const ROLES = ['Software Engineer (SDE)', 'SDE-2', 'Senior SDE', 'Data Scientist', 'Data Analyst', 'Product Manager', 'DevOps Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Machine Learning Engineer', 'QA Engineer', 'Other'];
const ROUNDS = ['Resume Screening', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR Round', 'Manager Round', 'Other'];
const QUESTION_TYPES = ['DSA', 'System Design', 'Behavioural', 'Problem Solving', 'Technical Concepts', 'Project Discussion', 'Aptitude', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const YEARS = Array.from({ length: 7 }, (_, i) => 2024 - i);

const FilterPanel = ({ filters, onChange, onClear }) => {
    const Select = ({ label, fieldName, options, placeholder }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
            <div className="relative">
                <select
                    value={filters[fieldName] || ''}
                    onChange={(e) => onChange({ ...filters, [fieldName]: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
                >
                    <option value="">{placeholder}</option>
                    {options.map((o) => (
                        <option key={o} value={typeof o === 'number' ? o : o}>{typeof o === 'number' ? o : o}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
        </div>
    );

    const handleKeyword = (e) => onChange({ ...filters, keyword: e.target.value });

    const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== undefined);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-indigo-400" />
                    <h3 className="font-semibold text-slate-800 text-sm">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                        <X size={13} />
                        Clear All
                    </button>
                )}
            </div>

            {/* Keyword Search */}
            <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search by keyword..."
                    value={filters.keyword || ''}
                    onChange={handleKeyword}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:bg-white"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Select label="Company" fieldName="company" options={COMPANIES} placeholder="All Companies" />
                <Select label="Role" fieldName="role" options={ROLES} placeholder="All Roles" />
                <Select label="Round" fieldName="round" options={ROUNDS} placeholder="All Rounds" />
                <Select label="Difficulty" fieldName="difficulty" options={DIFFICULTIES} placeholder="All Levels" />
                <Select label="Year" fieldName="year" options={YEARS} placeholder="All Years" />
                {/* Question Type Multi-select via single select for simplicity */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</label>
                    <div className="relative">
                        <select
                            value={filters.questionType || ''}
                            onChange={(e) => onChange({ ...filters, questionType: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
                        >
                            <option value="">All Types</option>
                            {QUESTION_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
