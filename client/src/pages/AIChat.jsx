import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiService } from '../services/api';
import { Send, Bot, User, Trash2, Sparkles, AlertCircle } from 'lucide-react';

const MessageBubble = ({ message, role }) => {
    const isAi = role === 'assistant' || role === 'system';

    return (
        <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in`}>
            <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border ${isAi
                    ? 'bg-primary-600 text-white border-primary-500'
                    : 'bg-white text-slate-600 border-slate-100'
                    }`}>
                    {isAi ? <Bot size={20} /> : <User size={20} />}
                </div>

                <div className={`p-4 rounded-3xl ${isAi
                    ? 'bg-white border border-slate-100 text-slate-800 shadow-sm'
                    : 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                    }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIChat = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q');

    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! 👋 I\'m your AI Chatbot. How can I help you with your studies or writing today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle initial query from dashboard
    useEffect(() => {
        if (initialQuery && messages.length === 1) {
            handleSend(null, initialQuery);
            // Clear the param so it doesn't re-trigger on refresh
            setSearchParams({});
        }
    }, [initialQuery]);

    const handleSend = async (e, directPrompt = null) => {
        if (e) e.preventDefault();
        const promptText = directPrompt || input;
        if (!promptText.trim() || loading) return;

        const userMsg = { role: 'user', content: promptText };
        setMessages(prev => [...prev, userMsg]);
        if (!directPrompt) setInput('');
        setLoading(true);
        setError(null);

        try {
            // Get history (excluding the first greeting)
            // The `messages` state here is the state *before* the `setMessages` call above.
            // So, `messages.slice(1)` correctly represents the history *before* the current user message.
            const historyForApi = messages.slice(1).map(({ role, content }) => ({ role, content }));

            const data = await aiService.chat(historyForApi, promptText);
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (err) {
            console.error('Chat error:', err);
            const msg = err.response?.data?.message || err.message || 'Oops! I ran into an issue. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            { role: 'assistant', content: 'Hi there! 👋 I\'m your Lanka AI Study Assistant. What subject are we focusing on today?' }
        ]);
        setError(null);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-2 rounded-xl border border-primary-100">
                        <Bot size={24} className="text-primary-600" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-slate-900">AI Chatbot</h2>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {loading ? 'Tutor is thinking...' : 'Ready to help'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={clearChat}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Clear Conversation"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50/30">
                <div className="max-w-3xl mx-auto space-y-2">
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} role={msg.role} message={msg.content} />
                    ))}
                    {loading && (
                        <div className="flex justify-start mb-6 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center border border-primary-50">
                                    <Sparkles size={18} className="text-primary-600" />
                                </div>
                                <div className="p-4 rounded-3xl bg-white border border-slate-100">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center my-4 animate-fade-in">
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-white border-t border-slate-50">
                <form
                    onSubmit={handleSend}
                    className="max-w-3xl mx-auto chat-input-bar group focus-within:ring-4 ring-primary-500/10 transition-all"
                >
                    <input
                        type="text"
                        placeholder="Ask anything (e.g., 'Explain Photosynthesis in simple terms')"
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-medium placeholder:text-slate-300 py-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`p-2.5 rounded-2xl transition-all shadow-lg active:scale-95 ${!input.trim() || loading
                            ? 'bg-slate-200 text-slate-400'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </form>
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        <Sparkles size={12} />
                        Powered by Lanka AI
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
