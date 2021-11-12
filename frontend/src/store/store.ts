import {configureStore} from '@reduxjs/toolkit'
import userReducer from './user'
import scheduleReducer from './schedule'
import prioritiesReducer from './priorities'
import sourcesReducer from './sources'
import appStatusReducer from "./appStatus";
import sourceMapReducer from "./sourceMap";
import editorListReducer from "./editorList";

const store = configureStore({
    reducer: {
        "user": userReducer,
        "schedule": scheduleReducer,
        "priorities": prioritiesReducer,
        "sources": sourcesReducer,
        "app": appStatusReducer,
        "sourceMap": sourceMapReducer,
        "editorList": editorListReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch