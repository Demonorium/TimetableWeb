import {SourcePriority} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface PrioritiesState {
    list?: Array<SourcePriority>;
}

const initialState: PrioritiesState = {
    list: new Array<SourcePriority>()
}

export const prioritiesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
        setPriorities: (state, action: PayloadAction<Array<SourcePriority>>) => {
            state.list = action.payload
        }
    },
});

export const { setPriorities} = prioritiesSlice.actions;

export default prioritiesSlice.reducer;