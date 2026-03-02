import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle, Sparkles, Monitor, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please check your connection and try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-grid font-sans">
            {/* Left Side: Visual/Onboarding */}
            <div className="auth-visual relative overflow-hidden">
                <div className="max-w-md w-full animate-slide-up">
                    {/* Feature Showcase Visual */}
                    <div className="relative h-[400px] mb-12 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-6 w-full">
                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 transform -rotate-3 hover:rotate-0 transition-transform">
                                <div className="bg-purple-100 p-3 rounded-2xl w-fit mb-4 text-purple-600">
                                    <Zap size={24} />
                                </div>
                                <p className="font-bold text-slate-800 text-sm">Fast Summaries</p>
                                <p className="text-xs text-slate-400 mt-1">Get key insights in seconds</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 transform rotate-3 hover:rotate-0 transition-transform mt-12">
                                <div className="bg-blue-100 p-3 rounded-2xl w-fit mb-4 text-blue-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="font-bold text-slate-800 text-sm">Secure Storage</p>
                                <p className="text-xs text-slate-400 mt-1">Your notes are always safe</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 col-span-2 flex items-center gap-6 mt-6">
                                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Study Smarter</p>
                                    <p className="text-slate-400 text-sm font-medium">Join 5,000+ students today</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Start Your AI Journey</h3>
                    <p className="text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
                        Create an account to unlock personalized study plans and AI tutoring.
                    </p>

                    <div className="flex gap-2 mt-8 justify-center">
                        <div className="h-1.5 w-4 rounded-full bg-primary-500"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="auth-form-container animate-fade-in bg-white">
                <div className="max-w-md w-full">
                    {/* Logo Brand */}
                    <div className="mb-10 text-center flex flex-col items-center">
                        <img src={logo} alt="Lanka AI Logo" className="w-16 h-16 rounded-2xl object-cover shadow-xl mb-6 scale-110 shadow-primary-500/20 ring-2 ring-white" />
                        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Create Account</h2>

                        <p className="text-slate-400 mt-2 font-medium">Enter your details to get started.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="auth-input pl-12"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="auth-input pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="auth-input pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Must be at least 8 characters</p>
                        </div>

                        <button type="submit" disabled={loading} className="auth-btn-primary mt-4">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-bold text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-slate-900 border-b-2 border-primary-400 hover:text-primary-600 transition-colors">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
