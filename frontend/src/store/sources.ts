import {Source} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface SourcesState {
    list?: Array<Source>;
}

const initialState: SourcesState = {
    list: new Array<Source>()
}

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
        setSources: (state, action: PayloadAction<Array<Source>>) => {
            state.list = action.payload
        }
    },
});

export const { setSources} = sourcesSlice.actions;

export default sourcesSlice.reducer;