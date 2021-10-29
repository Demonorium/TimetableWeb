import {SourcePriority} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface SourcesState {
    list?: Array<SourcePriority>;
}

const initialState: SourcesState = {
    list: new Array<SourcePriority>()
}

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
        setSources: (state, action: PayloadAction<Array<SourcePriority>>) => {
            state.list = action.payload
        }
    },
});

export const { setSources} = sourcesSlice.actions;

export default sourcesSlice.reducer;