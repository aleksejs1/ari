import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { type Contact, type ContactFormValues } from "@/types/models";

interface HydraCollection<T> {
    "hydra:member": T[];
    "hydra:totalItems"?: number;
    "hydra:view"?: {
        "hydra:first": string;
        "hydra:last": string;
        "hydra:next"?: string;
        "hydra:previous"?: string;
    };
    member?: T[]; // Fallback for pure JSON response from OpenAPI schema
    view?: unknown;
    [key: string]: unknown;
}

export function useContacts(page = 1) {
    return useQuery({
        queryKey: ["contacts", page],
        queryFn: async () => {
            const response = await api.get<HydraCollection<Contact>>(`/contacts?page=${page}`);
            return response.data;
        },
    });
}

export function useCreateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ContactFormValues) => {
            // API Platform usually handles nested resources creation if Cascade Persist is on
            // Otherwise, might need to create Contact then POST names/dates.
            // Assuming standard POST /api/contacts accepts names/dates
            const response = await api.post("/contacts", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

export function useUpdateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ContactFormValues }) => {
            const url = id.startsWith('/api') ? id.substring(4) : id;
            const response = await api.put(url, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => { // id is IRI
            const url = id.startsWith('/api') ? id.substring(4) : id;
            await api.delete(url);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}
