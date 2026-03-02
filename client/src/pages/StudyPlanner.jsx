import { useState } from 'react';
import { aiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    Calendar,
    ChevronRight,
    BookOpen,
    Clock,
    CheckCircle2,
    Plus,
    X,
    Loader2,
    Sparkles,
    Target
} from 'lucide-react';

const StudyPlanner = () => {
    const { t } = useLanguage();
    const [examDate, setExamDate] = useState('');
    const [subjects, setSubjects] = useState('');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);

    const handleGenerate = async () => {
        if (!examDate || !subjects) return;
        setLoading(true);
        try {
            const data = await aiService.generateStudyPlanTopic(examDate, subjects);
            setPlan(data.plan || []);
        } catch (error) {
            console.error('Error generating study plan:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-sm">
                    <Calendar size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase">Study Planner</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('plannerDesc') || 'AI-Powered Study Timetable Generator'}</p>
                </div>
            </div>

            {!plan ? (
                <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-10 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none transition-all font-bold text-slate-900"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                                Subjects List
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Science, Mathematics, ICT..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none transition-all font-medium text-slate-900"
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100/50 flex items-start gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Target size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-sm font-medium text-emerald-700 leading-relaxed">
                                Lanka AI will analyze your subjects and time remaining to generate a prioritized study plan that ensures maximum retention before your exam.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !examDate || !subjects}
                        className="w-full bg-slate-900 text-white rounded-2xl py-6 font-black uppercase tracking-[0.25em] text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {loading ? 'Creating Your Strategy...' : 'Generate Study Strategy'}
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight uppercase">Strategy Generated</h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Personalized for exam on {new Date(examDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPlan(null)}
                            className="bg-slate-50 text-slate-400 hover:text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Reset Plan
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {plan.map((week, index) => (
                            <div key={index} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-emerald-200 transition-all duration-500">
                                <div className="bg-slate-50 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:bg-emerald-50/50 transition-all">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">{week.week}</span>
                                        <h3 className="text-xl font-display font-black text-slate-800 tracking-tight">{week.focus}</h3>
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{week.tasks.length} Daily Tasks</span>
                                    </div>
                                </div>
                                <div className="p-8 space-y-4">
                                    {week.tasks.map((task, tidx) => (
                                        <div key={tidx} className="flex items-center gap-4 group/task">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover/task:bg-emerald-50 group-hover/task:text-emerald-500 transition-all border border-slate-100/50">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 group-hover/task:text-slate-900 transition-colors">{task}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-12 text-center text-white space-y-6 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                            <Target size={180} />
                        </div>
                        <h2 className="text-3xl font-display font-black tracking-tight leading-tight max-w-lg mx-auto uppercase">Ready to Execute Your Plan?</h2>
                        <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto">This plan is designed to optimize your focus and prevent burnout. Good luck with your studies!</p>
                        <button
                            onClick={() => window.print()}
                            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-xl"
                        >
                            Print Study Strategy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyPlanner;
