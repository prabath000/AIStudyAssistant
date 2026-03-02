import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { aiService, noteService } from '../services/api';
import {
    FileText,
    MessageSquare,
    Zap,
    BookOpen,
    ArrowLeft,
    Send,
    Bot,
    User,
    CheckCircle2,
    XCircle,
    Info,
    Sparkles,
    Loader2
} from 'lucide-react';

const DocumentDetails = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const activeTab = searchParams.get('tab') || 'chat';

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Chat State
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Summary State
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);

    // Quiz State
    const [quiz, setQuiz] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const data = await noteService.getNotes();
                const foundNote = data.find(n => n._id === id);
                if (foundNote) {
                    setNote(foundNote);
                } else {
                    setError('Document not found');
                }
            } catch (err) {
                setError('Failed to load document');
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || chatLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setChatLoading(true);

        try {
            const history = messages.map(({ role, content }) => ({ role, content }));
            const data = await aiService.chat(history, input, id);
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    const generateSummary = async () => {
        setSummaryLoading(true);
        try {
            const data = await aiService.summarize(id);
            setSummary(data.content);
        } catch (err) {
            console.error('Summary error:', err);
        } finally {
            setSummaryLoading(false);
        }
    };

    const generateQuiz = async () => {
        setQuizLoading(true);
        setQuiz(null);
        setShowResults(false);
        setQuizAnswers({});
        try {
            const data = await aiService.generateQuiz(id);
            setQuiz(data.content);
        } catch (err) {
            console.error('Quiz error:', err);
        } finally {
            setQuizLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setQuizAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
    );

    if (error) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{error}</h2>
            <button onClick={() => navigate('/dashboard')} className="text-primary-600 font-bold flex items-center gap-2 mx-auto">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <header className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="flex flex-col gap-2 relative">
                    <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight truncate max-w-md">{note?.title}</h1>
                            <p className="text-slate-400 text-sm font-medium">{note?.fileName || 'Uploaded PDF'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 relative">
                    {['chat', 'summary', 'quiz'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSearchParams({ tab })}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PDF Highlights / Info (Sidebar) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group h-fit">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles size={100} />
                        </div>
                        <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                            <Info size={20} className="text-primary-400" />
                            Document Info
                        </h3>
                        <div className="space-y-4 relative">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Status</p>
                                <p className="font-bold flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    AI Indexed & Ready
                                </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Category</p>
                                <p className="font-bold capitalize">{note?.category || 'General Study'}</p>
                            </div>
                        </div>
                    </div>

                    {/* PDF Preview Placeholders or Actual Hub Links */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Study Shortcuts</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <MessageSquare size={16} className="text-purple-600" />
                                <span className="text-sm font-medium text-slate-700 uppercase tracking-tight">Focus: Key Concepts</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Zap size={16} className="text-amber-600" />
                                <span className="text-sm font-medium text-slate-700 uppercase tracking-tight">Exam Prep: Quiz Mode</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="lg:col-span-2">
                    {activeTab === 'chat' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col min-h-[600px] overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
                                <Bot size={20} className="text-primary-600" />
                                <h3 className="font-bold text-slate-900">AI Chat Tutor</h3>
                                <div className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    RAG Active
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[500px]">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                                        <Bot size={64} className="text-slate-300" />
                                        <p className="text-slate-500 font-medium max-w-xs">Ask me anything about <span className="font-bold text-slate-700">"{note?.title}"</span>. I only answer from the document!</p>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
                                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                                    : 'bg-slate-50 text-slate-900 border border-slate-100 rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-6 bg-slate-50/50 border-t border-slate-100">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type your question about the PDF..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-2xl pl-6 pr-14 py-4 focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm font-medium"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || chatLoading}
                                        className="absolute right-2 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-200 disabled:bg-slate-300 disabled:shadow-none"
                                    >
                                        {chatLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'summary' && (
                        <div className="space-y-6">
                            {!summary && !summaryLoading && (
                                <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-6 animate-fade-in">
                                    <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
                                        <BookOpen size={40} />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900">Generate Summary</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                                        Get a breakdown of the short summary, key points, and important concepts from your PDF.
                                    </p>
                                    <button
                                        onClick={generateSummary}
                                        className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center gap-3 mx-auto active:scale-95"
                                    >
                                        <Sparkles size={20} />
                                        Summarize Now
                                    </button>
                                </div>
                            )}

                            {summaryLoading && (
                                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center space-y-6">
                                    <Loader2 className="animate-spin text-primary-600 mx-auto" size={48} />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Document...</h3>
                                        <p className="text-slate-500">Our AI is reading your PDF to distill the most important info.</p>
                                    </div>
                                </div>
                            )}

                            {summary && (
                                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl animate-slide-up">
                                    <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-3 rounded-xl">
                                                <BookOpen size={24} className="text-blue-600" />
                                            </div>
                                            <h2 className="text-2xl font-display font-bold text-slate-900">AI Summary</h2>
                                        </div>
                                        <button onClick={generateSummary} className="text-primary-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                                            <Sparkles size={14} /> Regenerate
                                        </button>
                                    </div>

                                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                                        {summary}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className="space-y-6">
                            {!quiz && !quizLoading && (
                                <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-6 animate-fade-in">
                                    <div className="bg-amber-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-amber-600">
                                        <Zap size={40} />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900">AI Test Prep</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                                        Generate a custom quiz from your document content. Includes MCQs, T/F, and Short answers.
                                    </p>
                                    <button
                                        onClick={generateQuiz}
                                        className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl shadow-amber-200 flex items-center gap-3 mx-auto active:scale-95"
                                    >
                                        <Sparkles size={20} />
                                        Generate Quiz
                                    </button>
                                </div>
                            )}

                            {quizLoading && (
                                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center space-y-6">
                                    <Loader2 className="animate-spin text-amber-500 mx-auto" size={48} />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Curating Questions...</h3>
                                        <p className="text-slate-500">Creating a personalized test based on your document's key concepts.</p>
                                    </div>
                                </div>
                            )}

                            {quiz && (
                                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl animate-slide-up overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>

                                    <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                                                <Zap size={24} className="text-amber-600" />
                                            </div>
                                            <h2 className="text-2xl font-display font-bold text-slate-900">Mock Exam</h2>
                                        </div>
                                        {showResults && (
                                            <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold border border-primary-100">
                                                Quiz Completed
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-12 relative">
                                        {quiz.questions.map((q, idx) => (
                                            <div key={idx} className="space-y-5 group">
                                                <div className="flex items-start gap-4">
                                                    <span className="bg-slate-900 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900 leading-snug">{q.question}</p>
                                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-2 block italic">{q.type.replace('_', ' ')}</span>
                                                    </div>
                                                </div>

                                                {q.type === 'mcq' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                                        {q.options.map((opt, oIdx) => (
                                                            <button
                                                                key={oIdx}
                                                                disabled={showResults}
                                                                onClick={() => handleAnswerChange(idx, opt)}
                                                                className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all flex items-center gap-3 ${quizAnswers[idx] === opt
                                                                        ? 'bg-primary-600 border-primary-600 text-white shadow-lg'
                                                                        : 'bg-white border-slate-100 text-slate-600 hover:border-primary-200'
                                                                    } ${showResults && opt === q.answer && 'border-emerald-500 bg-emerald-50 text-emerald-800'} ${showResults && quizAnswers[idx] === opt && opt !== q.answer && 'border-rose-500 bg-rose-50 text-rose-800'}`}
                                                            >
                                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${quizAnswers[idx] === opt ? 'bg-white/20' : 'bg-slate-50 transition-colors group-hover:bg-primary-50'}`}>
                                                                    {String.fromCharCode(65 + oIdx)}
                                                                </div>
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {(q.type === 'true_false') && (
                                                    <div className="flex gap-4 pl-12">
                                                        {['True', 'False'].map((opt) => (
                                                            <button
                                                                key={opt}
                                                                disabled={showResults}
                                                                onClick={() => handleAnswerChange(idx, opt)}
                                                                className={`px-8 py-4 rounded-2xl text-sm font-bold border-2 transition-all ${quizAnswers[idx] === opt
                                                                        ? 'bg-primary-600 border-primary-600 text-white'
                                                                        : 'bg-white border-slate-100 text-slate-600'
                                                                    } ${showResults && opt === q.answer && 'border-emerald-500 bg-emerald-50 text-emerald-800'}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {q.type === 'short_answer' && (
                                                    <div className="pl-12 space-y-3">
                                                        <input
                                                            type="text"
                                                            disabled={showResults}
                                                            placeholder="Your answer here..."
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                                            value={quizAnswers[idx] || ''}
                                                            onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                                        />
                                                        {showResults && (
                                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700 flex items-start gap-2">
                                                                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="uppercase tracking-widest mb-1 opacity-60">Correct Answer:</p>
                                                                    <p className="text-sm">{q.answer}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {!showResults ? (
                                        <div className="mt-16 pt-10 border-t border-slate-100 flex justify-center sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                                            <button
                                                onClick={() => setShowResults(true)}
                                                className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3"
                                            >
                                                Submit & View Results
                                                <Zap size={16} className="text-amber-400" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-16 pt-10 border-t border-slate-100 flex justify-center">
                                            <button
                                                onClick={generateQuiz}
                                                className="text-primary-600 font-black text-xs uppercase tracking-[0.2em] hover:underline flex items-center gap-2"
                                            >
                                                <Sparkles size={16} /> New Assessment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentDetails;
