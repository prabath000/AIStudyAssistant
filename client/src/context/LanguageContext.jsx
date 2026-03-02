import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        home: 'Home',
        dashboard: 'Dashboard',
        studyHub: 'Study Hub',
        practiceQuiz: 'Practice Quiz',
        studyPlanner: 'Study Planner',
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
        generateQuiz: 'Generate AI Quiz',
        studyHubDesc: 'Analyze lecture notes, offer insights, and manage study materials — all in sync.',
        generalChat: 'General Chat',
        generalChatDesc: 'Stay connected, share academic ideas, and align study goals effortlessly with AI.',
        assessment: 'Assessment',
        assessmentDesc: 'Organize your practice sessions efficiently, set priorities, and stay focused.',
        askAnything: 'Ask anything: "Explain machine learning in simple terms"',
        myStudyMaterials: 'My Study Materials',
        viewAll: 'View All',
        noDocsYet: 'No documents yet',
        uploadFirst: 'Upload your first PDF to start your AI study journey.',
        getStarted: 'Get Started',
        unlockPro: 'Unlock more with Pro Plan',
        heyThere: 'Hey there! 👋',
        needBoost: 'Need a boost?',
        aiChatTutor: 'AI Chat Tutor',
        aiChatTutorDesc: 'Personalized tutor for Science, Maths, ICT and more. Ask in English or Sinhala.',
        uploadCenter: 'Upload Center',
        uploadCenterDesc: 'Upload your PDFs and generate structured summaries and exam notes.',
        quizGen: 'Quiz Gen',
        quizGenDesc: 'Test your understanding with AI-curated MCQs tailored to your specific lessons.',
        plannerDesc: 'Build a high-performance roadmap leading up to your exam dates.',
        docManagement: 'Document Management',
        searchDocs: 'Search your documents...',
        campus: 'Campus / University',
        alStudent: 'A/L Student',
        olStudent: 'O/L Student',
        other: 'Other / Professional',
        lecturePdf: 'Lecture PDF',
        pdfLimit: 'PDF files up to 10MB',
        confirmDelete: 'Are you sure you want to delete this document?'
    },
    si: {
        home: 'මුල් පිටුව',
        dashboard: 'දත්ත පුවරුව',
        studyHub: 'අධ්‍යයන මධ්‍යස්ථානය',
        practiceQuiz: 'පුහුණු ප්‍රශ්නාවලිය',
        studyPlanner: 'අධ්‍යයන සැලසුම්කරු',
        notifications: 'නිවේදන',
        support: 'සහාය',
        settings: 'සැකසුම්',
        logout: 'පිටවීම',
        search: 'සොයන්න',
        upgrade: 'යාවත්කාලීන කරන්න',
        dailyFocus: 'දෛනික අවධානය',
        hi: 'ආයුබෝවන්',
        ready: 'විශිෂ්ට දේවල් සාක්ෂාත් කර ගැනීමට සූදානම්ද?',
        academicHub: 'අධ්‍යයන විශිෂ්ඨතා මධ්‍යස්ථානය',
        poweredBy: 'Lanka AI v2.6 මගින් බල ගැන්වේ',
        deepResearch: 'ගැඹුරු පර්යේෂණ',
        makeImage: 'රූපයක් සාදන්න',
        createMusic: 'සංගීතය සාදන්න',
        selectDoc: 'ලේඛනය තෝරන්න',
        uploadNote: 'දේශනය උඩුගත කරන්න',
        docTitle: 'ලේඛන මාතෘකාව',
        academicLevel: 'අධ්‍යයන මට්ටම',
        analyzePdf: 'PDF විශ්ලේෂණය කරයි...',
        uploadIndex: 'උඩුගත කර සුචිගත කරන්න',
        libraryEmpty: 'ඔබේ පුස්තකාලය හිස් ය',
        startUploading: 'AI මගින් බල ගැන්වෙන ඉගෙනීම අගුළු හැරීමට ඔබගේ අධ්‍යයන ද්‍රව්‍ය (විද්‍යාව, ගණිතය, තොරතුරු තාක්ෂණය, ආදිය) උඩුගත කිරීමෙන් ආරම්භ කරන්න.',
        loadingLibrary: 'පුස්තකාලය පූරණය වෙමින් පවතී...',
        science: 'විද්‍යාව',
        chat: 'සංවාදය',
        summary: 'සාරාංශය',
        generateQuiz: 'AI ප්‍රශ්නාවලිය සාදන්න',
        studyHubDesc: 'දේශන සටහන් විශ්ලේෂණය කරන්න, අවබෝධය ලබා ගන්න, සහ අධ්‍යයන ද්‍රව්‍ය කළමනාකරණය කරන්න.',
        generalChat: 'පොදු සංවාදය',
        generalChatDesc: 'සම්බන්ධ වී සිටින්න, අධ්‍යයන අදහස් බෙදා ගන්න, සහ AI සමඟින් අධ්‍යයන ඉලක්ක සපුරා ගන්න.',
        assessment: 'ඇගයීම',
        assessmentDesc: 'ඔබේ පුහුණු සැසි කාර්යක්ෂමව සංවිධානය කරන්න, ප්‍රමුඛතා සකසන්න, සහ අවධානය යොමු කරන්න.',
        askAnything: 'ඕනෑම දෙයක් අසන්න: "සරල වචන වලින් මැෂින් ලර්නින් ගැන පැහැදිලි කරන්න"',
        myStudyMaterials: 'මගේ අධ්‍යයන ද්‍රව්‍ය',
        viewAll: 'සියල්ල බලන්න',
        noDocsYet: 'තමත් ලේඛන කිසිවක් නැත',
        uploadFirst: 'ඔබේ AI අධ්‍යයන ගමන ආරම්භ කිරීමට ඔබේ පළමු PDF එක උඩුගත කරන්න.',
        getStarted: 'ආරම්භ කරන්න',
        unlockPro: 'Pro Plan සමඟින් තවත් දේ අගුළු හරින්න',
        heyThere: 'ආයුබෝවන්! 👋',
        needBoost: 'උදව්වක් අවශ්‍යද?',
        aiChatTutor: 'AI සංවාද උපදේශක',
        aiChatTutorDesc: 'විද්‍යාව, ගණිතය, තොරතුරු තාක්ෂණය සහ තවත් දේ සඳහා පුද්ගලික උපදේශක. ඉංග්‍රීසි හෝ සිංහලෙන් අසන්න.',
        uploadCenter: 'උඩුගත කිරීමේ මධ්‍යස්ථානය',
        uploadCenterDesc: 'ඔබේ PDF උඩුගත කර පද්ධතිගත සාරාංශ සහ විභාග සටහන් සාදන්න.',
        quizGen: 'ප්‍රශ්නාවලිය සාදන්න',
        quizGenDesc: 'ඔබේ නිශ්චිත පාඩම් වලට ගැලපෙන පරිදි AI විසින් සකස් කරන ලද MCQs සමඟ ඔබේ අවබෝධය පරීක්ෂා කරන්න.',
        plannerDesc: 'ඔබේ විභාග දිනයන් කරා යන ඉහළ කාර්ය සාධන මාර්ග සිතියමක් සාදන්න.',
        docManagement: 'ලේඛන කළමනාකරණය',
        searchDocs: 'ඔබේ ලේඛන සොයන්න...',
        campus: 'කැම්පස් / විශ්වවිද්‍යාලය',
        alStudent: 'A/L ශිෂ්‍යයා',
        olStudent: 'O/L ශිෂ්‍යයා',
        other: 'වෙනත් / වෘත්තීය',
        lecturePdf: 'දේශන PDF ගොනුව',
        pdfLimit: 'PDF ගොනු උපරිම 10MB',
        confirmDelete: 'මෙම ලේඛනය මකා දැමීමට ඔබට විශ්වාසද?'
    }



};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'si' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
