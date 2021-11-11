import {Place, Source, Teacher, Week} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface SourcesRepresentation {
    source: Source;

    weeks: Array<Week>;
    places: Array<Place>;
    teachers: Array<Teacher>
}

interface InternalRepresentationState {
    sources: {[key: number]: SourcesRepresentation | undefined};
}


const initialState: InternalRepresentationState = {
    sources: {}
}

export const sourcesMapSlice = createSlice({
    name: 'sourceMap',
    initialState,
    reducers: {
        updateSource: (state, action: PayloadAction<SourcesRepresentation>) => {
            state.sources[action.payload.source.id] = action.payload;
        },
        removeSource: (state, action: PayloadAction<number>) => {
            state.sources[action.payload] = undefined;
        }
    },
});

export const { updateSource, removeSource} = sourcesMapSlice.actions;

export default sourcesMapSlice.reducer;