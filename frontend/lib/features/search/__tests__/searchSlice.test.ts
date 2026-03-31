import reducer, { setGlobalSearch, selectGlobalSearch } from '../searchSlice';

describe('searchSlice', () => {
    const initialState = { globalSearch: '' };

    // 10. setGlobalSearch sets value
    it('setGlobalSearch sets the search value', () => {
        const state = reducer(initialState, setGlobalSearch('podatki'));
        expect(state.globalSearch).toBe('podatki');
    });

    // 11. setGlobalSearch('') clears
    it('setGlobalSearch with empty string clears search', () => {
        let state = reducer(initialState, setGlobalSearch('test'));
        state = reducer(state, setGlobalSearch(''));
        expect(state.globalSearch).toBe('');
    });

    // 12. selectGlobalSearch
    it('selectGlobalSearch returns globalSearch from state', () => {
        const mockState = { search: { globalSearch: 'hello' } };
        expect(selectGlobalSearch(mockState)).toBe('hello');
    });

    it('selectGlobalSearch returns empty string from initial state', () => {
        const mockState = { search: { globalSearch: '' } };
        expect(selectGlobalSearch(mockState)).toBe('');
    });
});
