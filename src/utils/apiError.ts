export function apiErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
        const message = error.message;
        try {
            const data: unknown = JSON.parse(message);
            if (typeof data === "object" && data !== null) {
                const record = data as Record<string, unknown>;
                if (typeof record.error === "string") return record.error;
                if (typeof record.detail === "string") return record.detail;
                for (const value of Object.values(record)) {
                    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
                    if (typeof value === "string") return value;
                }
            }
        } catch {
            return message;
        }
    }
    return fallback;
}