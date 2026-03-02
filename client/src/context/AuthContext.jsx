import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) setUser(storedUser);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data);
        return data;
    };

    const register = async (username, email, password) => {
        const data = await authService.register(username, email, password);
        setUser(data);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const loginWithData = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, loginWithData, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
