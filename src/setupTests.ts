import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: () => new Promise(() => { }),
            language: 'en',
            on: () => { },
            off: () => { }
        },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    },
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));
