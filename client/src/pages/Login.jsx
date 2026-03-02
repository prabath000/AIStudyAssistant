import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Eye, EyeOff, Monitor, Sparkles, ArrowRight } from 'lucide-react';
import aiStudyVisual from '../assets/ai_study_visual.png';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-grid font-sans min-h-screen bg-white">
            {/* Left Side: Visual/Branding */}
            <div className="auth-visual relative overflow-hidden bg-slate-50 hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent opacity-60"></div>

                <div className="relative z-10 max-w-lg w-full text-center animate-slide-up">
                    <div className="mb-12 relative inline-block">
                        <div className="absolute -inset-4 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <img
                            src={aiStudyVisual}
                            alt="AI Study Assistant"
                            className="relative w-full h-auto max-h-[450px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                        Elevate Your Learning with <span className="text-primary-600">AI Intelligence</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                        Automate your study workflow, generate smart quizzes, and master any subject with your personal AI tutor.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                                    <div className={`w-full h-full bg-primary-${i}00`}></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-400">Join 5,000+ Students</p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="auth-form-container bg-white flex items-center justify-center p-8 sm:p-12">
                <div className="max-w-md w-full animate-fade-in">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-4 mb-8 group cursor-pointer transition-all hover:scale-105">
                            <img src={logo} alt="Lanka AI Logo" className="w-12 h-12 rounded-xl object-cover shadow-xl shadow-primary-500/20 ring-2 ring-white" />
                            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">Lanka AI</span>
                        </div>


                        <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-3">Welcome back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-8 border border-red-100 flex items-center gap-3 animate-slide-up">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                className="auth-input focus:scale-[1.01] transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="auth-input pr-12 focus:scale-[1.01] transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer hover:text-slate-700 transition-colors">Remember for 30 days</label>
                        </div>

                        <button type="submit" disabled={loading} className="auth-btn-primary py-4 group flex items-center justify-center gap-3">
                            <span className="font-bold uppercase tracking-widest">{loading ? 'Processing...' : 'Sign In'}</span>
                            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="relative my-12">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-slate-300">
                            <span className="bg-white px-6">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="auth-social-btn py-3.5 group">
                            <svg className="group-hover:scale-110 transition-transform" width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            <span className="font-bold">Google</span>
                        </button>
                        <button className="auth-social-btn py-3.5 group">
                            <svg className="group-hover:scale-110 transition-transform" width="20" height="20" viewBox="0 0 24 24"><path d="M17.05 20.28c-.96.95-2.21 1.72-3.6 1.72-1.4 0-2.34-.69-3.66-.69-1.31 0-2.43.67-3.65.67-1.37 0-2.67-.79-3.65-1.74-1.93-1.93-2.01-6.12-.31-8.31 1.1-1.37 2.53-2.22 4.09-2.22 1.37 0 2.22.68 3.52.68 1.28 0 2.37-.68 3.55-.68 1.48 0 2.76.76 3.65 1.79-1.93 1-1.87 4.19.16 5.41-.78 2.03-1.83 4.13-3.1 5.4zm-4.76-15.68c0-1.86 1.5-3.36 3.36-3.46.06 1.87-1.48 3.47-3.36 3.46z" fill="#000" /></svg>
                            <span className="font-bold">Apple ID</span>
                        </button>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-semibold text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 border-b-2 border-primary-100 hover:border-primary-600 transition-all ml-1">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
