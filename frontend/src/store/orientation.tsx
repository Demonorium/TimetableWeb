import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum Orientation {
    LAPTOP, PHONE
}

export interface PrioritiesState {
    state: Orientation;
}

const initialState: PrioritiesState = {
    state: Orientation.LAPTOP
}

export const orientationSlice = createSlice({
    name: 'orientation',
    initialState,
    reducers: {
        setOrientation: (state, action: PayloadAction<Orientation>) => {
            state.state = action.payload;
        }
    },
});

export const { setOrientation} = orientationSlice.actions;

export default orientationSlice.reducer;