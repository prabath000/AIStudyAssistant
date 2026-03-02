import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, BookOpen, Bot, Zap, Calendar } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-primary-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 group">
        <div className={`${color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
);

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-600 text-white p-2 rounded-xl shadow-lg rotate-3">
                        <Sparkles size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-xl leading-none">Lanka AI</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Study Assistant</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link to="/dashboard" className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-600 font-semibold hover:text-primary-600 transition-colors">Login</Link>
                            <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95">
                                Start Learning
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary-50 rounded-full blur-3xl opacity-50 -z-10 -translate-y-1/2"></div>

                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-xs font-bold mb-8 animate-fade-in shadow-sm border border-primary-100">
                        <Zap size={14} />
                        <span>Empowering Sri Lankan Students with AI</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] mb-8 animate-slide-up">
                        Your Personal <span className="text-primary-600">AI Tutor</span> <br />
                        For Every Subject.
                    </h1>

                    <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Transform the way you study. Generate notes, quizzes, and personalized study plans in seconds. Tailored for Grade 6-11, O/L, and A/L students.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/register" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-3xl text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group">
                            Get Started for Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto bg-white text-slate-600 border border-slate-200 px-10 py-5 rounded-3xl text-lg font-bold hover:bg-slate-50 transition-all active:scale-95">
                            Watch Demo
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-32 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Everything You Need to Succeed</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">AI-powered tools designed specifically for the Sri Lankan curriculum to help you score higher.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={Bot}
                            title="AI Chat Tutor"
                            description="Ask anything in English or Sinhala. Get instant, simple explanations for tough concepts."
                            color="bg-purple-100 text-primary-600"
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="Notes Gen"
                            description="Enter any lesson topic and get summaries, key points, and exam-ready notes instantly."
                            color="bg-blue-100 text-blue-600"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Quiz Gen"
                            description="Test your knowledge with AI-generated MCQs tailored to your specific subject and topic."
                            color="bg-amber-100 text-amber-600"
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Study Planner"
                            description="Tell us your exam date and subjects. We'll build a personalized daily plan to keep you on track."
                            color="bg-emerald-100 text-emerald-600"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles size={18} className="text-primary-600" />
                    <span className="font-display font-bold text-slate-900">Lanka AI Study Assistant</span>
                </div>
                <p className="text-slate-400 text-sm">© 2026 Designed for Sri Lankan Students. Powered by Advanced AI.</p>
            </footer>
        </div>
    );
};

export default Home;
