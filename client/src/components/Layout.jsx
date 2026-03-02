import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';

import {
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Zap,
    Calendar,
    LogOut,
    Menu,
    X,
    Sparkles,
    ChevronRight,

    Search,
    Home,
    FolderKanban,
    CheckSquare,
    BarChart3,
    Bell,
    LifeBuoy,
    Settings,
    MoreVertical,
    Bot
} from 'lucide-react';


const SidebarItem = ({ icon: Icon, label, path, active, collapsed, item }) => (
    <Link
        to={path}
        className={`sidebar-nav-item ${active ? 'active' : ''}`}
        title={collapsed ? label : ''}
    >
        <div className="flex items-center gap-4">
            <Icon size={20} className={`${active ? 'text-slate-900' : 'text-slate-400'}`} />
            {!collapsed && (
                <span className={`text-sm tracking-tight transition-opacity duration-300`}>
                    {label}
                </span>
            )}
        </div>
    </Link>
);



const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const { language, t } = useLanguage();
    const location = useLocation();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: Home, label: t('home'), path: '/' },
        { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
        { icon: MessageSquare, label: t('aiChatTutor'), path: '/chat', highlighted: true },
        { icon: FolderKanban, label: t('studyHub'), path: '/notes' },
        { icon: Zap, label: t('writingTools'), path: '/writing-tools' },
    ];

    const bottomItems = [
        { icon: Bell, label: t('notifications'), path: '/notifications', count: 12 },
        { icon: LifeBuoy, label: t('support'), path: '/support' },
        { icon: Settings, label: t('settings'), path: '/settings' },
    ];



    return (
        <div className="app-container">
            {/* Minimalist Light Sidebar */}
            <aside
                className={`sidebar-untitled transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-72'}`}
            >
                {/* Header: Logo & Toggle */}
                <div className="flex items-center justify-between px-6 py-8 h-20 mb-2">
                    <Link to="/" className={`flex items-center gap-3 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        <img src={logo} alt="Lanka AI" className="h-10 w-auto" />
                    </Link>

                    {/* Floating Toggle Button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-50 transition-all hover:scale-110 active:scale-95"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <X size={14} className="rotate-45" />}
                    </button>

                    {collapsed && (
                        <div className="mx-auto">
                            <img src={logo} alt="Lanka AI" className="w-8 h-8 object-contain" />
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="px-4 mb-8">
                    <div className={`flex items-center bg-slate-50 border border-slate-100 rounded-xl transition-all ${collapsed ? 'justify-center p-3' : 'px-4 py-2.5 gap-3'}`}>
                        <Search size={16} className="text-slate-400" />
                        {!collapsed && (
                            <>
                                <input
                                    type="text"
                                    placeholder={t('search')}
                                    className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full"
                                />
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-slate-300 border border-slate-200 rounded px-1 px-0.5">⌘</span>
                                    <span className="text-[10px] font-bold text-slate-300 border border-slate-200 rounded px-1 px-0.5">S</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Navigation List */}
                <div className="flex-1 overflow-y-auto sidebar-nav-container px-0">
                    {!collapsed && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-6 mb-4">Main Menu</p>}

                    <div className="space-y-0.5">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                path={item.path}
                                active={location.pathname === item.path}
                                collapsed={collapsed}
                                item={item}
                            />
                        ))}
                    </div>

                    {/* Bottom Nav Section */}
                    <div className="mt-10 px-0 space-y-0.5">
                        {!collapsed && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-6 mb-4">System</p>}
                        {bottomItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-nav-item relative group ${location.pathname === item.path ? 'active' : ''}`}
                                title={collapsed ? item.label : ''}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <item.icon size={20} className={location.pathname === item.path ? 'text-slate-900' : 'text-slate-400'} />
                                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                                    </div>
                                    {!collapsed && item.count && (
                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="mt-auto p-4">
                    <div className={`user-profile-sidebar flex items-center gap-3 transition-all ${collapsed ? 'justify-center border-none p-0' : ''}`}>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm overflow-hidden border border-slate-200">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user?.username?.charAt(0).toUpperCase() || 'P'
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">{user?.username || 'Prabath Thilina'}</p>
                                <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-wider">Student Learner</p>
                            </div>
                        )}

                        {!collapsed && (
                            <button
                                onClick={handleLogout}
                                className="text-slate-300 hover:text-slate-900 transition-colors ml-auto"
                                title={t('logout')}
                            >
                                <ChevronRight size={16} className="rotate-90" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f9fafb] relative overflow-hidden">
                {/* Content Header (Optional, but keeping for continuity if needed) */}

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-6 md:py-10">
                    <div className="max-w-full mx-auto">
                        {children}
                    </div>
                </main>

                {/* Floating Chat Button */}
                <Link
                    to="/chat"
                    className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 text-amber-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-900/40 hover:scale-110 active:scale-95 transition-all z-50 group border border-white/10"
                    title="AI Chatbot"
                >
                    <Bot size={32} className="group-hover:rotate-12 transition-transform" />
                    <div className="absolute bottom-full mb-4 right-0 bg-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">AI Chatbot</p>
                        <p className="text-sm font-bold text-slate-800">Need help? I'm online! 🤖</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};



export default Layout;
