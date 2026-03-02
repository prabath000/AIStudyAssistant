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
    MoreVertical
} from 'lucide-react';


const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link
        to={path}
        className={`sidebar-nav-item ${active ? 'active' : ''}`}
        title={collapsed ? label : ''}
    >
        <div className="flex items-center gap-4">
            <Icon size={22} className={`${active ? 'text-[#a78bfa]' : 'text-[#94a3b8]'}`} />
            {!collapsed && (
                <span className="font-medium text-sm transition-opacity duration-300">
                    {label}
                </span>
            )}
        </div>
    </Link>
);



const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const location = useLocation();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: Home, label: t('home'), path: '/' },
        { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
        { icon: FolderKanban, label: t('studyHub'), path: '/notes' },
        { icon: CheckSquare, label: t('practiceQuiz'), path: '/quiz' },
        { icon: BarChart3, label: t('studyPlanner'), path: '/planner' },
    ];

    const bottomItems = [
        { icon: Bell, label: t('notifications'), path: '/notifications', count: 12 },
        { icon: LifeBuoy, label: t('support'), path: '/support' },
        { icon: Settings, label: t('settings'), path: '/settings' },
    ];



    return (
        <div className="app-container">
            {/* Untitled Dark Sidebar */}
            <aside
                className={`sidebar-untitled ${collapsed ? 'w-20' : 'w-72'}`}
            >
                {/* Header: Logo & Toggle */}
                <div className="flex items-center justify-between px-6 py-8 h-20">
                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        <img src={logo} alt="Lanka AI Logo" className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-purple-500/20 ring-1 ring-white/10" />
                        <span className="font-display font-bold text-lg tracking-tight">Lanka AI</span>
                    </div>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-[#94a3b8] hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Language Switcher */}
                <div className="px-4 mb-4">
                    <button
                        onClick={toggleLanguage}
                        className={`w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-2.5 transition-all hover:bg-white/10 shadow-lg ${collapsed ? 'px-0' : 'px-4'}`}
                        title={language === 'en' ? 'Switch to Sinhala' : 'ඉංග්‍රීසි භාෂාවට මාරු වන්න'}
                    >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-slate-800 text-[12px] shadow-inner">
                            {language === 'en' ? '🇱🇰' : '🇬🇧'}
                        </div>
                        {!collapsed && (
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                {language === 'en' ? 'සිංහල' : 'English'}
                            </span>
                        )}
                    </button>
                </div>


                {/* Search Bar */}
                <div className="px-4 mb-6">
                    <div className={`flex items-center bg-white/5 border border-white/5 rounded-xl transition-all ${collapsed ? 'justify-center p-3' : 'px-4 py-2.5 gap-3'}`}>
                        <Search size={18} className="text-[#94a3b8]" />
                        {!collapsed && (
                            <input
                                type="text"
                                placeholder={t('search')}
                                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#64748b] w-full"
                            />

                        )}
                    </div>
                </div>

                {/* Navigation List */}
                <div className="flex-1 overflow-y-auto sidebar-nav-container px-0">
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                path={item.path}
                                active={location.pathname === item.path}
                                collapsed={collapsed}
                            />
                        ))}
                    </div>

                    {/* Bottom Nav Section */}
                    <div className="mt-10 pt-10 border-t border-white/5 space-y-1">
                        {bottomItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="sidebar-nav-item relative group"
                                title={collapsed ? item.label : ''}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <item.icon size={22} className="text-[#94a3b8]" />
                                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                                    </div>
                                    {!collapsed && item.count && (
                                        <span className="bg-[#8b5cf6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="mt-auto border-t border-white/5 p-4">
                    <div className={`user-profile-sidebar flex items-center gap-3 transition-all ${collapsed ? 'justify-center p-2' : ''}`}>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-white/10">
                                {user?.username?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#171717] rounded-full"></div>
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-xs font-bold text-white truncate">{user?.username || 'Prabath Thilina'}</p>
                                <p className="text-[10px] text-[#64748b] truncate">{user?.email || 'p.thilina@lankaai.edu'}</p>
                            </div>
                        )}

                        {!collapsed && (
                            <button
                                onClick={handleLogout}
                                className="text-[#64748b] hover:text-white transition-colors"
                                title={t('logout')}
                            >
                                <MoreVertical size={18} />
                            </button>

                        )}
                    </div>

                    {/* Developer Small Credit */}
                    <div className={`mt-2 text-center transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <a
                            href="https://prabath000.github.io/Prabaththilina/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-bold text-[#333] hover:text-[#555] transition-colors uppercase tracking-widest"
                        >
                            Untitled by Prabath
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f9fafb] relative overflow-hidden">
                {/* Content Header (Optional, but keeping for continuity if needed) */}

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto px-12 py-10">
                    <div className="max-w-full mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};



export default Layout;
