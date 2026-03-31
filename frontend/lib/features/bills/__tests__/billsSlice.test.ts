import reducer, { setBills, setFilterStatus, selectFilteredBills, selectBills, selectFilter } from '../billsSlice';
import { makeStore } from '@/lib/store';
import { setGlobalSearch } from '@/lib/features/search/searchSlice';

const mockBill = (overrides: Record<string, any> = {}) => ({
    id: '100',
    printNo: '100',
    title: 'Rządowy projekt ustawy o zmianie ustawy',
    description: 'Opis projektu',
    date: '2026-01-15',
    status: 'W toku',
    documentType: 'projekt ustawy',
    authorType: 'Rządowy',
    isEU: false,
    term: 10,
    urgency: 'normalny',
    kanbanStage: 'Inicjatywa',
    eli: 'eli-100',
    stages: [],
    ...overrides,
});

const initialState = {
    items: [] as any[],
    status: 'idle' as const,
    filter: { status: 'all' },
};

describe('billsSlice reducers', () => {
    // 1. setBills sets items
    it('setBills sets items and marks status as succeeded', () => {
        const bills = [mockBill()];
        const state = reducer(initialState, setBills(bills as any));
        expect(state.items).toEqual(bills);
        expect(state.status).toBe('succeeded');
    });

    // 2. setBills with empty array
    it('setBills with empty array sets items to [] and status to succeeded', () => {
        const state = reducer(initialState, setBills([]));
        expect(state.items).toEqual([]);
        expect(state.status).toBe('succeeded');
    });

    // 3. setFilterStatus('UE')
    it('setFilterStatus sets filter.status to UE', () => {
        const state = reducer(initialState, setFilterStatus('UE'));
        expect(state.filter.status).toBe('UE');
    });

    // 4. setFilterStatus back to 'all'
    it('setFilterStatus resets back to all', () => {
        let state = reducer(initialState, setFilterStatus('UE'));
        state = reducer(state, setFilterStatus('all'));
        expect(state.filter.status).toBe('all');
    });
});

describe('billsSlice selectors', () => {
    // 5. selectFilteredBills — no search
    it('selectFilteredBills returns all bills when no search', () => {
        const store = makeStore();
        store.dispatch(setBills([mockBill({ id: '1' }), mockBill({ id: '2' })] as any));
        expect(selectFilteredBills(store.getState())).toHaveLength(2);
    });

    // 6. selectFilteredBills — search by title
    it('selectFilteredBills filters by title', () => {
        const store = makeStore();
        store.dispatch(setBills([
            mockBill({ id: '1', title: 'Ustawa o podatkach' }),
            mockBill({ id: '2', title: 'Ustawa o edukacji' }),
        ] as any));
        store.dispatch(setGlobalSearch('podatk'));
        const result = selectFilteredBills(store.getState());
        expect(result).toHaveLength(1);
        expect(result[0].title).toContain('podatkach');
    });

    // 7. selectFilteredBills — search by ID
    it('selectFilteredBills filters by id', () => {
        const store = makeStore();
        store.dispatch(setBills([
            mockBill({ id: 'ABC123', title: 'Ustawa A' }),
            mockBill({ id: 'DEF456', title: 'Ustawa B' }),
        ] as any));
        store.dispatch(setGlobalSearch('abc123'));
        expect(selectFilteredBills(store.getState())).toHaveLength(1);
    });

    // 8. selectFilteredBills — filter UE
    it('selectFilteredBills filters by UE status', () => {
        const store = makeStore();
        store.dispatch(setBills([
            mockBill({ id: '1', isEU: true, title: 'Dyrektywa UE' }),
            mockBill({ id: '2', isEU: false, title: 'Krajowa ustawa' }),
        ] as any));
        store.dispatch(setFilterStatus('UE'));
        const result = selectFilteredBills(store.getState());
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Dyrektywa UE');
    });

    // 9. selectFilteredBills — sorted by date desc
    it('selectFilteredBills sorts by date descending', () => {
        const store = makeStore();
        store.dispatch(setBills([
            mockBill({ id: '1', date: '2025-01-01', title: 'Stara' }),
            mockBill({ id: '2', date: '2026-06-15', title: 'Nowa' }),
            mockBill({ id: '3', date: '2026-03-01', title: 'Średnia' }),
        ] as any));
        const result = selectFilteredBills(store.getState());
        expect(result[0].title).toBe('Nowa');
        expect(result[1].title).toBe('Średnia');
        expect(result[2].title).toBe('Stara');
    });

    // selectBills raw
    it('selectBills returns raw items', () => {
        const store = makeStore();
        const bills = [mockBill()];
        store.dispatch(setBills(bills as any));
        expect(selectBills(store.getState())).toEqual(bills);
    });

    // selectFilter
    it('selectFilter returns the filter object', () => {
        const store = makeStore();
        store.dispatch(setFilterStatus('UE'));
        expect(selectFilter(store.getState()).status).toBe('UE');
    });
});
