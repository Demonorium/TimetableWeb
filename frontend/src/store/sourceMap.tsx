import {compareEntity, LessonTemplate, LessonTemplateDto, Place, Source, Teacher, Week} from "../database";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {removeElement, updateElement} from "../utils/arrayUtils";


export interface SourcesRepresentation {
    source: Source;

    weeks: Array<Week>;
    places: Array<Place>;
    teachers: Array<Teacher>;
    templates: Array<LessonTemplateDto>;
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
            updateElement<Place>(source.places, action.payload.item, compareEntity);
        },
        removePlace: (state, action: PayloadAction<ArrayChanges<Place>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.places = removeElement<Place>(source.places, action.payload.item, compareEntity);
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
            source.weeks = removeElement<Week>(source.weeks, action.payload.item,compareEntity)
        },

        changeTeacher: (state, action: PayloadAction<ArrayChanges<Teacher>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            updateElement<Teacher>(source.teachers, action.payload.item, compareEntity);
        },
        removeTeacher: (state, action: PayloadAction<ArrayChanges<Teacher>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.teachers = removeElement<Teacher>(source.teachers, action.payload.item, compareEntity);
        },
        addTeacher: (state, action: PayloadAction<ArrayChanges<Teacher>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.teachers.push(action.payload.item);
        },

        addTemplate: (state, action: PayloadAction<ArrayChanges<LessonTemplateDto>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.templates.push(action.payload.item);
        },
        removeTemplate: (state, action: PayloadAction<ArrayChanges<LessonTemplateDto>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.templates = removeElement<LessonTemplateDto>(source.templates, action.payload.item, compareEntity);
        },
        changeTemplate: (state, action: PayloadAction<ArrayChanges<LessonTemplateDto>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            updateElement<LessonTemplateDto>(source.templates, action.payload.item, compareEntity);
        },

        removeSource: (state, action: PayloadAction<number>) => {
            state.sources[action.payload] = undefined;
        }
    },
});

export const { updateSource, removeSource,
    addPlace, addTeacher, addWeek, addTemplate,
    removePlace, removeTeacher, removeWeek, removeTemplate,
    changePlace, changeTeacher, changeTemplate} = sourcesMapSlice.actions;

export default sourcesMapSlice.reducer;