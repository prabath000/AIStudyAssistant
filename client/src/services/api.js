import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
    register: async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password });
        if (response.data) localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        if (response.data) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const newUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        }
        return response.data;
    },
    deleteAccount: async () => {
        const response = await api.delete('/auth/account');
        localStorage.removeItem('user');
        return response.data;
    }
};

export const noteService = {
    uploadNote: async (formData) => {
        const response = await api.post('/notes/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getNotes: async () => {
        const response = await api.get('/notes');
        return response.data;
    },
    deleteNote: async (id) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    }
};

export const aiService = {
    summarize: async (noteId) => {
        const response = await api.post(`/ai/summarize/${noteId}`);
        return response.data;
    },
    generateQuiz: async (noteId) => {
        const response = await api.post(`/ai/quiz/${noteId}`);
        return response.data;
    },
    generatePlan: async (noteId) => {
        const response = await api.post(`/ai/plan/${noteId}`);
        return response.data;
    },
    chat: async (history, message, noteId) => {
        const response = await api.post('/ai/chat', { history, message, noteId });
        return response.data;
    },

    generateNotes: async (topic) => {
        const response = await api.post('/ai/generate-notes', { topic });
        return response.data;
    },
    generateQuizTopic: async (subject, topic, count) => {
        const response = await api.post('/ai/generate-quiz', { subject, topic, count });
        return response.data;
    },
    generateStudyPlanTopic: async (examDate, subjects) => {
        const response = await api.post('/ai/study-plan', { examDate, subjects });
        return response.data;
    },
    processWritingTask: async (taskType, content) => {
        const response = await api.post('/ai/writing-task', { taskType, content });
        return response.data;
    }
};

