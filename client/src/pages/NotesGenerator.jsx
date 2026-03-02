import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    BookOpen,
    Sparkles,
    Upload,
    FileText,
    Search,
    Trash2,
    MessageSquare,
    Zap,
    ChevronRight,
    Loader2,
    Filter,
    XCircle
} from 'lucide-react';


const NotesGenerator = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState('Campus');
    const [error, setError] = useState(null);




    useEffect(() => {
        fetchNotes();
    }, []);

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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', level);
        formData.append('file', file);


        try {
            await noteService.uploadNote(formData);
            setFile(null);
            setTitle('');
            fetchNotes();
        } catch (err) {
            console.error('Upload failed:', err);
            const message = err.response?.data?.message || 'Analysis failed. Please try a different PDF or ensure it is not scanned/locked.';
            setError(message);
        } finally {
            setUploading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm(t('confirmDelete'))) return;

        try {
            await noteService.deleteNote(id);
            fetchNotes();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-widest mb-3">
                        <BookOpen size={14} />
                        <span>Document Management</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 leading-tight">
                        Study Hub
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Upload your PDFs and interact with them using Lanka AI.</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-full md:w-96">
                    <Search className="text-slate-400 ml-3" size={20} />
                    <input
                        type="text"
                        placeholder={t('searchDocs')}
                        className="w-full bg-transparent border-none py-2 px-2 focus:ring-0 outline-none font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white shadow-2xl overflow-hidden relative sticky top-6">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-100/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                        <h2 className="text-2xl font-display font-black text-slate-900 mb-8 flex items-center gap-3 relative uppercase tracking-tight">
                            <Upload className="text-primary-500 shadow-glow" size={24} />
                            {t('uploadNote')}
                        </h2>


                        {error && (
                            <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 flex items-start gap-4 animate-shake shadow-sm">
                                <div className="mt-0.5 shrink-0 bg-white p-1 rounded-lg">
                                    <XCircle size={18} />
                                </div>
                                <p className="text-xs font-black leading-relaxed uppercase tracking-wide">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleUpload} className="space-y-6 relative">

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">{t('docTitle')}</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Data Structures Lecture 4"
                                    className="w-full bg-white/50 border-2 border-slate-100 rounded-[2rem] px-8 py-5 focus:ring-8 ring-primary-500/5 focus:border-primary-400 outline-none transition-all font-bold text-sm shadow-sm"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>


                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">{t('academicLevel')}</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-white/50 border-2 border-slate-100 rounded-[2rem] px-8 py-5 focus:ring-8 ring-primary-500/5 focus:border-primary-400 outline-none transition-all font-black text-xs text-slate-700 appearance-none shadow-sm"
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                    >
                                        <option value="Campus">{t('campus')}</option>
                                        <option value="A/L">{t('alStudent')}</option>
                                        <option value="O/L">{t('olStudent')}</option>
                                        <option value="Other">{t('other')}</option>
                                    </select>
                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>


                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">{t('lecturePdf')}</label>
                                <div className="relative group/file">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                        id="file-upload"
                                        required
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer group bg-white/30"
                                    >
                                        <div className="bg-white p-5 rounded-2xl shadow-xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform border border-slate-50">
                                            <FileText className={file ? "text-primary-600" : "text-slate-300"} size={32} />
                                        </div>
                                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest text-center px-4">
                                            {file ? file.name : t('selectDoc')}
                                        </span>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2">{t('pdfLimit')}</p>
                                    </label>
                                </div>
                            </div>


                            <button
                                type="submit"
                                disabled={uploading || !file || !title}
                                className="w-full bg-primary-600 text-white rounded-2xl py-5 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none mt-4"
                            >
                                {uploading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={16} />
                                        <span>{t('analyzePdf')}</span>
                                    </div>
                                ) : t('uploadIndex')}
                            </button>

                        </form>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                            <Loader2 className="animate-spin text-primary-600 mb-4" size={48} />
                            <p className="font-bold uppercase tracking-widest text-xs">{t('loadingLibrary')}</p>
                        </div>

                    ) : filteredNotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredNotes.map((note) => (
                                <div
                                    key={note._id}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full animate-slide-up"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform">
                                            <FileText size={32} />
                                        </div>
                                        <button
                                            onClick={() => handleDelete(note._id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mb-8 flex-1">
                                        <h3 className="text-xl font-display font-bold text-slate-900 leading-tight mb-2 truncate" title={note.title}>
                                            {note.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                            <Filter size={12} className="text-primary-400" />
                                            <span>{note.category || 'Science'}</span>
                                            <span className="mx-2 opacity-30">•</span>
                                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => navigate(`/document/${note._id}?tab=chat`)}
                                                className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-3.5 rounded-2xl text-xs font-bold hover:bg-purple-100 transition-all border border-purple-100"
                                            >
                                                <MessageSquare size={16} />
                                                {t('chat')}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/document/${note._id}?tab=summary`)}
                                                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3.5 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
                                            >
                                                <BookOpen size={16} />
                                                {t('summary')}
                                            </button>

                                        </div>
                                        <button
                                            onClick={() => navigate(`/document/${note._id}?tab=quiz`)}
                                            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-lg active:scale-95 group"
                                        >
                                            <Zap size={16} className="text-amber-400" />
                                            {t('generateQuiz')}
                                            <ChevronRight size={16} className="opacity-30 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="bg-white w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <BookOpen size={48} />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">{t('libraryEmpty')}</h3>
                            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-8 font-medium">
                                {t('startUploading')}
                            </p>

                            <div className="animate-bounce">
                                <ChevronRight size={32} className="rotate-90 text-primary-400 mx-auto" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesGenerator;
