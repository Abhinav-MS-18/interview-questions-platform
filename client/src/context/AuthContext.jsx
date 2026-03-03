import { createContext, useContext, useState, useCallback } from 'react';
import { adminLogin as loginAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isAuthenticated = !!token;

    const login = useCallback(async (username, password) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await loginAPI({ username, password });
            localStorage.setItem('adminToken', data.token);
            setToken(data.token);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('adminToken');
        setToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
