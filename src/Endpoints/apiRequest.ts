import type { PaginationDTO } from "../Models/dto";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function paginationQuery({ el, page }: PaginationDTO): string {
    return `?el=${encodeURIComponent(el)}&page=${encodeURIComponent(page)}`;
}

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
}

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${API_BASE_URL}/user/token/refresh`, {
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

export async function apiRequest<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const authHeaders = getAuthHeaders();
    const mergedHeaders: Record<string, string> = {
        ...(options?.headers as Record<string, string> || {}),
        ...authHeaders,
    };

    let response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: mergedHeaders,
    });

    if (response.status === 401 && localStorage.getItem('refreshToken')) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            const newAuthHeaders = getAuthHeaders();
            response = await fetch(`${API_BASE_URL}${path}`, {
                ...options,
                headers: {
                    ...(options?.headers as Record<string, string> || {}),
                    ...newAuthHeaders,
                },
            });
        }
    }

    const responseText = await response.text();
    let data: unknown = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "object" && data !== null
                ? JSON.stringify(data)
                : String(data || `Request failed with status ${response.status}`),
        );
    }

    return data as T;
}

export function jsonBody<T>(data: T): RequestInit {
    return {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
}
