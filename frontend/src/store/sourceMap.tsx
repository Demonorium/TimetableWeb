import {compareEntity, Entity, LessonTemplateDto, Place, Source, Teacher, Week} from "../database";
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
    teachers: {[key: number]: Teacher};
    places: {[key: number]: Place};
    templates: {[key: number]: LessonTemplateDto};
}


const initialState: InternalRepresentationState = {
    sources: {},
    teachers: {},
    places: {},
    templates: {}
}

export interface ArrayChanges<T> {
    item: T;
    source: number;
}

function addToMap<T extends Entity>(map: {[key: number]: T}, array: Array<T>) {
    for (let i = 0; i < array.length; ++i) {
        map[array[i].id] = array[i];
    }
}

export const sourcesMapSlice = createSlice({
    name: 'sourceMap',
    initialState,
    reducers: {
        updateSource: (state, action: PayloadAction<SourcesRepresentation>) => {
            state.sources[action.payload.source.id] = action.payload;
            addToMap(state.places, action.payload.places);
            addToMap(state.teachers, action.payload.teachers);
            addToMap(state.templates, action.payload.templates);
        },
        changePlace: (state, action: PayloadAction<ArrayChanges<Place>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            updateElement<Place>(source.places, action.payload.item, compareEntity);
            state.places[action.payload.item.id] = action.payload.item;
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
            state.places[action.payload.item.id] = action.payload.item;
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
            state.teachers[action.payload.item.id] = action.payload.item;
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
            state.teachers[action.payload.item.id] = action.payload.item;
        },

        addTemplate: (state, action: PayloadAction<ArrayChanges<LessonTemplateDto>>) => {
            const source = state.sources[action.payload.source] as SourcesRepresentation;
            if (source == undefined) return;
            source.templates.push(action.payload.item);
            state.templates[action.payload.item.id] = action.payload.item;
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
            state.templates[action.payload.item.id] = action.payload.item;
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