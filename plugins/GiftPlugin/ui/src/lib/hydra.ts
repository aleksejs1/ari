export const getHydraMember = (collection: any, key?: any) => [];
export type HydraCollection<T> = {
    'hydra:member': T[];
    'hydra:totalItems': number;
    'hydra:view'?: {
        'hydra:first'?: string;
        'hydra:last'?: string;
        'hydra:next'?: string;
        'hydra:previous'?: string;
    };
};
