/**
 * MPsList Integration Tests
 * Tests search, load-more, and MP card links.
 * Note: chamber toggle was removed — /poslowie now shows only Sejm MPs.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import billsReducer from '@/lib/features/bills/billsSlice';
import searchReducer, { setGlobalSearch } from '@/lib/features/search/searchSlice';
import MPsList from '@/app/poslowie/MPsList';

jest.mock('next/link', () => {
    return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

const createMockMP = (overrides: Record<string, any> = {}) => ({
    id: '1',
    name: 'Jan Kowalski',
    firstLastName: 'Kowalski Jan',
    club: 'KO',
    district: 'Warszawa',
    email: 'jan@test.pl',
    active: true,
    photoUrl: '',
    chamber: 'Sejm' as const,
    ...overrides,
});

function renderWithStore(ui: React.ReactElement, preloadedSearch = '') {
    const store = configureStore({
        reducer: { bills: billsReducer, search: searchReducer },
    });
    if (preloadedSearch) {
        store.dispatch(setGlobalSearch(preloadedSearch));
    }
    return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}

const mockMPs = [
    createMockMP({ id: '1', name: 'Jan Kowalski', club: 'KO', district: 'Warszawa' }),
    createMockMP({ id: '2', name: 'Anna Nowak', club: 'PiS', district: 'Krakow' }),
    createMockMP({ id: '3', name: 'Piotr Wisniewski', club: 'KO', district: 'Gdansk', chamber: 'Senat' }),
    createMockMP({ id: '4', name: 'Maria Zielinska', club: 'Lewica', district: 'Lodz', active: false }),
];

describe('MPsList Integration', () => {
    // Search
    it('globalSearch filters by name', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />, 'Kowalski');
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
        expect(screen.queryByText('Anna Nowak')).not.toBeInTheDocument();
    });

    it('globalSearch filters by club', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />, 'PiS');
        expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
        expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
    });

    // Heading / rendering
    it('shows Poslowie heading', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />);
        expect(screen.getByRole('heading', { name: /Pos/i })).toBeInTheDocument();
    });

    it('renders all MPs passed in', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />);
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
        expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
    });

    it('renders inactive MP without crashing', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />);
        expect(screen.getByText('Maria Zielinska')).toBeInTheDocument();
    });

    // Load more
    it('"Pokaz wiecej" increases visible count', () => {
        const manyMPs = Array.from({ length: 150 }, (_, i) =>
            createMockMP({ id: String(i), name: `Posel ${i}` })
        );
        renderWithStore(<MPsList initialMPs={manyMPs} />);

        const btn = screen.getByText(/Poka/);
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(screen.queryByText(/Poka/)).not.toBeInTheDocument();
    });

    it('clicking load more twice shows all MPs', () => {
        const manyMPs = Array.from({ length: 250 }, (_, i) =>
            createMockMP({ id: String(i), name: `Posel ${i}` })
        );
        renderWithStore(<MPsList initialMPs={manyMPs} />);

        fireEvent.click(screen.getByText(/Poka/));
        expect(screen.getByText(/Poka/)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Poka/));
        expect(screen.queryByText(/Poka/)).not.toBeInTheDocument();
    });

    // Card links
    it('Sejm MP card links to /poslowie/[id]', () => {
        renderWithStore(<MPsList initialMPs={[mockMPs[0]]} />);
        const link = screen.getByText('Jan Kowalski').closest('a');
        expect(link).toHaveAttribute('href', '/poslowie/1');
    });

    it('Senat MP card links to /senatorowie/[id]', () => {
        renderWithStore(<MPsList initialMPs={[mockMPs[2]]} />);
        const link = screen.getByText('Piotr Wisniewski').closest('a');
        expect(link).toHaveAttribute('href', '/senatorowie/3');
    });

    // Empty state
    it('shows empty message when no results match', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />, 'zzznonexistent');
        expect(screen.getByText(/Nie znaleziono/i)).toBeInTheDocument();
    });
});
