import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginContent, registerContent } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('user_email');
        if (token && email) {
            setUser({ email });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginContent(email, password);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_email', email);
        setUser({ email });
    };

    const register = async (email, password) => {
        await registerContent(email, password);
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
