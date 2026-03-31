import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
        get theme() { return store['theme']; },
        set theme(v: string) { store['theme'] = v; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: true, // default to dark
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }))
});

describe('ThemeToggle', () => {
    beforeEach(() => {
        document.documentElement.classList.add('dark');
        localStorageMock.theme = 'dark';
    });

    // 31. Clicking toggles the dark class
    it('clicking toggles `dark` class on <html>', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        fireEvent.click(button);
        expect(document.documentElement.classList.contains('dark')).toBe(false);

        fireEvent.click(button);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // 32. Does NOT call style.setProperty
    it('does NOT manually set CSS custom properties', () => {
        const spy = jest.spyOn(document.documentElement.style, 'setProperty');
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle theme/i });
        fireEvent.click(button);
        fireEvent.click(button);
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
