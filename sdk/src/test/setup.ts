import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, fallback: string) => fallback || key,
        i18n: {
            changeLanguage: () => Promise.resolve(),
            language: 'en',
            addResourceBundle: vi.fn(),
        },
    }),
    Trans: ({ children }: any) => children,
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    },
}));
