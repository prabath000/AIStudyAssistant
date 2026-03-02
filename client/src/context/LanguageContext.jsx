import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        home: 'Home',
        dashboard: 'Dashboard',
        studyHub: 'Study Hub',
        notifications: 'Notifications',
        support: 'Support',
        settings: 'Settings',
        logout: 'Logout',
        search: 'Search',
        upgrade: 'Upgrade',
        dailyFocus: 'Daily Focus',
        hi: 'Hi',
        ready: 'Ready to Achieve Great Things?',
        academicHub: 'Academic Excellence Hub',
        poweredBy: 'Powered by Lanka AI v2.6',
        deepResearch: 'Deep Research',
        makeImage: 'Make an Image',
        createMusic: 'Create music',
        selectDoc: 'Select Document',
        uploadNote: 'Upload Lecture',
        docTitle: 'Document Title',
        academicLevel: 'Academic Level',
        analyzePdf: 'Analyzing PDF...',
        uploadIndex: 'Upload and Index',
        libraryEmpty: 'Your Library is Empty',
        startUploading: 'Start by uploading your study materials (Science, Maths, ICT, etc.) to unlock AI-powered learning.',
        loadingLibrary: 'Loading Library...',
        science: 'Science',
        chat: 'Chat',
        summary: 'Summary',
        studyHubDesc: 'Analyze lecture notes, offer insights, and manage study materials — all in sync.',
        generalChat: 'General Chat',
        generalChatDesc: 'Stay connected, share academic ideas, and align study goals effortlessly with AI.',
        askAnything: 'Ask anything: "Explain machine learning in simple terms"',
        myStudyMaterials: 'My Study Materials',
        viewAll: 'View All',
        noDocsYet: 'No documents yet',
        uploadFirst: 'Upload your first PDF to start your AI study journey.',
        getStarted: 'Get Started',
        unlockPro: 'Unlock more with Pro Plan',
        heyThere: 'Hey there! 👋',
        needBoost: 'Need a boost?',
        aiChatTutor: 'AI Chatbot',
        aiChatTutorDesc: 'Your personalized AI Assistant for studies and writing.',
        uploadCenter: 'Upload Center',
        uploadCenterDesc: 'Upload your PDFs and generate structured summaries and exam notes.',
        docManagement: 'Document Management',
        searchDocs: 'Search your documents...',
        campus: 'Campus / University',
        alStudent: 'A/L Student',
        olStudent: 'O/L Student',
        other: 'Other / Professional',
        lecturePdf: 'Lecture PDF',
        pdfLimit: 'PDF files up to 10MB',
        confirmDelete: 'Are you sure you want to delete this document?',
        writingTools: 'Writing Tools',
        translator: 'Translator',
        assessment: 'Assessment',
        assessmentDesc: 'Test your knowledge with AI-powered assessment',
        quizGen: 'Quiz Generator',
        quizGenDesc: 'Generate interactive quizzes from your study topics.',
        studyPlanner: 'Study Planner',
        plannerDesc: 'AI-Powered Study Timetable Generator',
        generateQuiz: 'Generate Quiz'
    }
};

export const LanguageProvider = ({ children }) => {
    const language = 'en';

    useEffect(() => {
        document.documentElement.lang = language;
        const savedScale = localStorage.getItem('ui-scale');
        if (savedScale) {
            document.documentElement.style.setProperty('--ui-scale', savedScale);
        }
    }, []);

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
