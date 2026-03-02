import { useState } from 'react';
import { aiService } from '../services/api';
import { Zap, Sparkles, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';

const QuizGenerator = () => {
    const [formData, setFormData] = useState({ subject: '', topic: '', count: 5 });
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.topic || loading) return;

        setLoading(true);
        setQuiz(null);
        setSubmitted(false);
        setAnswers({});
        try {
            const data = await aiService.generateQuizTopic(formData.subject, formData.topic, formData.count);
            setQuiz(data.questions);
        } catch (err) {
            console.error('Error generating quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIdx, option) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: option }));
    };

    const handleSubmit = () => {
        let totalScore = 0;
        quiz.forEach((q, idx) => {
            if (answers[idx] === q.answer) totalScore++;
        });
        setScore(totalScore);
        setSubmitted(true);
    };

    const restart = () => {
        setSubmitted(false);
        setAnswers({});
        setScore(0);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-3">
                        <Zap size={14} className="fill-amber-600" />
                        <span>Knowledge Check</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 leading-tight">
                        AI Quiz Generator
                    </h1>
                    <p className="text-slate-500 mt-2">Test your knowledge with custom MCQs.</p>
                </div>
            </header>

            {!quiz && (
                <div className="max-w-3xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 'Science'"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 ring-amber-500/10 focus:bg-white focus:border-amber-500 outline-none transition-all font-medium"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Topic</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 'Human Heart'"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 ring-amber-500/10 focus:bg-white focus:border-amber-500 outline-none transition-all font-medium"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Number of Questions</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 ring-amber-500/10 focus:bg-white focus:border-amber-500 outline-none transition-all font-medium appearance-none"
                                value={formData.count}
                                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                            >
                                <option value="3">3 Questions</option>
                                <option value="5">5 Questions</option>
                                <option value="10">10 Questions</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300"
                        >
                            {loading ? (
                                <RefreshCw size={24} className="animate-spin" />
                            ) : (
                                <Sparkles size={24} className="text-amber-400" />
                            )}
                            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
                        </button>
                    </form>
                </div>
            )}

            {quiz && (
                <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
                    {submitted && (
                        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-8 rounded-[2rem] text-white flex items-center justify-between shadow-2xl shadow-primary-200 animate-fade-in">
                            <div>
                                <h3 className="text-3xl font-display font-bold mb-1">Quiz Completed!</h3>
                                <p className="text-primary-100 font-medium">Great effort on the {formData.topic} quiz.</p>
                            </div>
                            <div className="text-center bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30">
                                <Trophy size={32} className="mx-auto mb-2 text-amber-300" />
                                <div className="text-4xl font-extrabold">{score}/{quiz.length}</div>
                                <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">Final Score</div>
                            </div>
                        </div>
                    )}

                    {quiz.map((q, idx) => (
                        <div key={idx} className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all ${submitted ? '' : 'hover:shadow-md'}`}>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm flex-shrink-0">
                                    {idx + 1}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 leading-tight pt-1">{q.question}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((option, oIdx) => {
                                    const isSelected = answers[idx] === option;
                                    const isCorrect = option === q.answer;
                                    let variant = "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100";

                                    if (submitted) {
                                        if (isCorrect) variant = "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold ring-2 ring-emerald-500";
                                        else if (isSelected) variant = "bg-red-50 border-red-200 text-red-700 font-bold ring-2 ring-red-500 opacity-60";
                                        else variant = "bg-slate-50 border-slate-50 text-slate-400 opacity-40";
                                    } else if (isSelected) {
                                        variant = "bg-primary-50 border-primary-200 text-primary-700 font-bold ring-2 ring-primary-500";
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleOptionSelect(idx, option)}
                                            disabled={submitted}
                                            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${variant}`}
                                        >
                                            <span className="flex-1">{option}</span>
                                            {submitted && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                                            {submitted && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-center gap-4 mt-12 pb-12">
                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length < quiz.length}
                                className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400"
                            >
                                Finish and Grade
                            </button>
                        ) : (
                            <button
                                onClick={() => setQuiz(null)}
                                className="bg-white border border-slate-200 text-slate-700 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-md active:scale-[0.98] flex items-center gap-3"
                            >
                                <RefreshCw size={20} />
                                Start New Quiz
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;
