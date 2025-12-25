import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { AuthState, User } from '@/types/auth';

interface AuthContextType extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Map 'username' claim to 'uuid' property as strict User type requires it
                const user: User = {
                    uuid: decoded.username,
                }; // Type assertion might be needed if User is strictly generated
                setState({ user, token, isAuthenticated: true, isLoading: false });
            } catch (error) {
                localStorage.removeItem('token');
                setState(prev => ({ ...prev, isLoading: false, user: null, token: null, isAuthenticated: false }));
            }
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        try {
            const decoded: any = jwtDecode(token);
            const user: User = {
                uuid: decoded.username
            };
            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (e) {
            console.error("Login failed to decode token", e);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
