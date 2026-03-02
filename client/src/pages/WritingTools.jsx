import { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/api';
import {
    Search,
    User,
    CheckCircle,
    Zap,
    Copy,
    Check,
    AlertCircle,
    Eraser,
    Sparkles,
    ShieldCheck,
    Languages,
    Wand2,
    MessageSquare,
    Send,
    Bot,
    XCircle
} from 'lucide-react';

const WritingTools = () => {
    const [activeTask, setActiveTask] = useState('grammar');
    const [content, setContent] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [coachMessages, setCoachMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    const tools = [
        {
            id: 'grammar',
            name: 'Grammar Checker',
            description: 'Fix spelling, grammar, and punctuation mistakes instantly.',
            icon: CheckCircle,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            borderColor: 'border-primary-100',
            btnBg: 'bg-primary-600 hover:bg-primary-700'
        },
        {
            id: 'improve',
            name: 'English Writing Coach',
            description: 'Chat with an AI coach to refine your vocabulary and flow.',
            icon: Bot,
            color: 'text-amber-500',
            bg: 'bg-amber-50/50',
            borderColor: 'border-amber-100/50',
            btnBg: 'bg-slate-900 hover:bg-slate-800'
        },
        {
            id: 'humanize',
            name: 'Humanize AI',
            description: 'Make AI-generated text sound natural and human-like.',
            icon: Sparkles,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
            borderColor: 'border-cyan-100',
            btnBg: 'bg-cyan-600 hover:bg-cyan-700'
        },
        {
            id: 'ai-detector',
            name: 'AI Detector',
            description: 'Determine the probability that a text was written by AI.',
            icon: ShieldCheck,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            borderColor: 'border-teal-100',
            btnBg: 'bg-teal-600 hover:bg-teal-700'
        },
        {
            id: 'translate',
            name: 'AI Translator',
            description: 'Translate between English and Sinhala with legal/academic precision.',
            icon: Languages,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            borderColor: 'border-indigo-100',
            btnBg: 'bg-indigo-600 hover:bg-indigo-700'
        }
    ];

    const currentTool = tools.find(t => t.id === activeTask);

    const handleProcess = async () => {
        if (!content.trim()) return;
        setLoading(true);
        setError('');
        try {
            const data = await aiService.processWritingTask(activeTask, content);
            setResult(data.response);
        } catch (err) {
            setError('Failed to process your request. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setError('');
        setCoachMessages([]);
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (activeTask === 'improve') {
            scrollToBottom();
        }
    }, [coachMessages, activeTask]);

    const handleStartCoach = () => {
        setActiveTask('improve');
        if (coachMessages.length === 0) {
            setCoachMessages([
                {
                    role: 'assistant',
                    content: `Hi! I'm your English Writing Coach. I see we were working on some corrections. How can I help you refine this text further?`
                }
            ]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const userMsg = { role: 'user', content: chatInput };
        setCoachMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);

        try {
            // Provide context about the current writing task
            const contextMsg = {
                role: 'system',
                content: `You are an English Writing Coach. The user is working on a '${currentTool.name}' task. 
                Original Content: "${content}"
                Current AI Result: "${result}"
                Help the user refine this specific text. Keep the conversation focused on improving their writing.`
            };

            const history = [contextMsg, ...coachMessages, userMsg];
            const data = await aiService.chat(history.slice(-10), chatInput); // Keep history reasonable
            setCoachMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (err) {
            console.error('Coach Chat error:', err);
            setCoachMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I hit a snag. Could you try that again?" }]);
        } finally {
            setChatLoading(false);
        }
    };

    const parseAiPercentage = (text) => {
        const match = text.match(/AI PERCENTAGE:\s*(\d+)%/i);
        return match ? parseInt(match[1]) : null;
    };

    const aiPercentage = activeTask === 'ai-detector' ? parseAiPercentage(result) : null;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative min-h-screen bg-dot-grid">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-200/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-purple-200/10 rounded-full blur-[100px] animate-pulse-slow [animation-delay:2s]"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-100/10 rounded-full blur-[80px] animate-pulse-slow [animation-delay:1s]"></div>
            </div>

            {/* Header / Hero Section */}
            <div className="mb-20 text-center max-w-4xl mx-auto pt-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-premium border border-primary-100/50 mb-8 animate-slide-up shadow-sm">
                    <Sparkles className="text-primary-500" size={14} />
                    <span className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.2em]">Next-Gen Writing Suite</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[1.1] mb-8 animate-slide-up">
                    Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-primary-500">Academic Voice</span>
                </h1>
                <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed animate-slide-up [animation-delay:200ms] max-w-2xl mx-auto">
                    A clinical-grade writing engine designed for researchers, students, and professionals.
                    Precision tools that move at the speed of thought.
                </p>
            </div>

            {/* Tool Selection (Spaces) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16 animate-slide-up [animation-delay:400ms]">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => {
                            setActiveTask(tool.id);
                            setResult('');
                            if (tool.id === 'improve' && coachMessages.length === 0) {
                                setCoachMessages([
                                    {
                                        role: 'assistant',
                                        content: `Hi! I'm your English Writing Coach. Paste some text you'd like me to help with, or just ask me a question about English writing!`
                                    }
                                ]);
                            }
                        }}
                        className={`group relative p-8 rounded-[2.5rem] transition-all duration-500 text-left overflow-hidden border-2 ${activeTask === tool.id
                            ? `${tool.borderColor} ${tool.bg} shadow-premium scale-[1.02]`
                            : 'border-white glass-premium hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 hover:scale-[1.01]'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${activeTask === tool.id ? 'bg-white shadow-lg' : 'bg-slate-50/50 shadow-inner'
                            }`}>
                            <tool.icon className={activeTask === tool.id ? tool.color : 'text-slate-400'} size={32} />
                        </div>

                        <div className="space-y-3">
                            <h3 className={`font-display font-bold text-lg tracking-tight ${activeTask === tool.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                {tool.name}
                            </h3>
                            <p className="text-[13px] text-slate-400 leading-relaxed font-medium line-clamp-2">
                                {tool.description}
                            </p>
                        </div>

                        {activeTask === tool.id && (
                            <div className="absolute top-6 right-6">
                                <div className="w-3 h-3 rounded-full bg-primary-600 shadow-[0_0_15px_rgba(44,171,171,0.6)] animate-pulse"></div>
                            </div>
                        )}

                        {/* Hover Decorative Glow */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors"></div>
                    </button>
                ))}
            </div>

            {/* Main Workspace */}
            <div className="glass-premium rounded-[3rem] border border-white/50 shadow-premium overflow-hidden min-h-[700px] flex flex-col lg:flex-row animate-slide-up [animation-delay:600ms] relative">
                {/* Input Section */}
                <div className="flex-1 p-10 sm:p-12 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200/50 bg-white/40 relative backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${currentTool.bg} shadow-sm`}>
                                <currentTool.icon className={currentTool.color} size={22} />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] block mb-0.5">
                                    Source Content
                                </label>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace Input</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-all flex items-center gap-2 uppercase tracking-[0.2em] group px-4 py-2 rounded-xl hover:bg-red-50"
                        >
                            <Eraser size={16} className="group-hover:rotate-12 transition-transform" />
                            Clear Space
                        </button>
                    </div>

                    <textarea
                        className="flex-1 w-full bg-slate-50/50 rounded-[2rem] p-10 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-primary-500/5 border-2 border-transparent focus:border-primary-100 transition-all resize-none font-medium min-h-[400px] text-lg leading-[1.8] shadow-inner"
                        placeholder="Type or paste your academic material here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    <div className="mt-10 flex items-center justify-between gap-6">
                        <div className="px-6 py-3 rounded-2xl glass-premium border border-slate-100 shadow-soft">
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                                {content.split(/\s+/).filter(x => x.length > 0).length} Words <span className="mx-2 text-slate-200">|</span> {content.length} Chars
                            </p>
                        </div>

                        {activeTask !== 'improve' && (
                            <button
                                onClick={handleProcess}
                                disabled={loading || !content.trim()}
                                className={`px-12 py-5 rounded-[1.5rem] font-bold flex items-center gap-4 transition-all transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:scale-100 text-white shadow-2xl ${currentTool.btnBg} ${loading ? '' : 'shadow-glow'}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="uppercase tracking-[0.2em] text-[11px] font-black">AI Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="uppercase tracking-[0.2em] text-[11px] font-black">Execute {currentTool.name}</span>
                                        <Zap size={20} className="fill-current" />
                                    </>
                                )}
                            </button>
                        )}
                        {activeTask === 'improve' && (
                            <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50/50 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-emerald-100 shadow-sm animate-pulse-slow">
                                <Bot size={20} className="text-emerald-500" />
                                Interactive Analysis Module
                            </div>
                        )}
                    </div>
                </div>

                {/* Result Section / Chat Section */}
                <div className="flex-1 p-10 sm:p-12 flex flex-col transition-colors bg-slate-50/30 backdrop-blur-[2px]">
                    <div className="flex items-center justify-between mb-8 h-12">
                        <div className="flex items-center gap-4">
                            <Sparkles size={22} className="text-primary-500" />
                            <div>
                                <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] block mb-0.5">
                                    AI Perception
                                </label>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enhanced Result</span>
                            </div>
                        </div>
                        {result && activeTask !== 'improve' && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-600 hover:text-primary-600 hover:shadow-lg transition-all transform active:scale-95 border border-slate-100 font-bold text-[11px] uppercase tracking-[0.2em] shadow-soft"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="text-emerald-500" />
                                        <span className="text-emerald-500">Transferred</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        <span>Copy Output</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-6 rounded-[1.5rem] text-sm mb-8 border border-red-100 flex items-center gap-4 animate-shake shadow-md">
                            <AlertCircle size={22} />
                            <span className="font-black uppercase tracking-tight">{error}</span>
                        </div>
                    )}

                    <div className="flex-1 w-full bg-white/80 border border-white rounded-[2rem] text-slate-800 font-medium overflow-hidden relative shadow-premium min-h-[450px] backdrop-blur-sm">
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl z-30 p-12 text-center animate-fade-in">
                                <div className="w-56 h-2 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
                                    <div className="w-1/2 h-full bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 animate-loading-bar rounded-full"></div>
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Scanning Neural Networks</p>
                            </div>
                        )}

                        {!result && !loading && activeTask !== 'improve' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-12 text-center z-10">
                                <div className="w-24 h-24 rounded-[3rem] bg-slate-50 flex items-center justify-center mb-10 shadow-inner border border-slate-100 group transition-all duration-700 hover:scale-110 hover:shadow-2xl">
                                    <Sparkles size={48} className="text-slate-200 group-hover:text-primary-300 transition-colors duration-500" />
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">System Ready</h4>
                                <p className="text-[13px] text-slate-400 font-medium max-w-[260px] leading-relaxed">Intelligence module is tuned and waiting for your content stream.</p>
                            </div>
                        )}

                        <div className="h-full overflow-y-auto p-10 sm:p-12">
                            {activeTask === 'improve' ? (
                                <div className="h-full flex flex-col -m-10 sm:-m-12">
                                    {/* Embedded Chat */}
                                    <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30">
                                        {coachMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-slide-up`}>
                                                <div className={`max-w-[85%] p-6 rounded-[2rem] text-[15px] leading-[1.7] shadow-soft ${msg.role === 'assistant'
                                                    ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                                    : 'bg-slate-900 text-white shadow-xl shadow-slate-300/50 rounded-tr-none font-medium'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {chatLoading && (
                                            <div className="flex justify-start animate-fade-in">
                                                <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-soft">
                                                    <div className="flex gap-2">
                                                        <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce [animation-duration:1s]"></div>
                                                        <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
                                                        <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Chat Input */}
                                    <form onSubmit={handleSendMessage} className="p-10 bg-white border-t border-slate-100">
                                        <div className="flex gap-5 bg-slate-50 p-3 rounded-[2rem] border-2 border-slate-100 focus-within:ring-8 ring-primary-500/5 focus-within:border-primary-200 transition-all shadow-inner">
                                            <input
                                                type="text"
                                                placeholder="Ask your coach to explain or refine..."
                                                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-400"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                disabled={chatLoading}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!chatInput.trim() || chatLoading}
                                                className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-xl shadow-primary-500/30"
                                            >
                                                <Send size={22} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : result ? (
                                <div className="animate-fade-in result-text text-slate-800">
                                    {activeTask === 'ai-detector' && aiPercentage !== null ? (
                                        <div className="flex flex-col items-center justify-center py-10">
                                            <div className="relative w-64 h-64 mb-12">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="128" cy="128" r="105" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-50" />
                                                    <circle cx="128" cy="128" r="105" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray={2 * Math.PI * 105} strokeDashoffset={2 * Math.PI * 105 * (1 - aiPercentage / 100)} className={`${aiPercentage > 50 ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-1000 ease-out drop-shadow-xl`} />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-6xl font-display font-bold text-slate-900 leading-none">{aiPercentage}%</span>
                                                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">AI Signal</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-50/80 border border-slate-100 rounded-[2.5rem] p-10 shadow-soft">
                                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 border-b border-slate-200 pb-5 flex items-center justify-between">
                                                    <span>Signal Decomposition</span>
                                                    <Zap size={14} className="text-amber-400" />
                                                </div>
                                                <p className="text-lg text-slate-700 italic whitespace-pre-wrap leading-[1.8] font-medium">
                                                    {result.split(/ANALYSIS:/i)[1]?.trim() || result}
                                                </p>
                                            </div>
                                        </div>
                                    ) : activeTask === 'grammar' ? (
                                        <div className="space-y-10">
                                            <div className="bg-emerald-50/40 border border-emerald-100 rounded-[2.5rem] p-10 shadow-soft">
                                                <div className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                    Reference Grade Output
                                                </div>
                                                <p className="text-slate-900 whitespace-pre-wrap leading-[1.8] text-[17px] font-semibold">
                                                    {result.split(/CORRECTED TEXT:\s*/i)[1]?.split(/CHANGES:/i)[0]?.trim() || result}
                                                </p>
                                            </div>
                                            {result.includes('CHANGES:') && (
                                                <div className="bg-slate-50/80 border border-slate-100 rounded-[2.5rem] p-10">
                                                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                                        <AlertCircle size={16} />
                                                        Refinement Log
                                                    </div>
                                                    <div className="text-[15px] text-slate-600 whitespace-pre-wrap font-medium leading-[2] pl-6 border-l-3 border-emerald-200">
                                                        {result.split(/CHANGES:/i)[1]?.trim()}
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleStartCoach}
                                                className="w-full py-6 rounded-[2rem] bg-slate-900 text-white font-bold text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-5 hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-300 group border border-white/10"
                                            >
                                                <Bot size={24} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                                                Iterate with Writing Coach
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap text-slate-800 text-[17px] font-semibold leading-[1.8]">
                                            {result}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tip / Pro Note */}
            <div className="mt-16 flex flex-col md:flex-row items-center md:items-start gap-8 p-10 glass-premium rounded-[2.5rem] border border-white/50 shadow-premium animate-slide-up [animation-delay:800ms] max-w-5xl mx-auto mb-20">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50/50 flex items-center justify-center flex-shrink-0 shadow-inner border border-primary-100/50 group">
                    <Zap className="text-primary-600 group-hover:scale-110 transition-transform" size={28} />
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-display font-black text-xs text-slate-900 mb-3 uppercase tracking-[0.3em]">Neural Optimization Strategy</h4>
                    <p className="text-base text-slate-500 font-medium leading-[1.8] max-w-3xl">
                        The AI Writing engine works best when provided with clear, structured context.
                        For technical papers, the **Grammar Checker** ensures terminology remains consistent,
                        while the **English Writing Coach** provides deep structural improvements to your narrative flow.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WritingTools;
