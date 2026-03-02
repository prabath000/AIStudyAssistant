import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, BookOpen, Bot, Zap, Calendar } from 'lucide-react';
import logo from '../assets/logo.png';

const FeatureCard = ({ icon: Icon, title, description, color, path }) => (
    <Link to={path || '/'} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-primary-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 group block">
        <div className={`${color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </Link>
);

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
                <Link to="/" className="flex items-center gap-3">
                    <img src={logo} alt="Lanka AI Logo" className="h-10 w-auto object-contain" />
                </Link>

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
                        Transform the way you study. Generate notes, quizzes, and personalized study plans in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-3xl text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group">
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
                            title="AI Chatbot"
                            description="Ask anything in English or Sinhala. Get instant, simple explanations for tough concepts."
                            color="bg-purple-100 text-primary-600"
                            path="/chat"
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="Study Hub"
                            description="Enter any lesson topic and get summaries, key points, and exam-ready notes instantly."
                            color="bg-blue-100 text-blue-600"
                            path="/notes"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Writing Tools"
                            description="Elevate your academic voice with AI-powered grammar checking, coaching, and humanizing tools."
                            color="bg-amber-100 text-amber-600"
                            path="/writing-tools"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <img src={logo} alt="Lanka AI Logo" className="h-8 w-auto object-contain" />
                </div>
                <p className="text-slate-400 text-sm">
                    © 2026 Designed for Sri Lankan Students. Powered by{' '}
                    <a
                        href="https://prabath000.github.io/Prabaththilina/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        Prabath Thilina
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Home;
