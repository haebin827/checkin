import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await AuthService.getCurrentSession();
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                // Check if there's a temporary user in localStorage
                const tempUser = sessionStorage.getItem('tempUser');
                if (tempUser) {
                    setUser(JSON.parse(tempUser));
                } else {
                    setUser(null);
                }
            }
        } catch (err) {
            console.error('Session check failed:', err);
            
            // Check if there's a temporary user in localStorage
            const tempUser = sessionStorage.getItem('tempUser');
            if (tempUser) {
                setUser(JSON.parse(tempUser));
            } else {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Calculate isAuthenticated based on user state
    const isAuthenticated = !!user;

    const value = { 
        user, 
        loading, 
        checkSession, 
        isAuthenticated 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};