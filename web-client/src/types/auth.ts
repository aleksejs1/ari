import type { components } from "./schema";

export type User = components["schemas"]["User-user.read"];

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    token: string;
}
