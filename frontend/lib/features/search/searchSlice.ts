import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
    globalSearch: string;
}

const initialState: SearchState = {
    globalSearch: '',
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setGlobalSearch: (state, action: PayloadAction<string>) => {
            state.globalSearch = action.payload;
        },
    },
});

export const { setGlobalSearch } = searchSlice.actions;

export const selectGlobalSearch = (state: { search: SearchState }) => state.search.globalSearch;

export default searchSlice.reducer;
