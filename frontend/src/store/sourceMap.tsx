import {Place, Source, Teacher, Week} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {removeElement, updateElement} from "../utils/arrayUtils";


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

export interface ArrayChanges<T> {
    item: T;
    source: number;
}

export const sourcesMapSlice = createSlice({
    name: 'sourceMap',
    initialState,
    reducers: {
        updateSource: (state, action: PayloadAction<SourcesRepresentation>) => {
            state.sources[action.payload.source.id] = action.payload;
        },
        changePlace: (state, action: PayloadAction<ArrayChanges<Place>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            updateElement(source.places, action.payload.item, (a, b) => a.id == b.id);
        },
        removePlace: (state, action: PayloadAction<ArrayChanges<Place>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.places = removeElement(source.places, action.payload.item, (a, b) => a.id == b.id);
        },
        addPlace: (state, action: PayloadAction<ArrayChanges<Place>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.places.push(action.payload.item);
        },
        addWeek: (state, action: PayloadAction<ArrayChanges<Week>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.weeks.push(action.payload.item);
        },
        removeWeek: (state, action: PayloadAction<ArrayChanges<Week>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.weeks = removeElement<Week>(source.weeks, action.payload.item,(a, b) => a.id == b.id)
        },
        changeTeacher: (state, action: PayloadAction<ArrayChanges<Teacher>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            updateElement(source.teachers, action.payload.item, (a, b) => a.id == b.id);
        },
        removeTeacher: (state, action: PayloadAction<ArrayChanges<Teacher>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.teachers = removeElement(source.teachers, action.payload.item, (a, b) => a.id == b.id);
        },
        addTeacher: (state, action: PayloadAction<ArrayChanges<Teacher>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.teachers.push(action.payload.item);
        },
        removeSource: (state, action: PayloadAction<number>) => {
            state.sources[action.payload] = undefined;
        }
    },
});

export const { updateSource, removeSource,
    addPlace, addTeacher, addWeek,
    removePlace, removeTeacher, removeWeek,
    changePlace, changeTeacher} = sourcesMapSlice.actions;

export default sourcesMapSlice.reducer;