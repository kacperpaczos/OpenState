import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: () => '/poslowie',
}));

// Mock Redux hooks
const mockDispatch = jest.fn();
jest.mock('../../../lib/hooks', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: () => '',
}));

import Navbar from '@/components/navigation/Navbar';

describe('Navbar', () => {
    beforeEach(() => {
        mockDispatch.mockClear();
    });

    // 33. Contains link to /senatorowie
    it('contains a link to /senatorowie', () => {
        render(<Navbar />);
        const senatorLink = screen.getByText('Senatorowie');
        expect(senatorLink).toBeInTheDocument();
        expect(senatorLink.closest('a')).toHaveAttribute('href', '/senatorowie');
    });

    // 34. Contains link to /ustawy
    it('contains a link to /ustawy', () => {
        render(<Navbar />);
        const ustawyLink = screen.getByText('Ustawy');
        expect(ustawyLink).toBeInTheDocument();
        expect(ustawyLink.closest('a')).toHaveAttribute('href', '/ustawy');
    });

    // 35. Search input is visible
    it('has a search input', () => {
        render(<Navbar />);
        const input = screen.getByPlaceholderText('Szukaj...');
        expect(input).toBeInTheDocument();
    });

    // 36. Active page has active styling
    it('active page /poslowie has active styling', () => {
        render(<Navbar />);
        const activeLink = screen.getByText('Posłowie').closest('a');
        expect(activeLink?.className).toContain('bg-blue-100');
    });

    // 37. Inactive page does NOT have active styling
    it('inactive page does not have active styling', () => {
        render(<Navbar />);
        const inactiveLink = screen.getByText('Ustawy').closest('a');
        expect(inactiveLink?.className).not.toContain('bg-blue-100');
    });

    it('contains all expected nav links', () => {
        render(<Navbar />);
        const expectedLabels = ['Start', 'Ustawy', 'Posłowie', 'Senatorowie', 'Głosowania', 'Interpelacje', 'RCL'];
        for (const label of expectedLabels) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    });

    it('renders OpenState logo', () => {
        render(<Navbar />);
        expect(screen.getByText('OpenState')).toBeInTheDocument();
    });
});
