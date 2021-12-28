import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {removeElement} from "../utils/arrayUtils";

export enum GlobalState {
    LOADING,
    PROCESS,
    CRUSH,
    LOGOUT
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

export interface ScreenCloser {
    screen: Screen;
    comparator: (s1: Screen, s2: Screen) => boolean;
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
        },
        closeScreens: (state, action: PayloadAction<ScreenCloser>) => {
            state.back = removeElement(state.back, action.payload.screen, action.payload.comparator);
            if (action.payload.comparator(state.screen, action.payload.screen)) {
                const last = state.back.pop();
                if (last != undefined) {
                    state.screen = last
                }
            }
        }
    },
});

export const {ERROR, setAppState, setScreen, reverse, closeScreens} = appStateSlice.actions;

export default appStateSlice.reducer;

