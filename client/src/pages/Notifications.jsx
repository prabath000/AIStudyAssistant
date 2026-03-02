import { Bell, Zap, Bot, Sparkles, CheckCircle, Info } from 'lucide-react';

const NotificationItem = ({ icon: Icon, title, description, time, type }) => {
    const typeStyles = {
        update: 'bg-primary-50 text-primary-600 border-primary-100',
        feature: 'bg-amber-50 text-amber-600 border-amber-100',
        system: 'bg-slate-50 text-slate-600 border-slate-100'
    };

    return (
        <div className={`p-6 rounded-3xl border transition-all hover:shadow-md bg-white ${typeStyles[type] || typeStyles.system} mb-4 flex gap-4`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${typeStyles[type]}`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const Notifications = () => {
    const notifications = [
        {
            icon: Bot,
            title: 'Universal AI Chatbot Launched!',
            description: 'You can now access the AI Chatbot from any page using the floating button or the sidebar link.',
            time: '2 hours ago',
            type: 'feature'
        },
        {
            icon: Zap,
            title: 'Writing Tools Optimization',
            description: 'We\'ve refined the Writing Tools interface for better visibility and performance.',
            time: '5 hours ago',
            type: 'update'
        },
        {
            icon: Sparkles,
            title: 'New Feature: Deep Research',
            description: 'Use the Deep Research tool on the dashboard for more comprehensive study analysis.',
            time: 'Yesterday',
            type: 'feature'
        },
        {
            icon: Info,
            title: 'System Maintenance Complete',
            description: 'The Lanka AI servers have been updated to v2.6 for faster response times.',
            time: '2 days ago',
            type: 'system'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl">
                    <Bell size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Notifications</h1>
                    <p className="text-slate-500 font-medium">Stay updated with the latest from Lanka AI.</p>
                </div>
            </div>

            <div className="space-y-2">
                {notifications.map((n, i) => (
                    <NotificationItem key={i} {...n} />
                ))}
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-800">All caught up!</h2>
                    <p className="text-slate-500">Check back later for new updates.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
