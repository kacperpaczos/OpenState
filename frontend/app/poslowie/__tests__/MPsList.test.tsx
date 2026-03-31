/**
 * MPsList Integration Tests (tests 51-56)
 * Tests the full flow of search, filters, and load more with a real Redux store.
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
    createMockMP({ id: '1', name: 'Jan Kowalski', club: 'KO', district: 'Warszawa', chamber: 'Sejm' }),
    createMockMP({ id: '2', name: 'Anna Nowak', club: 'PiS', district: 'Kraków', chamber: 'Sejm' }),
    createMockMP({ id: '3', name: 'Piotr Wiśniewski', club: 'KO', district: 'Gdańsk', chamber: 'Senat' }),
    createMockMP({ id: '4', name: 'Maria Zielińska', club: 'Lewica', district: 'Łódź', chamber: 'Sejm', active: false }),
];

describe('MPsList Integration', () => {
    // 51. Global search filters by name
    it('globalSearch filters by name', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />, 'Kowalski');
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
        expect(screen.queryByText('Anna Nowak')).not.toBeInTheDocument();
    });

    // 52. Global search filters by club
    it('globalSearch filters by club', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />, 'PiS');
        expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
        expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
    });

    // 53. "Senat" filter hides MPs
    it('clicking "Senat" shows only senators', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />);
        fireEvent.click(screen.getByText('Senat'));
        expect(screen.getByText('Piotr Wiśniewski')).toBeInTheDocument();
        expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
    });

    // 54. "Sejm" filter hides senators
    it('clicking "Sejm" shows only MPs', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />);
        fireEvent.click(screen.getByText('Sejm'));
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
        expect(screen.queryByText('Piotr Wiśniewski')).not.toBeInTheDocument();
    });

    // 55. Load More increases visible count
    it('"Pokaż więcej" increases visible count', () => {
        const manyMPs = Array.from({ length: 150 }, (_, i) =>
            createMockMP({ id: String(i), name: `Poseł ${i}` })
        );
        renderWithStore(<MPsList initialMPs={manyMPs} />);

        const btn = screen.getByText(/Pokaż więcej/);
        expect(btn).toBeInTheDocument();

        fireEvent.click(btn);
        expect(screen.queryByText(/Pokaż więcej/)).not.toBeInTheDocument();
    });

    // 56. Double Load More shows all
    it('clicking "Pokaż więcej" twice shows all MPs', () => {
        const manyMPs = Array.from({ length: 250 }, (_, i) =>
            createMockMP({ id: String(i), name: `Poseł ${i}` })
        );
        renderWithStore(<MPsList initialMPs={manyMPs} />);

        fireEvent.click(screen.getByText(/Pokaż więcej/));
        // After first click: 200 visible, 50 remain
        expect(screen.getByText(/Pokaż więcej/)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Pokaż więcej/));
        // After second click: all 250 visible
        expect(screen.queryByText(/Pokaż więcej/)).not.toBeInTheDocument();
    });

    // Extra: "Wszyscy" shows all after filter
    it('"Wszyscy" resets chamber filter', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />);
        fireEvent.click(screen.getByText('Senat'));
        expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Wszyscy'));
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
        expect(screen.getByText('Piotr Wiśniewski')).toBeInTheDocument();
    });

    // Extra: MPCard links correctly for Sejm
    it('Sejm MP card links to /poslowie/[id]', () => {
        renderWithStore(<MPsList initialMPs={[mockMPs[0]]} />);
        const link = screen.getByText('Jan Kowalski').closest('a');
        expect(link).toHaveAttribute('href', '/poslowie/1');
    });

    // Extra: MPCard links correctly for Senat
    it('Senat MP card links to /senatorowie/[id]', () => {
        renderWithStore(<MPsList initialMPs={[mockMPs[2]]} />);
        const link = screen.getByText('Piotr Wiśniewski').closest('a');
        expect(link).toHaveAttribute('href', '/senatorowie/3');
    });

    // Extra: Empty state message
    it('shows empty message when no results match', () => {
        renderWithStore(<MPsList initialMPs={mockMPs} />, 'zzznonexistent');
        expect(screen.getByText('Nie znaleziono parlamentarzystów.')).toBeInTheDocument();
    });
});
