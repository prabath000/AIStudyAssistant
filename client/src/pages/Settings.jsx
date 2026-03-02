import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/api';
import { User, Mail, Shield, Bell, Moon, Sun, Globe, ChevronRight, Save, Trash2, Loader2 } from 'lucide-react';

const SettingsSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
            <Icon size={18} className="text-slate-400" />
            <h2 className="font-bold text-slate-800 text-[11px] uppercase tracking-widest leading-none">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const SettingsField = ({ label, value, type = 'text', onChange }) => (
    <div className="mb-5 last:mb-0">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:ring-4 ring-primary-500/5 transition-all text-sm"
        />
    </div>
);

const SettingsToggle = ({ label, description, enabled, onToggle }) => (
    <div className="flex items-center justify-between mb-5 last:mb-0">
        <div>
            <p className="font-bold text-slate-800 text-sm">{label}</p>
            <p className="text-[11px] text-slate-400 font-medium">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`w-12 h-6.5 rounded-full transition-all relative ${enabled ? 'bg-primary-600' : 'bg-slate-200'}`}
        >
            <div className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white transition-all shadow-md ${enabled ? 'right-0.5' : 'left-0.5'}`}></div>
        </button>
    </div>
);

const Settings = () => {
    const { user, logout, updateUser } = useAuth();
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'true');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Handle Notifications Preference
    const toggleNotifications = async () => {
        const newValue = !notifications;
        if (newValue && Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Please enable notifications in your browser settings to receive alerts.');
                return;
            }
        }
        setNotifications(newValue);
        localStorage.setItem('notifications', newValue);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const updated = await authService.updateProfile({ username, email });
            updateUser(updated);
            setMessage({ type: 'success', text: 'Changes saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save changes' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you absolutely sure? This will permanently delete your account and all your data.')) {
            try {
                await authService.deleteAccount();
                logout();
                navigate('/login');
            } catch (err) {
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const currentScale = getComputedStyle(document.documentElement).getPropertyValue('--ui-scale').trim() || '0.88';

    return (
        <div className="max-w-3xl mx-auto py-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg">
                        <Shield size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900">Settings</h1>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Manage your account and preferences.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-xs font-bold text-center animate-fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                    {message.text}
                </div>
            )}

            <SettingsSection icon={User} title="Profile Information">
                <SettingsField
                    label="Full Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <SettingsField
                    label="Email Address"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </SettingsSection>

            <SettingsSection icon={Bell} title="Preferences">
                <SettingsToggle
                    label="Push Notifications"
                    description="Receive alerts for study reminders and new updates."
                    enabled={notifications}
                    onToggle={toggleNotifications}
                />
                <SettingsToggle
                    label="Dark Mode"
                    description="Switch to a dark interface for better late-night study sessions."
                    enabled={darkMode}
                    onToggle={() => setDarkMode(!darkMode)}
                />

                <div className="mb-5 pt-6 border-t border-slate-50">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">UI Scaling</label>
                    <div className="flex gap-3">
                        {[
                            { label: '80%', value: '0.8' },
                            { label: '88%', value: '0.88' },
                            { label: '95%', value: '0.95' },
                            { label: '100%', value: '1' }
                        ].map((scale) => (
                            <button
                                key={scale.value}
                                onClick={() => {
                                    document.documentElement.style.setProperty('--ui-scale', scale.value);
                                    localStorage.setItem('ui-scale', scale.value);
                                    setUsername(username); // Force re-render to update UI scale logic if needed
                                }}
                                className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-[10px] transition-all border ${currentScale === scale.value
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                                    }`}
                            >
                                {scale.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                    <div>
                        <p className="font-bold text-slate-800 text-sm">Language</p>
                        <p className="text-[11px] text-slate-400 font-medium tracking-tight">Choose your preferred interface language.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">
                        <Globe size={14} />
                        English (US)
                        <ChevronRight size={14} />
                    </button>
                </div>
            </SettingsSection>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[11px] text-slate-400 font-medium">Be careful, account deletion is permanent.</p>
                <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-red-500 font-bold text-xs hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <Trash2 size={14} />
                    Delete my account
                </button>
            </div>
        </div>
    );
};

export default Settings;
