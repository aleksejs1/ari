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

// Mock @ari/plugin-sdk to avoid issues with uninitialized state if needed
// But we want to keep UI components real, so we only mock the hooks/context if necessary.
// For now, let's just make sure react-i18next is covered as it's the main culprit.
