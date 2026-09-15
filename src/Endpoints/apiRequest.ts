import type { PaginationDTO } from "../Models/dto";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function paginationQuery({ el, page }: PaginationDTO): string {
    return `?el=${encodeURIComponent(el)}&page=${encodeURIComponent(page)}`;
}

export async function apiRequest<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
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