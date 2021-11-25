import {configureStore} from '@reduxjs/toolkit'
import userReducer from './user'
import scheduleReducer from './schedule'
import prioritiesReducer from './priorities'
import appStatusReducer from "./appStatus";
import sourceMapReducer from "./sourceMap";
import editorListReducer from "./editorList";
import orientationReducer from "./orientation";

const store = configureStore({
    reducer: {
        "user": userReducer,
        "schedule": scheduleReducer,
        "priorities": prioritiesReducer,
        "app": appStatusReducer,
        "sourceMap": sourceMapReducer,
        "editorList": editorListReducer,
        "orientation": orientationReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch