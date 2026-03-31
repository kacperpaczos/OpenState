
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill } from '@/lib/bills';
import type { RootState } from '@/lib/store';

interface BillsState {
    items: Bill[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    filter: {
        status: string; // 'all' | 'Projekt ustawy' | 'Projekt uchwały' | 'UE'
    };
}

const initialState: BillsState = {
    items: [],
    status: 'idle',
    filter: {
        status: 'all',
    },
};

export const billsSlice = createSlice({
    name: 'bills',
    initialState,
    reducers: {
        setBills: (state, action: PayloadAction<Bill[]>) => {
            state.items = action.payload;
            state.status = 'succeeded';
        },
        setFilterStatus: (state, action: PayloadAction<string>) => {
            state.filter.status = action.payload;
        },
    },
    selectors: {
        selectBills: (state) => state.items,
        selectFilter: (state) => state.filter,
    },
});

export const { setBills, setFilterStatus } = billsSlice.actions;

// Export selectors that work with RootState
export const selectBills = (state: RootState) => state.bills.items;
export const selectFilter = (state: RootState) => state.bills.filter;
export const selectFilteredBills = (state: RootState) => {
    const { items, filter } = state.bills;
    const searchTerm = state.search ? state.search.globalSearch.toLowerCase() : '';
    const statusFilter = filter.status;

    const result = items.filter((process: Bill) => {
        const matchesSearch =
            process.title.toLowerCase().includes(searchTerm) ||
            (process.id && process.id.toLowerCase().includes(searchTerm)) ||
            (process.eli && process.eli.toLowerCase().includes(searchTerm));

        if (!matchesSearch) return false;

        if (statusFilter === 'all') return true;
        if (statusFilter === 'UE') return process.isEU;

        return process.documentType && process.documentType.includes(statusFilter);
    });

    // Always sort by date descending (newest first)
    return result.sort((a: Bill, b: Bill) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
    });
};

export default billsSlice.reducer;
