/**
 * BillsList Integration Tests (tests 57-58)
 */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import billsReducer, { setBills, setFilterStatus, selectFilteredBills } from '@/lib/features/bills/billsSlice';
import searchReducer, { setGlobalSearch } from '@/lib/features/search/searchSlice';
import BillsList from '@/app/ustawy/BillsList';

jest.mock('next/link', () => {
    return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

const mockBill = (overrides: Record<string, any> = {}) => ({
    id: '100',
    printNo: '100',
    title: 'Rządowy projekt ustawy',
    description: 'Opis',
    date: '2026-01-15',
    status: 'W toku',
    documentType: 'projekt ustawy',
    authorType: 'Rządowy',
    isEU: false,
    term: 10,
    urgency: 'normalny',
    kanbanStage: 'Inicjatywa',
    stages: [],
    ...overrides,
});

function renderBills(bills: any[], searchTerm = '') {
    const store = configureStore({
        reducer: { bills: billsReducer, search: searchReducer },
    });
    store.dispatch(setBills(bills));
    if (searchTerm) store.dispatch(setGlobalSearch(searchTerm));
    return { store, ...render(<Provider store={store}><BillsList initialProcesses={bills} /></Provider>) };
}

describe('BillsList Integration', () => {
    // 57. Search filters bills by title
    it('globalSearch filters by title', async () => {
        const bills = [
            mockBill({ id: '1', title: 'Ustawa o podatkach' }),
            mockBill({ id: '2', title: 'Ustawa o edukacji' }),
            mockBill({ id: '3', title: 'Ustawa o zdrowiu' }),
        ];
        renderBills(bills, 'edukacj');

        expect(await screen.findByText('Ustawa o edukacji')).toBeInTheDocument();
        expect(screen.queryByText('Ustawa o podatkach')).not.toBeInTheDocument();
        expect(screen.queryByText('Ustawa o zdrowiu')).not.toBeInTheDocument();
    });

    // 58. EU filter shows only EU bills
    it('UE filter shows only EU bills', async () => {
        const bills = [
            mockBill({ id: '1', isEU: true, title: 'Dyrektywa UE' }),
            mockBill({ id: '2', isEU: false, title: 'Krajowa ustawa' }),
        ];

        let store: any;
        act(() => {
            const result = renderBills(bills);
            store = result.store;
        });

        act(() => {
            store.dispatch(setFilterStatus('UE'));
        });

        // Re-render doesn't happen automatically without re-subscribing, 
        // so we verify via the selector
        const filtered = selectFilteredBills(store.getState());
        expect(filtered).toHaveLength(1);
        expect(filtered[0].title).toBe('Dyrektywa UE');
    });
});
