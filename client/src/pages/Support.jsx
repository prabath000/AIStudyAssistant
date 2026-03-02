import { HelpCircle, Book, MessageSquare, Zap, ChevronRight } from 'lucide-react';

const SupportSection = ({ icon: Icon, title, steps, color }) => (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all mb-8 group">
        <div className={`p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform ${color}`}>
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">{title}</h3>
        <div className="space-y-4">
            {steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{step}</p>
                </div>
            ))}
        </div>
    </div>
);

const Support = () => {
    const guides = [
        {
            icon: MessageSquare,
            title: 'How to use AI Chatbot',
            color: 'bg-purple-100 text-purple-600',
            steps: [
                'Click the floating AI Chatbot button at the bottom-right of any page.',
                'Type your question or study topic in the chat box.',
                'You can ask anything in English or Sinhala—the AI understands both perfectly.',
                'Use clear, specific prompts like "Explain the nitrogen cycle for O/Ls" for better results.'
            ]
        },
        {
            icon: Book,
            title: 'Using the Study Hub',
            color: 'bg-blue-100 text-blue-600',
            steps: [
                'Go to the Study Hub and upload your lesson PDF or paste a topic.',
                'The AI will automatically generate summaries, key points, and exam notes.',
                'Choose "Generate Quiz" to test your knowledge on the material.',
                'Chat with the AI directly about your uploaded documents for deep insights.'
            ]
        },
        {
            icon: Zap,
            title: 'Mastering Writing Tools',
            color: 'bg-emerald-100 text-emerald-600',
            steps: [
                'Select a tool: Grammar Checker, Humanizer, Detector, or English Writing Coach.',
                'Paste your text into the input field and click the action button.',
                'For the Coach tool, engage in a conversation to refine your writing style.',
                'Use the "Humanize AI" tool to make machine-generated text sound natural.'
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-6 animate-fade-in pb-20">
            <div className="text-center mb-16">
                <div className="bg-slate-900 text-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
                    <HelpCircle size={32} />
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">Need Help?</h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto">Master every tool in Lanka AI with our comprehensive "How to Use" guide.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {guides.map((guide, i) => (
                    <SupportSection key={i} {...guide} />
                ))}
            </div>

            <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-2xl font-display font-bold mb-4 relative z-10">Still have questions?</h2>
                <p className="text-slate-400 mb-8 relative z-10 max-w-lg mx-auto">Our developer and AI support team are here to help you excel in your studies.</p>
                <div className="flex justify-center gap-4 relative z-10">
                    <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all">Contact Support</button>
                    <button className="bg-white/10 text-white px-8 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10">Read Docs</button>
                </div>
            </div>
        </div>
    );
};

export default Support;
