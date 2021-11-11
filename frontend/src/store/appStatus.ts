import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export enum GlobalState {
    LOADING,
    PROCESS,
    CRUSH
}

export interface Screen {
    name: string;
    params?: {[key: string]: any};
}

export interface ApplicationStatus {
    app: GlobalState;
    screen: Screen;
    back: Array<Screen>;
}

const initialState: ApplicationStatus = {
    app: GlobalState.LOADING,
    screen: {name: "DAYS"},
    back: new Array<Screen>()
}

export const appStateSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        ERROR: (state) => {
            state.app = GlobalState.CRUSH;
        },
        setAppState: (state, action: PayloadAction<GlobalState>) => {
            state.app = action.payload
        },
        setScreen:(state, action: PayloadAction<Screen>) => {
            state.back.push(state.screen);
            state.screen = action.payload;
        },
        reverse: (state) => {
            const last = state.back.pop();
            if (last != undefined) {
                state.screen = last
            }
        }
    },
});

export const {ERROR, setAppState, setScreen, reverse} = appStateSlice.actions;

export default appStateSlice.reducer;

