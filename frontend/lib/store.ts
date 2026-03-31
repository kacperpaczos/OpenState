import { configureStore } from '@reduxjs/toolkit'
import billsReducer from './features/bills/billsSlice'
import searchReducer from './features/search/searchSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            bills: billsReducer,
            search: searchReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
