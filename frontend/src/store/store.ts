import {configureStore} from '@reduxjs/toolkit'
import userReducer from './user'
import scheduleReducer from './schedule'
import sourcesReducer from './sources'

const store = configureStore({
    reducer: {
        'user': userReducer,
        'schedule': scheduleReducer,
        'sources': sourcesReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch