import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    Sparkles,
    Bot,
    BookOpen,
    Zap,
    Calendar,
    ArrowRight,
    GraduationCap,
    Clock,
    Target,
    FileText,
    MessageSquare,
    Upload,
    ChevronRight,
    Send,
    User
} from 'lucide-react';


const FeatureShortcut = ({ icon: Icon, title, description, path, color, delay, t }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(path)}
            className="group bg-white p-8 rounded-3xl border border-slate-50 hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer flex flex-col h-full animate-slide-up"
            style={{ animationDelay: delay }}
        >
            <div className={`${color} p-4 rounded-xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md`}>
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-display font-black text-slate-900 mb-3 group-hover:text-white transition-colors tracking-tight uppercase">{title}</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1 group-hover:text-slate-300 transition-colors uppercase tracking-wider text-[10px]">{description}</p>
            <div className="flex items-center gap-2 text-primary-500 font-black text-[9px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                <span>{t('viewAll')}</span>
                <ArrowRight size={16} />
            </div>
        </div>
    );
};



const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [chatInput, setChatInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleChatSubmit = (e, customPrompt = null) => {
        if (e) e.preventDefault();
        const prompt = customPrompt || chatInput;
        if (!prompt.trim()) return;
        navigate(`/chat?q=${encodeURIComponent(prompt)}`);
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await noteService.getNotes();
                setNotes(data);
            } catch (err) {
                console.error('Error fetching documents:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    return (
        <div className="space-y-12 pb-20">
            {/* Nixtio Hero Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 pt-4">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-[1.1] tracking-tight">
                        {t('hi')} {user?.username || 'Nixtio'}, <span className="text-slate-400">{t('ready')}</span>
                    </h1>
                </div>



                {/* Robot Illustration Placeholder */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary-100 rounded-full blur-[40px] opacity-40"></div>
                    <Bot size={120} className="text-slate-900 relative drop-shadow-xl animate-bounce-slow" />
                    <div className="absolute -top-2 -right-2 bg-white p-3 rounded-xl shadow-lg border border-slate-50 animate-fade-in">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('heyThere')}</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{t('needBoost')}</p>
                    </div>
                </div>

            </div>

            {/* Nixtio Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div
                    onClick={() => navigate('/notes')}
                    className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group border border-slate-50"
                >
                    <div className="bg-amber-100 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-md">
                        <BookOpen className="text-amber-600" size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed mb-4">
                        {t('studyHubDesc')}
                    </p>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('studyHub')}</span>
                </div>

                <div
                    onClick={() => navigate('/chat')}
                    className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group border border-slate-50"
                >
                    <div className="bg-primary-100 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-md">
                        <MessageSquare className="text-primary-600" size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed mb-4">
                        {t('generalChatDesc')}
                    </p>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('generalChat')}</span>
                </div>

                <div
                    onClick={() => navigate('/quiz')}
                    className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group border border-slate-50"
                >
                    <div className="bg-emerald-100 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-md">
                        <Zap className="text-emerald-600" size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed mb-4">
                        {t('assessmentDesc')}
                    </p>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('assessment')}</span>
                </div>
            </div>


            {/* Nixtio Bottom Action Bar */}
            <div className="mt-20 max-w-4xl mx-auto space-y-4">
                <div className="bg-slate-50/80 backdrop-blur-md p-4 px-8 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                        <Sparkles size={14} /> {t('unlockPro')}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-2 tracking-widest uppercase italic">
                        {t('poweredBy')}
                    </span>
                </div>


                <form
                    onSubmit={handleChatSubmit}
                    className="bg-white rounded-2xl p-2 pl-6 border border-slate-100 shadow-xl flex items-center gap-4 group focus-within:ring-4 ring-slate-100 transition-all"
                >
                    <button type="button" className="text-slate-300 hover:text-slate-900 transition-colors">
                        <Upload size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder={t('askAnything')}
                        className="flex-1 bg-transparent border-none outline-none font-medium text-sm text-slate-900 placeholder:text-slate-300"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />

                    <div className="flex items-center gap-2">
                        <button type="button" className="p-2 text-slate-300 hover:text-primary-600 transition-colors">
                            <Bot size={20} />
                        </button>
                        <button
                            type="submit"
                            className="bg-slate-900 text-white p-3 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-2 py-1">
                    {/* Nixtio Quick Action Pills */}
                    {[
                        { label: t('deepResearch'), icon: Sparkles, prompt: 'Perform a deep research on: ' },
                        { label: t('makeImage'), icon: FileText, prompt: 'Generate an image for: ' },
                        { label: t('search'), icon: Bot, prompt: 'Search for: ' },
                        { label: t('createMusic'), icon: Zap, prompt: 'Create music about: ' }
                    ].map(({ label, icon: Icon, prompt }, i) => (
                        <button
                            key={i}
                            onClick={() => handleChatSubmit(null, prompt + (chatInput || 'latest trends'))}
                            className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md"
                        >
                            <Icon size={12} />
                            {label}
                        </button>
                    ))}


                    <button className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                        ...
                    </button>
                </div>
            </div>



            {/* Recent Documents Section */}

            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-3">
                        <FileText className="text-primary-600" />
                        {t('myStudyMaterials')}
                    </h2>
                    <button
                        onClick={() => navigate('/notes')}
                        className="text-primary-600 font-bold text-sm hover:underline"
                    >
                        {t('viewAll')}
                    </button>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-50 h-48 rounded-[2rem] animate-pulse border border-slate-100"></div>
                        ))
                    ) : notes.length > 0 ? (
                        notes.slice(0, 3).map((note, index) => (
                            <div
                                key={note._id}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-primary-50 p-3 rounded-xl text-primary-600 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-slate-900 truncate">{note.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-primary-100 uppercase tracking-tighter">
                                                {note.category || 'O/L'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => navigate(`/document/${note._id}?tab=chat`)}
                                        className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-3 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all"
                                    >
                                        <Bot size={14} />
                                        {t('chat')}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/document/${note._id}?tab=summary`)}
                                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all"
                                    >
                                        <BookOpen size={14} />
                                        {t('summary')}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/document/${note._id}?tab=quiz`)}
                                        className="col-span-2 flex items-center justify-center gap-2 bg-amber-50 text-amber-700 py-3 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all mt-1"
                                    >
                                        <Zap size={14} />
                                        {t('generateQuiz')}
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                            <div className="bg-white w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                                <Upload className="text-slate-300" />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">{t('noDocsYet')}</h3>
                            <p className="text-slate-500 text-sm mb-6">{t('uploadFirst')}</p>
                            <button
                                onClick={() => navigate('/notes')}
                                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md"
                            >
                                {t('getStarted')}
                            </button>
                        </div>

                    )}
                </div>
            </div>

            {/* Feature Shortcuts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureShortcut
                    icon={Bot}
                    title={t('aiChatTutor')}
                    description={t('aiChatTutorDesc')}
                    path="/chat"
                    color="bg-purple-50 text-purple-600"
                    delay="0.1s"
                    t={t}
                />
                <FeatureShortcut
                    icon={BookOpen}
                    title={t('uploadCenter')}
                    description={t('uploadCenterDesc')}
                    path="/notes"
                    color="bg-blue-50 text-blue-600"
                    delay="0.2s"
                    t={t}
                />
                <FeatureShortcut
                    icon={Zap}
                    title={t('quizGen')}
                    description={t('quizGenDesc')}
                    path="/quiz"
                    color="bg-amber-50 text-amber-600"
                    delay="0.3s"
                    t={t}
                />
                <FeatureShortcut
                    icon={Calendar}
                    title={t('studyPlanner')}
                    description={t('plannerDesc')}
                    path="/planner"
                    color="bg-emerald-50 text-emerald-600"
                    delay="0.4s"
                    t={t}
                />
            </div>

        </div>
    );
};

export default Dashboard;

