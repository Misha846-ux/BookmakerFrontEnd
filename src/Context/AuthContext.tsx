import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    birthday: string | null;
    photo: string | null;
    ampthill: string;
    city: number | null;
    country: number | null;
    currency: number | null;
    payMethod: number | null;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    sendAuthCode: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    verifyAccount: (email: string, code: string) => Promise<void>;
    loginWithGoogle: (googleAccessToken: string) => Promise<void>;
    logout: () => void;
    updateUserProfile: (profile: Record<string, unknown>) => Promise<void>;
    refreshUser: () => Promise<User | null>;
    previousPath: string | null;
    setPreviousPath: (path: string) => void;
};

function parseErrorMessage(data: unknown, fallback: string): string {
    if (typeof data === "string" && data) return data;
    if (typeof data !== "object" || data === null) return fallback;

    const record = data as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.detail === "string") return record.detail;

    const errorGroups: unknown[] = [record.errors, record];
    for (const group of errorGroups) {
        if (typeof group !== "object" || group === null) continue;
        for (const value of Object.values(group as Record<string, unknown>)) {
            if (Array.isArray(value) && typeof value[0] === "string") return value[0];
            if (typeof value === "string" && value) return value;
        }
    }
    return fallback;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = import.meta.env.VITE_API_URL;

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${API_BASE}/user/token/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (res.ok) {
            const data = await res.json();

            localStorage.setItem('accessToken', data.access);
            if (data.refresh) {
                localStorage.setItem('refreshToken', data.refresh);
            }
            return true;
        }
    } catch {
        // ignore
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previousPath, setPreviousPath] = useState<string | null>(null);

    const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
        try {
            let res = await fetch(`${API_BASE}/user/me/`, {
                headers: authHeaders(),
            });

            if (res.status === 401) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    res = await fetch(`${API_BASE}/user/me/`, {
                        headers: authHeaders(),
                    });
                }
            }

            if (res.ok) {
                return await res.json();
            }
        } catch {
            // ignore
        }
        return null;
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }
        fetchCurrentUser().then((u) => {
            setUser(u);
            if (!u) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }).finally(() => setIsLoading(false));
    }, [fetchCurrentUser]);

    const storeTokens = (access: string, refresh: string) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        storeTokens(data.access, data.refresh);
        const u = await fetchCurrentUser();
        setUser(u);
    };

    const sendAuthCode = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/user/sendAuthCode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send auth code');
    };

    const register = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/user/createAccount`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
    };

    const verifyAccount = async (email: string, code: string) => {
        const res = await fetch(`${API_BASE}/user/verifyAccount`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
    };

    const loginWithGoogle = async (googleAccessToken: string) => {
        const res = await fetch(`${API_BASE}/user/google/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: googleAccessToken }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Google login failed');
        storeTokens(data.access, data.refresh);
        const u = await fetchCurrentUser();
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    const updateUserProfile = async (profile: Record<string, unknown>) => {
        if (!user) throw new Error('Not authenticated');
        let res = await fetch(`${API_BASE}/user/${user.id}/profile`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(profile),
        });
        if (res.status === 401) {
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                res = await fetch(`${API_BASE}/user/${user.id}/profile`, {
                    method: 'PATCH',
                    headers: authHeaders(),
                    body: JSON.stringify(profile),
                });
            }
        }
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(parseErrorMessage(data, 'Failed to update profile'));
        const u = await fetchCurrentUser();
        setUser(u);
    };

    const refreshUser = async (): Promise<User | null> => {
        const u = await fetchCurrentUser();
        setUser(u);
        return u;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            sendAuthCode,
            register,
            verifyAccount,
            loginWithGoogle,
            logout,
            updateUserProfile,
            refreshUser,
            previousPath,
            setPreviousPath,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
