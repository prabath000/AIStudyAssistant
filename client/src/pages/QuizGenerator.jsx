import { useState } from 'react';
import { aiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    Zap,
    ChevronRight,
    CheckCircle2,
    XCircle,
    RefreshCw,
    HelpCircle,
    Loader2,
    BookOpen,
    Target,
    Sparkles
} from 'lucide-react';

const QuizGenerator = () => {
    const { t } = useLanguage();
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState('setup'); // setup, quiz, results
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const data = await aiService.generateQuizTopic(subject, topic, count);
            setQuestions(data.questions || []);
            setCurrentStep('quiz');
        } catch (error) {
            console.error('Error generating quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setAnswers({ ...answers, [questionIndex]: optionIndex });
    };

    const handleSubmitQuiz = () => {
        let finalScore = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                finalScore++;
            }
        });
        setScore(finalScore);
        setCurrentStep('results');
    };

    const resetQuiz = () => {
        setSubject('');
        setTopic('');
        setQuestions([]);
        setAnswers({});
        setCurrentStep('setup');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 shadow-sm">
                    <Zap size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight uppercase">Quiz Generator</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('assessmentDesc') || 'Test your knowledge with AI-powered assessment'}</p>
                </div>
            </div>

            {currentStep === 'setup' && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                            <input
                                type="text"
                                placeholder="e.g. Science, Mathematics..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none transition-all font-medium text-slate-900"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Number of Questions</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none transition-all font-medium text-slate-900 appearance-none"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                            >
                                <option value={3}>3 Questions (Quick)</option>
                                <option value={5}>5 Questions (Standard)</option>
                                <option value={10}>10 Questions (Deep)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Topic</label>
                        <textarea
                            rows="3"
                            placeholder="What do you want to be tested on? (e.g. Quantum Physics basics, Organic Chemistry...)"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none transition-all font-medium text-slate-900 resize-none"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {loading ? 'Generating Your Quiz...' : 'Generate New Quiz'}
                    </button>
                </div>
            )}

            {currentStep === 'quiz' && (
                <div className="space-y-6 animate-fade-in">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                            <div className="flex gap-4">
                                <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {index + 1}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 leading-snug">{q.question}</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3 ml-12">
                                {q.options.map((option, optIdx) => (
                                    <button
                                        key={optIdx}
                                        onClick={() => handleAnswerSelect(index, optIdx)}
                                        className={`p-4 rounded-xl border text-left transition-all font-medium text-sm flex items-center justify-between group ${answers[index] === optIdx
                                            ? 'bg-primary-50 border-primary-200 text-primary-900 shadow-sm'
                                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-white'
                                            }`}
                                    >
                                        <span>{option}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[index] === optIdx
                                            ? 'bg-primary-500 border-primary-500'
                                            : 'border-slate-200'
                                            }`}>
                                            {answers[index] === optIdx && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end p-4">
                        <button
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(answers).length < questions.length}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                        >
                            Submit and View Results
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 'results' && (
                <div className="space-y-8 animate-slide-up">
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="w-48 h-48 rounded-full border-8 border-slate-50 flex flex-col items-center justify-center bg-white shadow-inner">
                                <span className="text-5xl font-display font-black text-slate-900">{score}</span>
                                <span className="text-slate-400 font-bold text-sm">of {questions.length}</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-4 rounded-2xl shadow-lg animate-bounce">
                                <Target size={24} />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-display font-black text-slate-900 mb-2">
                                {score === questions.length ? 'Perfect Score!' : score > questions.length / 2 ? 'Great Effort!' : 'Keep Learning!'}
                            </h2>
                            <p className="text-slate-400 font-medium">You completed the {subject} quiz on "{topic}"</p>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={resetQuiz}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                            >
                                <RefreshCw size={16} /> New Quiz
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 mb-4">Review Your Answers</h3>
                        {questions.map((q, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${answers[index] === q.correctAnswer ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {answers[index] === q.correctAnswer ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800 text-sm">{q.question}</p>
                                    <p className="text-xs font-bold text-emerald-600">Correct: {q.options[q.correctAnswer]}</p>
                                    {answers[index] !== q.correctAnswer && (
                                        <p className="text-xs font-bold text-rose-400 line-through">Your Answer: {q.options[answers[index]]}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;
