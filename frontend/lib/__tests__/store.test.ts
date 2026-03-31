import { makeStore } from '@/lib/store';
import { setBills } from '@/lib/features/bills/billsSlice';
import { setGlobalSearch } from '@/lib/features/search/searchSlice';

describe('Redux Store', () => {
    // 13. makeStore() creates a store with correct shape
    it('makeStore creates store with bills and search reducers', () => {
        const store = makeStore();
        const state = store.getState();
        expect(state).toHaveProperty('bills');
        expect(state).toHaveProperty('search');
        expect(state.bills.items).toEqual([]);
        expect(state.search.globalSearch).toBe('');
    });

    // 14. Two store instances are independent
    it('two store instances do not share state', () => {
        const store1 = makeStore();
        const store2 = makeStore();

        store1.dispatch(setGlobalSearch('test'));

        expect(store1.getState().search.globalSearch).toBe('test');
        expect(store2.getState().search.globalSearch).toBe('');
    });
});
