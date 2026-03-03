import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { submitQuestion } from '../services/api';
import { CheckCircle, Loader2, ChevronDown, PlusCircle } from 'lucide-react';

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Flipkart', 'Infosys', 'Wipro', 'TCS', 'Cognizant', 'Capgemini', 'Adobe', 'Salesforce', 'Uber', 'Airbnb'];
const ROLES = ['Software Engineer (SDE)', 'SDE-2', 'Senior SDE', 'Data Scientist', 'Data Analyst', 'Product Manager', 'DevOps Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Machine Learning Engineer', 'QA Engineer'];
const ROUNDS = ['Resume Screening', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR Round', 'Manager Round', 'Other'];
const QUESTION_TYPES = ['DSA', 'System Design', 'Behavioural', 'Problem Solving', 'Technical Concepts', 'Project Discussion', 'Aptitude', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const YEARS = Array.from({ length: 7 }, (_, i) => 2024 - i);

const FormField = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
    </div>
);

const inputClass = (hasError) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${hasError ? 'border-red-400 bg-red-50' : 'border-slate-200'}`;

const SubmitQuestion = () => {
    const [submitted, setSubmitted] = useState(false);
    const [customCompany, setCustomCompany] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { questionTypes: [] } });

    const selectedTypes = watch('questionTypes') || [];

    const toggleType = (type) => {
        const current = selectedTypes;
        const updated = current.includes(type)
            ? current.filter((t) => t !== type)
            : [...current, type];
        setValue('questionTypes', updated, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            const finalData = {
                ...data,
                company: showCustom ? customCompany : data.company,
                year: parseInt(data.year),
            };
            if (!finalData.company) {
                toast.error('Please enter a company name.');
                return;
            }
            await submitQuestion(finalData);
            setSubmitted(true);
            reset();
            setCustomCompany('');
            setShowCustom(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-28 px-4 fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Submitted Successfully!</h2>
                <p className="text-slate-500 text-center max-w-md mb-8">
                    Thank you for contributing! Your question will appear on the platform after a quick review by our team.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    <PlusCircle size={14} />
                    Contribute
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Submit an Interview Question</h1>
                <p className="text-slate-500">Share your interview experience and help other engineers prepare.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                {/* Row 1: Company + Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Company" required error={errors.company?.message}>
                        {!showCustom ? (
                            <div className="relative">
                                <select
                                    {...register('company', { required: showCustom ? false : 'Company is required' })}
                                    className={inputClass(errors.company) + ' appearance-none'}
                                >
                                    <option value="">Select Company</option>
                                    {COMPANIES.map((c) => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        ) : (
                            <input
                                value={customCompany}
                                onChange={(e) => setCustomCompany(e.target.value)}
                                placeholder="e.g. Zomato, Razorpay..."
                                className={inputClass(false)}
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => { setShowCustom(!showCustom); setCustomCompany(''); }}
                            className="text-xs text-indigo-600 hover:underline self-start"
                        >
                            {showCustom ? '← Select from list' : 'Not in list? Enter manually'}
                        </button>
                    </FormField>

                    <FormField label="Job Role" required error={errors.role?.message}>
                        <div className="relative">
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className={inputClass(errors.role) + ' appearance-none'}
                            >
                                <option value="">Select Role</option>
                                {ROLES.map((r) => <option key={r}>{r}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </FormField>
                </div>

                {/* Row 2: Round + Difficulty + Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <FormField label="Interview Round" required error={errors.round?.message}>
                        <div className="relative">
                            <select
                                {...register('round', { required: 'Round is required' })}
                                className={inputClass(errors.round) + ' appearance-none'}
                            >
                                <option value="">Select Round</option>
                                {ROUNDS.map((r) => <option key={r}>{r}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </FormField>
                    <FormField label="Difficulty" required error={errors.difficulty?.message}>
                        <div className="relative">
                            <select
                                {...register('difficulty', { required: 'Difficulty is required' })}
                                className={inputClass(errors.difficulty) + ' appearance-none'}
                            >
                                <option value="">Select Difficulty</option>
                                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </FormField>
                    <FormField label="Year" required error={errors.year?.message}>
                        <div className="relative">
                            <select
                                {...register('year', { required: 'Year is required' })}
                                className={inputClass(errors.year) + ' appearance-none'}
                            >
                                <option value="">Year</option>
                                {YEARS.map((y) => <option key={y}>{y}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </FormField>
                </div>

                {/* Question Type Multi-select chips */}
                <FormField label="Question Type" required error={selectedTypes.length === 0 && errors.questionTypes ? 'Select at least one type' : ''}>
                    <Controller
                        name="questionTypes"
                        control={control}
                        rules={{ validate: (v) => v.length > 0 || 'Select at least one type' }}
                        render={() => (
                            <div className="flex flex-wrap gap-2">
                                {QUESTION_TYPES.map((type) => {
                                    const selected = selectedTypes.includes(type);
                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleType(type)}
                                            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${selected
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    />
                </FormField>

                {/* Question */}
                <FormField label="Question Description" required error={errors.question?.message}>
                    <textarea
                        {...register('question', { required: 'Question text is required', minLength: { value: 10, message: 'Question must be at least 10 characters' } })}
                        rows={5}
                        placeholder="Describe the interview question in detail..."
                        className={inputClass(errors.question) + ' resize-none'}
                    />
                </FormField>

                {/* Answer */}
                <FormField label="What You Answered (Optional)">
                    <textarea
                        {...register('answer')}
                        rows={4}
                        placeholder="Share your approach or answer (optional but very helpful)..."
                        className={inputClass(false) + ' resize-none'}
                    />
                </FormField>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <PlusCircle size={18} />
                            Submit Question
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-slate-500">
                    Your submission will be reviewed before going live.
                </p>
            </form>
        </div>
    );
};

export default SubmitQuestion;
